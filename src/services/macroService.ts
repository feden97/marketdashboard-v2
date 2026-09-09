import { API_ARG_DATOS_BASE, fetchJson } from './api';
import { InflationPoint, InflationStats } from '../types/macro';

export async function fetchMacroData() {
  const currentYear = new Date().getFullYear();
  const [snapshotRes, liveInflation, liveHolidays] = await Promise.all([
    fetch('data/snapshot.json')
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetchJson<InflationPoint[]>(`${API_ARG_DATOS_BASE}/finanzas/indices/inflacion`, []),
    fetchJson<any[]>(`${API_ARG_DATOS_BASE}/feriados/${currentYear}`, []),
  ]);

  const macro = snapshotRes?.argentina_macro ?? {};
  const ipcSource: Record<string, number> = { ...(macro.ipc_history || {}) };

  // Merge live inflation points if available
  if (Array.isArray(liveInflation)) {
    liveInflation.forEach((item) => {
      if (item.fecha && item.valor != null) {
        ipcSource[item.fecha.substring(0, 7)] = item.valor / 100;
      }
    });
  }

  const MONTH_NAMES: Record<string, string> = {
    '01': 'Ene',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Abr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Ago',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dic',
  };

  const last12Keys = Object.keys(ipcSource).sort().slice(-12);
  const labels: string[] = [];
  const years: string[] = [];
  const dataPoints: number[] = [];
  let acum = 1;
  let sum = 0;

  for (const key of last12Keys) {
    const [y, m] = key.split('-');
    const val = ipcSource[key];
    labels.push(MONTH_NAMES[m] || m);
    years.push(y);
    dataPoints.push(parseFloat((val * 100).toFixed(1)));
    acum *= 1 + val;
    sum += val;
  }

  const lastMonthVal = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : 0;
  const lastMonthLabel = labels.length > 0 ? labels[labels.length - 1].toUpperCase() : '';
  const avg12m = last12Keys.length > 0 ? (sum / last12Keys.length) * 100 : 0;
  const acum12m = (acum - 1) * 100;
  const purchasingPowerCost = Math.round(10_000 * acum);

  const inflationStats: InflationStats = {
    lastMonth: lastMonthVal,
    lastMonthLabel,
    avg12m,
    acum12m,
    purchasingPowerCost,
    history: last12Keys.map((_, i) => ({
      fecha: `${labels[i]} ${years[i]}`,
      valor: dataPoints[i],
    })),
  };

  // Holidays
  let holidaysList: string[] = macro.holidays || [];
  if (holidaysList.length === 0 && Array.isArray(liveHolidays) && liveHolidays.length > 0) {
    const today = new Date();
    const upcoming = liveHolidays.filter((h) => new Date(h.fecha) >= today).slice(0, 5);
    holidaysList = upcoming.map((h) => `${h.fecha.split('-')[2]}/${h.fecha.split('-')[1]}: ${h.nombre}`);
  }

  return {
    inflationStats,
    holidaysList,
    fullHolidays: macro.full_holidays || [],
    ipcHistory: ipcSource,
    historicalFiat: snapshotRes?.historical_fiat || [],
  };
}
