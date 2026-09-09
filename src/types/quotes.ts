export interface DolarQuote {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
  variacion?: number;
}

export interface CryptoExchange {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

export interface CriptoYaData {
  [exchange: string]: CryptoExchange;
}

export interface CriptoYaDolar {
  [key: string]: {
    price: number;
    variation?: number;
    timestamp?: number;
  } | number;
}

export interface HistoricalRate {
  fecha: string;
  compra: number;
  venta: number;
}

export interface BandasDataPoint {
  fecha: string;
  mayorista: number;
  techo: number;
  piso: number;
  inf?: number;
  sup?: number;
}

export interface GaugeZone {
  name: string;
  minVal: number;
  maxVal: number;
  color: string;
  rangePercent: string;
}
