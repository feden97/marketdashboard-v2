import React from 'react';
import { Calendar } from 'lucide-react';

interface HolidaysListProps {
  holidays: string[];
}

export const HolidaysList: React.FC<HolidaysListProps> = ({ holidays }) => {
  return (
    <div className="radar-bottom-card holidays-panel">
      <div className="radar-bottom-header">
        <h3 className="radar-bottom-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} className="radar-icon-accent" />
          <span>Próximos Feriados</span>
        </h3>
      </div>
      <ul className="macro-list-premium holidays-list">
        {holidays.length > 0 ? (
          holidays.map((h, i) => {
            const hasColon = h.includes(':');
            const datePart = hasColon ? h.slice(0, h.indexOf(':')).trim() : '';
            const descPart = hasColon ? h.slice(h.indexOf(':') + 1).trim() : h;

            return (
              <li key={i} className="holiday-item">
                {datePart ? (
                  <>
                    <span className="holiday-date-badge">{datePart}</span>
                    <span className="holiday-name">{descPart}</span>
                  </>
                ) : (
                  <span className="holiday-name">{h}</span>
                )}
              </li>
            );
          })
        ) : (
          <li style={{ listStyle: 'none', color: 'var(--text-muted)', padding: '12px 0' }}>
            Sin feriados restantes este mes
          </li>
        )}
      </ul>
    </div>
  );
};
