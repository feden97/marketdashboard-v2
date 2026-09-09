import React from 'react';
import { HelpCircle } from 'lucide-react';
import { BankLogo } from '../common/BankLogo';

interface TerminalRowProps {
  name: string;
  rate: string;
  subLabel?: string;
  pills?: string[];
  isTop?: boolean;
  dateInfo?: string;
  tooltipText?: string;
}

export const TerminalRow: React.FC<TerminalRowProps> = ({
  name,
  rate,
  subLabel,
  pills = [],
  isTop = false,
  dateInfo,
  tooltipText,
}) => {
  return (
    <div className={`terminal-row${isTop ? ' terminal-highlight' : ''}`}>
      <div className="terminal-entity">
        <div className="terminal-logo">
          <BankLogo name={name} size={24} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="terminal-name" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span>{name}</span>
            {tooltipText && (
              <div
                className="tooltip-container tooltip-right"
                style={{ marginLeft: 4, color: 'var(--text-muted)', cursor: 'help' }}
              >
                <HelpCircle size={13} />
                <div
                  className="tooltip-text"
                  style={{ fontWeight: 500, textAlign: 'left', minWidth: 220 }}
                >
                  {tooltipText}
                </div>
              </div>
            )}
          </div>
          {subLabel && <div className="terminal-sub-label">{subLabel}</div>}
          {pills.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
              {pills.map((p, i) => {
                let cls = 'terminal-meta-pill';
                if (p.includes('Límite')) cls += ' pill-limit';
                if (p.includes('Liquidez')) cls += ' pill-liquidity';
                return (
                  <span key={i} className={cls}>
                    {p}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="terminal-data">
        <div className="terminal-rate-container">
          <div className="mono-rate">{rate}</div>
          <div className="terminal-rate-label">TNA</div>
        </div>
      </div>

      {dateInfo && (
        <div style={{ width: '100%', textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', opacity: 0.8 }}>
          {dateInfo}
        </div>
      )}
    </div>
  );
};
