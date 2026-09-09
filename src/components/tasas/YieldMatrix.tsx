import React from 'react';
import { BankLogo } from '../common/BankLogo';
import { YieldMatrixData } from '../../types/rates';

interface YieldMatrixProps {
  matrix?: YieldMatrixData | null;
}

export const YieldMatrix: React.FC<YieldMatrixProps> = ({ matrix }) => {
  if (!matrix) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px', fontSize: '13px' }}>
        Cargando rendimientos...
      </div>
    );
  }

  const { entities, coins, rateMap, tiersMap, bestPerCoin } = matrix;
  const DISPLAY: Record<string, string> = { LemonCash: 'Lemon' };

  return (
    <div className="yield-matrix-container" id="yield-matrix-wrapper">
      <table className="yield-matrix">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            {entities.map((ent) => {
              const name = DISPLAY[ent] || ent;
              return (
                <th key={ent}>
                  <div className="matrix-exchange-header">
                    <div className="matrix-exchange-icon">
                      <BankLogo name={name} size={28} />
                    </div>
                    <span>{name}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            return (
              <tr key={coin}>
                <td>
                  <div className="matrix-coin-cell">
                    <div className="matrix-coin-icon">
                      <BankLogo name={coin} size={24} />
                    </div>
                    <span>{coin}</span>
                  </div>
                </td>
                {entities.map((ent, entIdx) => {
                  const rate = rateMap[ent]?.[coin];
                  const isBest = rate !== null && rate !== undefined && rate === bestPerCoin[coin];
                  const hasTier = tiersMap[ent]?.[coin];
                  const dir = entIdx >= 3 ? 'tooltip-left' : 'tooltip-right';
                  const name = DISPLAY[ent] || ent;

                  if (rate == null) {
                    return (
                      <td key={ent} className="yield-na hide-mobile" data-exchange={name}>
                        <div className="exchange-label-mobile">
                          <div className="matrix-exchange-icon">
                            <BankLogo name={name} size={20} />
                          </div>
                          <span>{name}</span>
                        </div>
                        —
                      </td>
                    );
                  }

                  return (
                    <td
                      key={ent}
                      className={`yield-cell ${isBest ? 'best-yield' : ''}`}
                      data-exchange={name}
                    >
                      <div className="exchange-label-mobile">
                        <div className="matrix-exchange-icon">
                          <BankLogo name={name} size={20} />
                        </div>
                        <span>{name}</span>
                      </div>
                      <div className={`apy-container ${hasTier ? 'has-tooltip' : ''}`}>
                        <span className="apy-value">{rate.toFixed(2)}%</span>
                        {hasTier && (
                          <div
                            className={`tooltip-container ${dir}`}
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
                              Tasa máxima detectada.
                              <br />
                              El rendimiento varía según condiciones de la plataforma.
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
