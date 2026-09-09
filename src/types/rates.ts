export interface PlazoFijoRaw {
  entidad: string;
  logo?: string;
  fecha: string;
  tnaClientes: number;
  tnaNoClientes?: number;
}

export interface ProcessedPlazoFijo {
  name: string;
  rate: number;
  date?: string;
}

export interface CuentaRemuneradaRaw {
  fondo: string;
  tna: number;
  tea?: number;
  tope?: number;
  fecha?: string;
  condicionesCorto?: string;
}

export interface ProcessedCuentaRemunerada {
  name: string;
  tnaFormatted: string;
  tnaNumber: number;
  subLabel: string;
  limits: string[];
  isTop: boolean;
  dateStr: string;
  tooltip: string;
}

export interface FciRaw {
  fondo: string;
  vcp: number;
  fecha: string;
  cc?: number;
}

export interface ProcessedFci {
  name: string;
  desc: string;
  dateStr: string;
  rate: number;
}

export interface RendimientoItem {
  moneda: string;
  apy: number;
}

export interface RendimientoProviderRaw {
  entidad: string;
  rendimientos: RendimientoItem[];
}

export interface YieldMatrixData {
  entities: string[];
  coins: string[];
  rateMap: Record<string, Record<string, number | null>>;
  tiersMap: Record<string, Record<string, boolean>>;
  bestPerCoin: Record<string, number | null>;
}
