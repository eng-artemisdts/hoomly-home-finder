const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/data/apartments.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function brlToNum(s) {
  if (typeof s !== 'string') return null;
  const m = /R\$\s*([\d.,]+)/i.exec(s);
  if (!m) return null;
  const digits = m[1].replace(/\D/g, '');
  return digits.length ? parseInt(digits, 10) / 100 : null;
}

const out = data.map((item) => {
  const r = { ...item };
  if (typeof r.price === 'string') {
    const n = brlToNum(r.price);
    r.price = typeof n === 'number' ? n : 0;
  }
  if (typeof r.condominio === 'string') {
    const n = brlToNum(r.condominio);
    if (n !== null) r.condominio = n;
    else delete r.condominio;
  }
  if (typeof r.iptu === 'string') {
    const n = brlToNum(r.iptu);
    if (n !== null) r.iptu = n;
    else delete r.iptu;
  }
  if (!r.origin) r.origin = 'vitrini';
  return r;
});

fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2));
console.log('Converted', out.length, 'items. Sample:', out[0].price, out[0].condominio, out[0].iptu);
