/**
 * Utility formatters for financial figures, percentages, dates, and limits.
 */

export function formatDate(dStr?: string | null): string {
  if (!dStr) return '';
  const parts = dStr.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dStr;
}

export function formatLimit(v?: number | null): string | null {
  if (!v) return null;
  return v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(0)} M`
    : `$${(v / 1_000).toFixed(0)} K`;
}

export function formatCurrency(val?: number | null, decimals = 2): string {
  if (val == null || isNaN(val)) return '$0,00';
  return `$${val.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPercent(val?: number | null, decimals = 2): string {
  if (val == null || isNaN(val)) return '0,00%';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function getVarMeta(v?: number | null): { text: string; colorClass: string } {
  if (v == null || isNaN(v)) return { text: '-', colorClass: '' };
  const sign = v > 0 ? '+' : '';
  const colorClass = v >= 0 ? 'badge-green' : 'badge-red';
  return {
    text: `${sign}${v.toFixed(2)}%`,
    colorClass,
  };
}

export function getBrechaMeta(val?: number | null, basePrice?: number | null): { text: string; colorClass: string } {
  if (!basePrice || !val || isNaN(val) || isNaN(basePrice)) return { text: '-', colorClass: '' };
  const pct = ((val / basePrice) - 1) * 100;
  const sign = pct > 0 ? '+' : '';
  const colorClass = pct >= 0 ? 'badge-green' : 'badge-red';
  return {
    text: `${sign}${pct.toFixed(2)}%`,
    colorClass,
  };
}
