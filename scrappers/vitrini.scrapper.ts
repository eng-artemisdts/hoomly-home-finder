import { setTimeout } from 'node:timers/promises';

// Crawlee – web scraping and browser automation library
import { CheerioCrawler, Dataset } from '@crawlee/cheerio';
// Apify SDK – toolkit for building Apify Actors
import { Actor } from 'apify';

interface Input {
    startUrls: {
        url: string;
        method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'OPTIONS' | 'CONNECT' | 'PATCH';
        headers?: Record<string, string>;
        userData?: Record<string, unknown>;
    }[];
    maxRequestsPerCrawl: number;
}

/** Código do imóvel (ex.: da URL ?codigo=43906). */
function getCodigoFromUrl(url: string): string | null {
    const match = /[?&]codigo=(\d+)/i.exec(url);
    return match ? match[1] : null;
}

/** Extrai número de um texto (ex.: "30.00 m²" -> 30, "1" -> 1). */
function parseNumber(value: string): number | null {
    const n = parseFloat(value.replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
    return Number.isNaN(n) ? null : n;
}

/** Extrai valor em R$ de texto (ex.: "R$ 1.200,00" -> "R$ 1.200"). */
function formatPriceBrl(raw: string): string {
    const match = /R\$\s*([\d.,]+)/i.exec(raw);
    if (!match) return raw.trim();
    const digits = match[1].replace(/\D/g, '');
    if (digits.length === 0) return raw.trim();
    const intPart = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0';
    const decPart = digits.slice(-2);
    return `R$ ${intPart},${decPart}`;
}

/** Extrai dados do imóvel da página de detalhe (ex.: /imovel/?codigo=43906). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDetail($: any, requestUrl: string, log: { info: (msg: string, data?: object) => void }) {
    const codigo = getCodigoFromUrl(requestUrl) ?? undefined;

    const title =
        $('h1').first().text().trim() ||
        $('meta[property="og:title"]').attr('content')?.replace(/\s*-\s*Imobiliária Vitrini\s*$/i, '').trim() ||
        $('title').text().trim();

    let location = '';
    $('h1').first().parent().find('*').each((_: number, el: unknown): boolean | void => {
        const text = $(el).text().trim();
        if (text && text !== title && /^[\w\s]+,\s*Belo Horizonte/i.test(text)) {
            location = text;
            return false;
        }
    });
    if (!location) {
        location =
            $('*[class*="localizacao"], *[class*="endereco"], *[class*="bairro"]').first().text().trim() ||
            $('p:contains("Belo Horizonte"), p:contains("Minas")').first().text().trim();
    }

    const allText = $('body').text();
    let priceRaw = '';
    const aluguelMatch = /Aluguel:\s*(R\$\s*[\d.,]+)/i.exec(allText);
    if (aluguelMatch) priceRaw = aluguelMatch[1];
    if (!priceRaw) {
        const strongR = $('strong')
            .filter((_: number, el: unknown) => /R\$\s*[\d.,]+/.test($(el).text()))
            .first()
            .text()
            .trim();
        if (strongR) priceRaw = strongR;
    }
    const price = priceRaw ? formatPriceBrl(priceRaw) : $('*[class*="preco"], *[class*="valor"]').first().text().trim();

    let condominio = '';
    const condMatch = /Condomínio:\s*(R\$\s*[\d.,]+)/i.exec(allText);
    if (condMatch) condominio = formatPriceBrl(condMatch[1]);

    let iptu = '';
    const iptuMatch = /IPTU:\s*(R\$\s*[\d.,]+)/i.exec(allText);
    if (iptuMatch) iptu = formatPriceBrl(iptuMatch[1]);

    let area: number | null = null;
    let bedrooms: number | null = null;
    let bathrooms: number | null = null;
    $('h5, h6, dt, .property-detail').each((_: number, el: unknown) => {
        const label = $(el).text().trim().toLowerCase();
        const $strong = $(el).find('strong').first();
        const value = $strong.length ? $strong.text().trim() : $(el).text().trim().replace(/^.*:\s*/i, '');
        const num = parseNumber(value);
        if (label.includes('área') || label.includes('area')) area = num ?? area;
        if (label.includes('dormitório') || label.includes('quarto')) bedrooms = num ?? bedrooms;
        if (label.includes('banheiro')) bathrooms = num ?? bathrooms;
    });
    if (area == null || bedrooms == null || bathrooms == null) {
        $('li').each((_: number, el: unknown) => {
            const text = $(el).text();
            if (/Área útil|área útil/i.test(text)) area = parseNumber(text) ?? area;
            if (/Dormitório|dormitório/i.test(text)) bedrooms = parseNumber(text) ?? bedrooms;
            if (/Banheiro/i.test(text)) bathrooms = parseNumber(text) ?? bathrooms;
        });
    }

    let description = '';
    $('h3').each((_: number, el: unknown): boolean | void => {
        if ($(el).text().trim().toLowerCase().includes('sobre o imóvel')) {
            const $next = $(el).parent().next();
            description = $next.find('p').first().text().trim() || $next.text().trim();
            return false;
        }
    });
    if (!description) {
        const $paras = $('p').filter((_: number, el: unknown) => $(el).text().length > 80);
        if ($paras.length) description = $paras.first().text().trim();
    }

    const characteristics: string[] = [];
    $('h3, h4').each((_: number, el: unknown) => {
        if (!$(el).text().trim().toLowerCase().includes('característica')) return;
        const $container = $(el).parent();
        $container.find('ul li').add($container.nextAll('ul').first().find('li')).each((__: number, li: unknown) => {
            const t = $(li).text().trim();
            if (t && t.length < 80 && !/^\d+$/.test(t)) characteristics.push(t);
        });
        return false;
    });
    const characteristicsText = characteristics.join(' ').toLowerCase();
    const furnished = /mobiliado|mobília|móveis|furnished/i.test(characteristicsText) || /mobiliado|mobília/i.test(description);
    const petFriendly = /pet|animal|gato|cachorro|aceita pet/i.test(characteristicsText) || /pet|animal|gato|cachorro/i.test(description);

    const PLACEHOLDER = '/_assets/images/imobiliaria-vitrini.webp';
    let image: string | undefined = $('meta[property="og:image"]').attr('content') || undefined;
    if (!image || image.includes(PLACEHOLDER)) {
        image = undefined;
        const slideLinks = $('div.swiper-slide a, [class*="gallery"] a').toArray();
        for (const el of slideLinks) {
            const href = $(el).attr('href');
            const styleAttr = $(el).attr('style');
            if (href && !href.includes(PLACEHOLDER)) {
                image = href.startsWith('http') ? href : new URL(href, requestUrl).href;
                break;
            }
            if (styleAttr) {
                const match = /url\(([^)]+)\)/.exec(styleAttr);
                if (match) {
                    const candidate = match[1].replace(/['"]/g, '').trim();
                    if (!candidate.includes(PLACEHOLDER)) {
                        image = candidate.startsWith('http') ? candidate : new URL(candidate, requestUrl).href;
                        break;
                    }
                }
            }
            const imgSrc = $(el).find('img').attr('src');
            if (imgSrc && !imgSrc.includes(PLACEHOLDER)) {
                image = imgSrc.startsWith('http') ? imgSrc : new URL(imgSrc, requestUrl).href;
                break;
            }
        }
        if (!image) {
            const firstImg = $('img[src*="fotos"], img[src*="cdn"], img[src*="photo"]').first().attr('src');
            if (firstImg && !firstImg.includes(PLACEHOLDER)) {
                image = firstImg.startsWith('http') ? firstImg : new URL(firstImg, requestUrl).href;
            }
        }
    } else if (image && !image.startsWith('http')) {
        image = new URL(image, requestUrl).href;
    }

    const payload = {
        url: requestUrl,
        codigo: codigo || undefined,
        title,
        price,
        condominio: condominio || undefined,
        iptu: iptu || undefined,
        location,
        address: location,
        neighborhood: location.split(',')[0]?.trim() || location,
        area: area ?? undefined,
        bedrooms: bedrooms ?? undefined,
        bathrooms: bathrooms ?? undefined,
        description: description || undefined,
        furnished,
        petFriendly,
        characteristics: characteristics.length ? characteristics : undefined,
        image,
        source: 'vitrini' as const,
    };

    log.info('Dados extraídos do imóvel', {
        url: requestUrl,
        codigo: payload.codigo,
        title: payload.title,
        price: payload.price,
        area: payload.area,
        bedrooms: payload.bedrooms,
        bathrooms: payload.bathrooms,
        furnished: payload.furnished,
        petFriendly: payload.petFriendly,
    });

    return payload;
}

await Actor.init();

Actor.on('aborting', async () => {
    await setTimeout(1000);
    await Actor.exit();
});

const {
    startUrls = [
        {
            url: 'https://imobiliariavitrini.com.br/buscar-imoveis/imoveis-para-alugar/?ordenacao=menor-preco&cidade=',
        },
    ],
    maxRequestsPerCrawl = 100,
} = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration({ checkAccess: true });

const crawler = new CheerioCrawler({
    proxyConfiguration,
    maxRequestsPerCrawl,
    async requestHandler({ request, $, enqueueLinks, log }) {
        const { label } = (request.userData as { label?: string }) ?? {};

        if (label === 'DETAIL') {
            const loadedUrl = request.loadedUrl ?? request.url;
            const payload = extractDetail($, loadedUrl, log);
            await Dataset.pushData(payload);
            return;
        }

        // Tratamento de páginas de listagem
        await enqueueLinks({
            globs: ['**/imovel*codigo=*'],
            label: 'DETAIL',
        });

        await enqueueLinks({
            globs: ['https://imobiliariavitrini.com.br/buscar-imoveis/imoveis-para-alugar/**'],
            label: 'LIST',
        });

        log.info(`Página de listagem processada: ${request.loadedUrl}`);
    },
});

await crawler.run(startUrls);
await Actor.exit();