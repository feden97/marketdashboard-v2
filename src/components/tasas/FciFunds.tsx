import React from 'react';
import { TerminalRow } from './TerminalRow';
import { ProcessedFci } from '../../types/rates';

interface FciFundsProps {
  fcis: ProcessedFci[];
}

export const FciFunds: React.FC<FciFundsProps> = ({ fcis }) => {
  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">📊 Fondos Comunes de Inversión</div>
        <div className="terminal-subtitle">
          TNA Variable. Retiro de saldo variable (inmediato o T+1)
        </div>
      </div>
      <div id="ars-fci-container">
        {fcis.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: '13px' }}>
            Cargando FCI...
          </div>
        ) : (
          fcis.map((fci, i) => (
            <TerminalRow
              key={i}
              name={fci.name}
              rate={`${(fci.rate * 100).toFixed(2)}%`}
              subLabel={fci.desc}
              isTop={i === 0}
              dateInfo={fci.dateStr}
            />
          ))
        )}
      </div>
    </div>
  );
};
