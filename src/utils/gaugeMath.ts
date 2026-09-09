import { BandasDataPoint } from '../types/quotes';

export function generateDatosBandas(macroIpcHistory?: Record<string, string | number>): BandasDataPoint[] {
  const points: BandasDataPoint[] = [];
  const dStart = new Date(2026, 0, 1);
  const dEnd = new Date();
  dEnd.setDate(dEnd.getDate() + 30);

  let currentInf = 916.275;
  let currentSup = 1526.596;

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getIPCForMonth = (y: number, m: number) => {
    let tM = m - 2;
    let tY = y;
    if (tM < 0) {
      tM += 12;
      tY -= 1;
    }
    const key = `${tY}-${String(tM + 1).padStart(2, '0')}`;
    const val = macroIpcHistory?.[key];
    return typeof val === 'number' ? val : parseFloat(String(val ?? '0.02'));
  };

  for (let d = new Date(dStart); d <= dEnd; d.setDate(d.getDate() + 1)) {
    const m = d.getMonth();
    const y = d.getFullYear();
    const ipc = getIPCForMonth(y, m);
    const days = getDaysInMonth(y, m);
    currentSup *= Math.pow(1 + ipc, 1 / days);
    currentInf *= Math.pow(1 - ipc, 1 / days);

    const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    points.push({
      fecha: dateStr,
      mayorista: 0,
      inf: +currentInf.toFixed(2),
      techo: +currentSup.toFixed(2),
      piso: +currentInf.toFixed(2),
    });
  }

  return points;
}

export function getBandaForToday(bandas: BandasDataPoint[]): { inf: number; sup: number } {
  if (!bandas.length) return { inf: 916.27, sup: 1526.6 };
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  const match = bandas.find((b) => b.fecha === todayStr);
  if (match) return { inf: match.piso, sup: match.techo };

  const pastMatch = [...bandas].reverse().find((b) => {
    const parts = b.fecha.split('-');
    if (parts.length !== 3) return false;
    const [dd, mm, yyyy] = parts;
    return new Date(+yyyy, +mm - 1, +dd) <= today;
  });

  return pastMatch ? { inf: pastMatch.piso, sup: pastMatch.techo } : { inf: bandas[0].piso, sup: bandas[0].techo };
}

export function calculateGaugeState(mayorista: number, inf: number, sup: number) {
  const rango = Math.max(1, sup - inf);
  const posPct = Math.max(0, Math.min(100, ((mayorista - inf) / rango) * 100));
  const angleDeg = (posPct / 100) * 180 - 90;

  const [bg, text, zoneName] =
    posPct <= 25
      ? ['#10b981', '#ffffff', 'Favorable']
      : posPct <= 75
      ? ['#facc15', '#111b21', 'Intermedio']
      : posPct <= 90
      ? ['#f97316', '#ffffff', 'Precaución']
      : ['#ef4444', '#ffffff', 'Crítico'];

  const dS = sup - mayorista;
  const pS = mayorista > 0 ? (dS / mayorista) * 100 : 0;
  const dI = mayorista - inf;
  const pI = mayorista > 0 ? (dI / mayorista) * 100 : 0;

  return {
    posPct,
    angleDeg,
    bg,
    text,
    zoneName,
    diffSup: dS,
    pctSup: pS,
    diffInf: Math.abs(dI),
    pctInf: Math.abs(pI),
    c25: inf + rango * 0.25,
    c75: inf + rango * 0.75,
    c90: inf + rango * 0.9,
  };
}
