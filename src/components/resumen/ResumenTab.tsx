import React from 'react';
import { Compass, DollarSign } from 'lucide-react';
import { RadarCard } from './RadarCard';
import { InflationPanel } from './InflationPanel';
import { HolidaysList } from './HolidaysList';
import { BankLogo } from '../common/BankLogo';
import { formatCurrency } from '../../utils/formatters';
import { LiveQuotesResult } from '../../services/quotesService';
import { InflationStats } from '../../types/macro';
import { ProcessedCuentaRemunerada, ProcessedPlazoFijo, YieldMatrixData } from '../../types/rates';

interface ResumenTabProps {
  quotes?: LiveQuotesResult;
  bestPf?: ProcessedPlazoFijo | null;
  bestAccount?: ProcessedCuentaRemunerada | null;
  yieldMatrix?: YieldMatrixData | null;
  inflationStats?: InflationStats | null;
  holidays: string[];
  isActive?: boolean;
}

export const ResumenTab: React.FC<ResumenTabProps> = ({
  quotes,
  bestPf,
  bestAccount,
  yieldMatrix,
  inflationStats,
  holidays,
  isActive = true,
}) => {
  // Best crypto APY calculation
  let bestCryptoRate = 0;
  let bestCryptoExchange = '...';
  let bestCryptoCoin = 'USDT';

  if (yieldMatrix) {
    for (const ent of yieldMatrix.entities) {
      for (const coin of yieldMatrix.coins) {
        const r = yieldMatrix.rateMap[ent]?.[coin];
        if (r !== null && r !== undefined && r > bestCryptoRate) {
          bestCryptoRate = r;
          bestCryptoExchange = ent;
          bestCryptoCoin = coin;
        }
      }
    }
  }

  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`} style={{ display: isActive ? 'block' : 'none' }}>
      <div className="panel-ancho">
        {/* Section header */}
        <div className="radar-header">
          <span className="radar-tag">
            <Compass size={12} className="radar-tag-icon" />
            <span>Radar de Inversión</span>
          </span>
          <h2 className="radar-subtitle">Oportunidades destacadas del mercado</h2>
        </div>

        {/* 4 metric cards */}
        <div className="radar-grid">
          {/* Dólar más barato */}
          <RadarCard
            label="DÓLAR MÁS BARATO"
            value={formatCurrency(quotes?.cheapestDollar?.price)}
            entityName={quotes?.cheapestDollar?.name || '...'}
            icon={<DollarSign size={24} />}
          />

          {/* Mejor cuenta remunerada */}
          <RadarCard
            label="MEJOR CUENTA (TNA)"
            value={bestAccount ? bestAccount.tnaFormatted : '0,00%'}
            entityName={bestAccount?.name || '...'}
            bankLogoName={bestAccount?.name}
          />

          {/* Mejor plazo fijo */}
          <RadarCard
            label="MEJOR PLAZO FIJO (TNA)"
            value={bestPf?.rate ? `${(bestPf.rate * 100).toFixed(2)}%` : '0,00%'}
            entityName={bestPf?.name || '...'}
            bankLogoName={bestPf?.name}
          />

          {/* Mejor APY stablecoins */}
          <RadarCard
            label="MEJOR APY STABLES"
            value={bestCryptoRate > 0 ? `${bestCryptoRate.toFixed(2)}%` : '0,00%'}
            entityName={bestCryptoExchange}
            bankLogoName={bestCryptoExchange}
            detail={
              bestCryptoRate > 0 ? (
                <span className="radar-detail-coin">
                  <BankLogo name={bestCryptoCoin} size={16} />
                  <span>{bestCryptoCoin}</span>
                </span>
              ) : undefined
            }
          />
        </div>

        {/* Bottom row: Inflación + Feriados */}
        <div className="radar-bottom-grid">
          <InflationPanel stats={inflationStats} />
          <HolidaysList holidays={holidays} />
        </div>
      </div>
    </div>
  );
};
