import React from 'react';

interface HolidaysListProps {
  holidays: string[];
}

export const HolidaysList: React.FC<HolidaysListProps> = ({ holidays }) => {
  return (
    <div className="radar-bottom-card">
      <div className="radar-bottom-header">
        <h3 className="radar-bottom-title">🏖️ PRÓXIMOS FERIADOS</h3>
      </div>
      <ul className="macro-list-premium">
        {holidays.length > 0 ? (
          holidays.map((h, i) => <li key={i}>{h}</li>)
        ) : (
          <li style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
            Sin feriados restantes este mes
          </li>
        )}
      </ul>
    </div>
  );
};
