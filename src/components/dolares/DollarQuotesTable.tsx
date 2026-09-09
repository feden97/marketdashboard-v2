import React from 'react';
import { VarBadge, BrechaBadge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { ProcessedFiatQuotes } from '../../services/quotesService';

export type BaseCurrency = 'usdt' | 'oficial' | 'mep' | 'ccl' | 'blue';

interface DollarQuotesTableProps {
  fiatData?: ProcessedFiatQuotes;
  maxVentaUsdt: number;
  usdtVar: number;
  baseCurrency: BaseCurrency;
}

export const DollarQuotesTable: React.FC<DollarQuotesTableProps> = ({
  fiatData,
  maxVentaUsdt,
  usdtVar,
  baseCurrency,
}) => {
  if (!fiatData) {
    return (
      <div className="tables-grid-item">
        <table className="data-table" style={{ border: 'none' }}>
          <tbody>
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                Cargando cotizaciones...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const basePrice =
    baseCurrency === 'usdt' ? maxVentaUsdt : fiatData[baseCurrency]?.price || 0;

  const fiatRows: { key: keyof ProcessedFiatQuotes; name: string }[] = [
    { key: 'ccl', name: 'CCL' },
    { key: 'mep', name: 'MEP' },
    { key: 'oficial', name: 'OFICIAL' },
    { key: 'blue', name: 'BLUE' },
  ];

  return (
    <div className="tables-grid-item">
      <table className="data-table" style={{ border: 'none' }}>
        <thead>
          <tr>
            <th style={{ border: 'none' }}>Dólar</th>
            <th style={{ border: 'none' }}>Precio</th>
            <th style={{ border: 'none' }}>Var.</th>
            <th style={{ border: 'none' }}>Brecha s/</th>
          </tr>
        </thead>
        <tbody>
          {fiatRows.map(({ key, name }) => {
            const rowData = fiatData[key];
            const isBase = baseCurrency === key;

            return (
              <tr key={key}>
                <td style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>{name}</td>
                <td style={{ fontWeight: 'bold' }}>{formatCurrency(rowData.price)}</td>
                <td>
                  <VarBadge value={rowData.var} />
                </td>
                <td>{isBase ? '-' : <BrechaBadge value={rowData.price} basePrice={basePrice} />}</td>
              </tr>
            );
          })}

          {/* USDT Row */}
          <tr>
            <td style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              USDT
              <div
                className="tooltip-container tooltip-right"
                style={{ marginLeft: 4, color: 'var(--text-muted)', cursor: 'help' }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className="tooltip-text" style={{ fontWeight: 600, textAlign: 'left', minWidth: 200 }}>
                  Es el dólar cripto que cotiza las 24 horas TODOS los días. Es el precio para comprar USDT en
                  Binance p2p más aproximado posible sin la opción "comerciantes verificados".
                </div>
              </div>
            </td>
            <td style={{ fontWeight: 'bold' }}>{formatCurrency(maxVentaUsdt)}</td>
            <td>
              <VarBadge value={usdtVar} />
            </td>
            <td>{baseCurrency === 'usdt' ? '-' : <BrechaBadge value={maxVentaUsdt} basePrice={basePrice} />}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
