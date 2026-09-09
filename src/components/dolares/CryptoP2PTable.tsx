import React from 'react';
import { BankLogo } from '../common/BankLogo';
import { formatCurrency } from '../../utils/formatters';
import { ProcessedCryptoExchangeRow } from '../../services/quotesService';

interface CryptoP2PTableProps {
  exchanges: ProcessedCryptoExchangeRow[];
}

export const CryptoP2PTable: React.FC<CryptoP2PTableProps> = ({ exchanges }) => {
  return (
    <div className="tables-grid-item">
      <table className="data-table" style={{ border: 'none' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 10px' }}>Exchange (USDT)</th>
            <th style={{ padding: '8px 10px', textAlign: 'center' }}>Compra a</th>
            <th style={{ padding: '8px 10px', textAlign: 'center' }}>Venta a</th>
          </tr>
        </thead>
        <tbody>
          {exchanges.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                Cargando exchanges...
              </td>
            </tr>
          ) : (
            exchanges.map((e) => (
              <tr key={e.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BankLogo name={e.name} size={20} />
                    <span style={{ fontWeight: 500 }}>{e.name}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`font-tabular ${e.isMinCompra ? 'text-highlight-green' : ''}`}>
                    {formatCurrency(e.compra_a)}
                  </span>
                </td>
                <td style={{ textAlign: 'center', position: 'relative' }}>
                  <span className={`font-tabular ${e.isMaxVenta ? 'text-highlight-green' : ''}`}>
                    {formatCurrency(e.venta_a)}
                  </span>
                  {e.isVisualOnly && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '1px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '8px',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                      }}
                    >
                      (Solo visual)
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
