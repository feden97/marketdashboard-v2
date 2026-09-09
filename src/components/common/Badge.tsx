import React from 'react';
import { getVarMeta, getBrechaMeta } from '../../utils/formatters';

interface VarBadgeProps {
  value?: number | null;
}

export const VarBadge: React.FC<VarBadgeProps> = ({ value }) => {
  const { text, colorClass } = getVarMeta(value);
  if (!colorClass) return <span>-</span>;
  return <span className={colorClass}>{text}</span>;
};

interface BrechaBadgeProps {
  value?: number | null;
  basePrice?: number | null;
}

export const BrechaBadge: React.FC<BrechaBadgeProps> = ({ value, basePrice }) => {
  const { text, colorClass } = getBrechaMeta(value, basePrice);
  if (!colorClass) return <span>-</span>;
  return <span className={colorClass}>{text}</span>;
};
