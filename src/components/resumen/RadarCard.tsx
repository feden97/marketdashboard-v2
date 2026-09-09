import React from 'react';
import { BankLogo } from '../common/BankLogo';

interface RadarCardProps {
  label: string;
  value: string;
  entityName: string;
  icon?: React.ReactNode;
  detail?: React.ReactNode;
  bankLogoName?: string;
}

export const RadarCard: React.FC<RadarCardProps> = ({
  label,
  value,
  entityName,
  icon,
  detail,
  bankLogoName,
}) => {
  return (
    <div className="radar-card">
      <div
        className="radar-card-icon"
        style={bankLogoName ? { background: 'transparent', padding: 0 } : undefined}
      >
        {bankLogoName ? <BankLogo name={bankLogoName} size={32} /> : icon}
      </div>
      <div className="radar-card-body">
        <span className="radar-card-label">{label}</span>
        <span className="radar-card-value">{value}</span>
        <span className="radar-card-entity">{entityName}</span>
        {detail && <div className="radar-card-detail">{detail}</div>}
      </div>
    </div>
  );
};
