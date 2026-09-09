import React from 'react';
import { TerminalRow } from './TerminalRow';
import { ProcessedPlazoFijo } from '../../types/rates';
import { formatDate } from '../../utils/formatters';

interface PlazosFijosProps {
  plazosFijos: ProcessedPlazoFijo[];
}

export const PlazosFijos: React.FC<PlazosFijosProps> = ({ plazosFijos }) => {
  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">🏦 Plazo Fijo</div>
        <div className="terminal-subtitle">TNA Fija, garantizada. Plazo mínimo 30 días</div>
      </div>
      <div id="ars-pf-list">
        {plazosFijos.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: '13px' }}>
            Cargando plazos fijos...
          </div>
        ) : (
          plazosFijos.map((pf, i) => (
            <TerminalRow
              key={i}
              name={pf.name}
              rate={`${(pf.rate * 100).toFixed(2)}%`}
              subLabel="Plazo Fijo"
              isTop={i === 0}
              dateInfo={pf.date ? `TNA vigente desde el ${formatDate(pf.date)}` : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
