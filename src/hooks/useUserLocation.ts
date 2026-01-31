import { useState, useEffect } from "react";
import { BH_CENTER } from "@/lib/geo";

export interface UserLocationState {
  /** Coordenadas do usuário (ou centro de BH como fallback). */
  coords: { lat: number; lng: number };
  /** true se veio da geolocalização do navegador. */
  isFromGeolocation: boolean;
  /** Carregando permissão/posição. */
  loading: boolean;
  /** Erro ao obter localização (ex.: permissão negada). */
  error: string | null;
}

/**
 * Obtém a localização do usuário via Geolocation API.
 * Se o usuário negar ou não houver suporte, usa o centro de BH como referência.
 */
export function useUserLocation(): UserLocationState {
  const [state, setState] = useState<UserLocationState>({
    coords: BH_CENTER,
    isFromGeolocation: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: "Geolocalização não suportada",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          isFromGeolocation: true,
          loading: false,
          error: null,
        });
      },
      () => {
        setState((s) => ({
          ...s,
          coords: BH_CENTER,
          isFromGeolocation: false,
          loading: false,
          error: "Localização não disponível",
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return state;
}
