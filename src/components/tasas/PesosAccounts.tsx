import React from 'react';
import { Wallet } from 'lucide-react';
import { TerminalRow } from './TerminalRow';
import { ProcessedCuentaRemunerada } from '../../types/rates';

interface PesosAccountsProps {
  accounts: ProcessedCuentaRemunerada[];
}

export const PesosAccounts: React.FC<PesosAccountsProps> = ({ accounts }) => {
  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wallet size={16} />
          <span>Cuentas Remuneradas y Billeteras</span>
        </div>
        <div className="terminal-subtitle">
          TNA Fija, garantizada. Ingreso y retiro de saldo inmediato. Plazo mínimo 1 día
        </div>
      </div>
      <div id="ars-accounts-container">
        {accounts.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: '13px' }}>
            Cargando cuentas...
          </div>
        ) : (
          accounts.map((acc, i) => (
            <TerminalRow
              key={i}
              name={acc.name}
              rate={acc.tnaFormatted}
              subLabel={acc.subLabel}
              pills={acc.limits}
              isTop={acc.isTop}
              dateInfo={acc.dateStr}
              tooltipText={acc.tooltip}
            />
          ))
        )}
      </div>
    </div>
  );
};
