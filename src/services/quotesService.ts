import { API_CRYPTO_BASE, fetchJson } from './api';
import { CriptoYaData, CryptoExchange } from '../types/quotes';

export interface ProcessedFiatQuotes {
  ccl: { price: number; var: number };
  mep: { price: number; var: number };
  oficial: { price: number; var: number };
  blue: { price: number; var: number };
  mayorista: { price: number; var: number };
  tarjeta: { price: number; var: number };
}

export interface ProcessedCryptoExchangeRow {
  id: string;
  name: string;
  compra_a: number;
  venta_a: number;
  isMinCompra?: boolean;
  isMaxVenta?: boolean;
  isVisualOnly?: boolean;
}

export interface LiveQuotesResult {
  fiatData: ProcessedFiatQuotes;
  usdtVar: number;
  exchanges: ProcessedCryptoExchangeRow[];
  minCompra: number;
  maxVenta: number;
  cheapestDollar: { name: string; price: number };
}

export async function fetchLiveQuotes(): Promise<LiveQuotesResult> {
  const [cryptoData, p2pData, criptoYaDolar] = await Promise.all([
    fetchJson<CriptoYaData>(`${API_CRYPTO_BASE}/usdt/ars/0.1`, {}),
    fetchJson<CryptoExchange | null>(`${API_CRYPTO_BASE}/binancep2p/usdt/ars/0.1`, null),
    fetchJson<any>(`${API_CRYPTO_BASE}/dolar`, {}),
  ]);

  const EX_ORDER = ['fiwind', 'lemoncash', 'bybitp2p', 'letsbit'];
  const NAME_MAP: Record<string, string> = { bybitp2p: 'BybitP2P', letsbit: 'LB Finanzas' };

  let minCompra = Infinity;
  let maxVenta = 0;
  const exchanges: ProcessedCryptoExchangeRow[] = [];

  for (const ex of EX_ORDER) {
    const d = cryptoData[ex];
    if (!d) continue;

    if (ex !== 'bybitp2p') {
      if (d.totalAsk < minCompra) minCompra = d.totalAsk;
      if (d.totalBid > maxVenta) maxVenta = d.totalBid;
    }

    exchanges.push({
      id: ex,
      name: NAME_MAP[ex] ?? (ex.charAt(0).toUpperCase() + ex.slice(1)),
      compra_a: d.totalAsk,
      venta_a: d.totalBid,
      isVisualOnly: ex === 'bybitp2p',
    });
  }

  if (p2pData) {
    if (p2pData.totalAsk < minCompra) minCompra = p2pData.totalAsk;
    if (p2pData.totalBid > maxVenta) maxVenta = p2pData.totalBid;
    exchanges.push({
      id: 'p2p',
      name: 'BinanceP2P',
      compra_a: p2pData.totalAsk,
      venta_a: p2pData.totalBid,
    });
  }

  // Mark highlights
  exchanges.forEach((e) => {
    if (!e.isVisualOnly) {
      e.isMinCompra = e.compra_a === minCompra;
      e.isMaxVenta = e.venta_a === maxVenta;
    }
  });

  const getDolarData = (obj: any) => {
    if (!obj) return { price: 0, var: 0 };
    const src = obj.al30?.['24hs'] ?? obj.al30?.ci ?? obj;
    return { price: src.price ?? src.ask ?? 0, var: src.variation ?? 0 };
  };

  const fiatData: ProcessedFiatQuotes = {
    ccl: getDolarData(criptoYaDolar.ccl),
    mep: getDolarData(criptoYaDolar.mep),
    oficial: getDolarData(criptoYaDolar.oficial),
    blue: getDolarData(criptoYaDolar.blue),
    mayorista: getDolarData(criptoYaDolar.mayorista),
    tarjeta: getDolarData(criptoYaDolar.tarjeta),
  };

  const usdtVar = criptoYaDolar.cripto?.usdt?.variation ?? 0;

  // Calculate cheapest dollar
  let minFiatName = 'usdt';
  let minFiatVal = maxVenta > 0 ? maxVenta : Infinity;

  const fiatKeys: (keyof ProcessedFiatQuotes)[] = ['ccl', 'mep', 'oficial', 'blue'];
  for (const f of fiatKeys) {
    if (fiatData[f].price > 0 && fiatData[f].price < minFiatVal) {
      minFiatVal = fiatData[f].price;
      minFiatName = f;
    }
  }

  return {
    fiatData,
    usdtVar,
    exchanges,
    minCompra,
    maxVenta,
    cheapestDollar: {
      name: minFiatName.toUpperCase(),
      price: minFiatVal === Infinity ? 0 : minFiatVal,
    },
  };
}

export async function fetchHistoricalFiat(): Promise<any[]> {
  try {
    const res = await fetch('data/snapshot.json');
    if (!res.ok) return [];
    const snapshot = await res.json();
    return snapshot?.historical_fiat ?? [];
  } catch (err) {
    console.warn('Could not fetch snapshot historical fiat:', err);
    return [];
  }
}
