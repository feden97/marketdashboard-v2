import { API_ARG_DATOS_BASE, fetchJson } from './api';
import {
  CuentaRemuneradaRaw,
  FciRaw,
  PlazoFijoRaw,
  ProcessedCuentaRemunerada,
  ProcessedFci,
  ProcessedPlazoFijo,
  RendimientoProviderRaw,
  YieldMatrixData,
} from '../types/rates';
import { formatDate, formatLimit } from '../utils/formatters';

export async function fetchRatesData() {
  const [pfData, remuData, rendData, fciUltimo, fciPenultimo] = await Promise.all([
    fetchJson<PlazoFijoRaw[]>(`${API_ARG_DATOS_BASE}/finanzas/tasas/plazoFijo`, []),
    fetchJson<CuentaRemuneradaRaw[]>(`${API_ARG_DATOS_BASE}/finanzas/fci/otros/ultimo`, []),
    fetchJson<RendimientoProviderRaw[]>(`${API_ARG_DATOS_BASE}/finanzas/rendimientos`, []),
    fetchJson<FciRaw[]>(`${API_ARG_DATOS_BASE}/finanzas/fci/mercadoDinero/ultimo`, []),
    fetchJson<FciRaw[]>(`${API_ARG_DATOS_BASE}/finanzas/fci/mercadoDinero/penultimo`, []),
  ]);

  const plazosFijos = processPlazosFijos(pfData);
  const cuentasRemuneradas = processCuentasRemuneradas(remuData);
  const fcis = processFCI(fciUltimo, fciPenultimo);
  const yieldMatrix = processYieldMatrix(rendData);

  return {
    plazosFijos,
    cuentasRemuneradas,
    fcis,
    yieldMatrix,
    bestPf: plazosFijos[0] ?? null,
    bestYieldAccount: cuentasRemuneradas[0] ?? null,
  };
}

function processPlazosFijos(pfData: PlazoFijoRaw[]): ProcessedPlazoFijo[] {
  const ALLOWED = [
    'NACION',
    'PROVINCIA',
    'CIUDAD',
    'SANTANDER',
    'GALICIA',
    'BBVA',
    'MACRO',
    'BRUBANK',
    'DEL SOL',
    'UALA',
    'SUPERVIELLE',
  ];

  const NAME_MAP: Record<string, string> = {
    NACION: 'Banco Nación',
    PROVINCIA: 'Banco Provincia',
    CIUDAD: 'Banco Ciudad',
    SANTANDER: 'Banco Santander',
    'GALICIA MAS': 'Banco Galicia Más (ex HSBC)',
    HSBC: 'Banco Galicia Más (ex HSBC)',
    GALICIA: 'Banco Galicia',
    BBVA: 'BBVA',
    MACRO: 'Banco Macro',
    BRUBANK: 'Brubank',
    'DEL SOL': 'Banco del Sol',
    UALA: 'Ualá',
    SUPERVIELLE: 'Banco Supervielle',
  };

  const seen = new Set<string>();
  const unique: ProcessedPlazoFijo[] = [];

  for (const p of pfData) {
    const upper = (p.entidad || '').toUpperCase();
    if (!ALLOWED.some((a) => upper.includes(a))) continue;

    let cleanName = p.entidad.replace('BANCO ', '').replace(' DE LA ', ' ').substring(0, 25);
    for (const [key, val] of Object.entries(NAME_MAP)) {
      if (upper.includes(key)) {
        cleanName = val;
        break;
      }
    }

    if (!seen.has(cleanName)) {
      seen.add(cleanName);
      unique.push({ name: cleanName, rate: p.tnaClientes, date: p.fecha });
    }
  }

  return unique.sort((a, b) => (b.rate || 0) - (a.rate || 0));
}

function processCuentasRemuneradas(remuData: CuentaRemuneradaRaw[]): ProcessedCuentaRemunerada[] {
  const FILTER_NAMES = ['CARREFOUR', 'FIWIND', 'NARANJA', 'UALA'];

  const NAME_OVERRIDES: Record<string, string> = {
    'UALA PLUS 2': 'Ualá Plus 2',
    'UALA PLUS 1': 'Ualá Plus 1',
    UALA: 'Ualá',
    'NARANJA X': 'Naranja X',
    FIWIND: 'Fiwind',
    CARREFOUR: 'Carrefour Banco',
  };

  const TOOLTIPS: Record<string, string> = {
    'Ualá Plus 1':
      'Acumulá $250.000 entre inversiones, consumos con tarjeta y cobros con Ualá Bis para acceder a la tasa Plus 1 el próximo mes.',
    'Ualá Plus 2':
      'Acumulá $500.000 entre inversiones, consumos con tarjeta y cobros con Ualá Bis para acceder a la tasa Plus 2 el próximo mes.',
  };

  const filtered = remuData
    .filter((e) => FILTER_NAMES.some((f) => e.fondo.toUpperCase().includes(f)))
    .sort((a, b) => (b.tna || 0) - (a.tna || 0));

  return filtered.map((acc, idx) => {
    const rawUpper = acc.fondo.toUpperCase().trim();
    const name =
      Object.entries(NAME_OVERRIDES).find(([k]) => rawUpper.includes(k))?.[1] ??
      acc.fondo.replace('BANCO', '').trim();
    const tnaFormatted = (acc.tna * 100).toFixed(2) + '%';

    let limitTxt: string | null = null;
    if (name === 'Fiwind') limitTxt = 'Límite: $750 K';
    else if (name === 'Carrefour Banco') limitTxt = 'Sin Límites';
    else if (acc.tope) limitTxt = `Límite: ${formatLimit(acc.tope)}`;

    const subLabel = rawUpper.includes('FIWIND') ? 'Billetera Virtual' : 'Cuenta Remunerada';
    const dateStr = acc.fecha ? `TNA vigente desde el ${formatDate(acc.fecha)}` : '';
    const tooltip = acc.condicionesCorto || TOOLTIPS[name] || '';

    return {
      name,
      tnaFormatted,
      tnaNumber: acc.tna,
      subLabel,
      limits: limitTxt ? [limitTxt] : [],
      isTop: idx === 0,
      dateStr,
      tooltip,
    };
  });
}

function processFCI(fciUltimo: FciRaw[], fciPenultimo: FciRaw[]): ProcessedFci[] {
  const ALLOWED_FCI = [
    { key: 'PREX', name: 'Prex', desc: 'Allaria Ahorro - Clase E' },
    { key: 'PERSONAL', name: 'Personal Pay', desc: 'Delta Pesos - Clase X' },
    { key: 'UALA', name: 'Ualá', desc: 'Ualintec Ahorro Pesos - Clase A' },
    { key: 'CLARO', name: 'Claro Pay', desc: 'SBS Ahorro Pesos - Clase A' },
    { key: 'MERCADO', name: 'Mercado Pago', desc: 'Mercado Fondo - Clase A' },
    { key: 'LEMON', name: 'Lemon', desc: 'Fima Premium - Clase P' },
    { key: 'FIWIND', name: 'Fiwind', desc: 'Delta Pesos - Clase A' },
  ];

  const items: ProcessedFci[] = ALLOWED_FCI.flatMap((f) => {
    const ult = fciUltimo.find((i) => i.fondo?.toUpperCase() === f.desc.toUpperCase());
    const pen = fciPenultimo.find((i) => i.fondo?.toUpperCase() === f.desc.toUpperCase());
    if (!ult?.vcp || !pen?.vcp) return [];

    const days = (new Date(ult.fecha).getTime() - new Date(pen.fecha).getTime()) / 86_400_000;
    if (days <= 0) return [];

    const tna = ((ult.vcp / pen.vcp - 1) / days) * 365;
    const dateStr = `Entre ${formatDate(pen.fecha)} y ${formatDate(ult.fecha)}`;
    return [{ name: f.name, desc: f.desc, dateStr, rate: tna }];
  });

  return items.sort((a, b) => b.rate - a.rate);
}

function processYieldMatrix(rendData: RendimientoProviderRaw[]): YieldMatrixData {
  const ENTITIES = ['Fiwind', 'LB', 'Belo', 'LemonCash', 'Vesseo'];
  const API_KEY: Record<string, string> = {
    Fiwind: 'fiwind',
    LB: 'letsbit',
    Belo: 'belo',
    LemonCash: 'lemoncash',
    Vesseo: 'vesseo',
  };
  const COINS = ['USDT', 'USDC', 'DAI'];

  const rateMap: Record<string, Record<string, number | null>> = {};
  const tiersMap: Record<string, Record<string, boolean>> = {};

  for (const ent of ENTITIES) {
    rateMap[ent] = {};
    tiersMap[ent] = {};
    const provider = rendData.find((d) => d.entidad.toLowerCase() === API_KEY[ent].toLowerCase());

    for (const coin of COINS) {
      tiersMap[ent][coin] = false;
      if (!provider) {
        rateMap[ent][coin] = null;
        continue;
      }

      const matches = provider.rendimientos.filter((r) => r.moneda.toUpperCase() === coin && r.apy > 0);
      if (!matches.length) {
        rateMap[ent][coin] = null;
        continue;
      }

      const best = matches.reduce((a, b) => (a.apy > b.apy ? a : b));
      rateMap[ent][coin] = best.apy;

      const uniqueRates = new Set(matches.map((r) => r.apy));
      if (uniqueRates.size > 1) {
        tiersMap[ent][coin] = true;
      }
    }
  }

  const bestPerCoin: Record<string, number | null> = {};
  for (const coin of COINS) {
    const best = ENTITIES.reduce((max, ent) => Math.max(max, rateMap[ent][coin] ?? -1), -1);
    bestPerCoin[coin] = best > 0 ? best : null;
  }

  return {
    entities: ENTITIES,
    coins: COINS,
    rateMap,
    tiersMap,
    bestPerCoin,
  };
}
