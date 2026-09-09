import React, { useState } from 'react';
import { DollarQuotesTable, BaseCurrency } from './DollarQuotesTable';
import { CryptoP2PTable } from './CryptoP2PTable';
import { SpreadChart } from './SpreadChart';
import { BandasSection } from './BandasSection';
import { ProgressBar } from '../common/ProgressBar';
import { LiveQuotesResult } from '../../services/quotesService';

interface DolaresTabProps {
  quotes?: LiveQuotesResult;
  historicalFiat: any[];
  progressPercent?: number;
  lastUpdatedTime: string;
  ipcHistory?: Record<string, string | number>;
  fullHolidays?: string[];
  isActive?: boolean;
}

export const DolaresTab: React.FC<DolaresTabProps> = ({
  quotes,
  historicalFiat,
  progressPercent,
  lastUpdatedTime,
  ipcHistory,
  fullHolidays,
  isActive = true,
}) => {
  const [baseCurrency, setBaseCurrency] = useState<BaseCurrency>('usdt');

  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`} style={{ display: isActive ? 'block' : 'none' }}>
      <div className="panel-ancho">
        {/* Cotizaciones Card */}
        <div className="macro-card" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-main)',
                letterSpacing: '-0.5px',
              }}
            >
              Panel de Cotizaciones
            </h2>
            <ProgressBar progressPercent={progressPercent} lastUpdatedTime={lastUpdatedTime} />
          </div>

          <div className="tables-grid">
            <DollarQuotesTable
              fiatData={quotes?.fiatData}
              maxVentaUsdt={quotes?.maxVenta ?? 0}
              usdtVar={quotes?.usdtVar ?? 0}
              baseCurrency={baseCurrency}
            />

            <CryptoP2PTable exchanges={quotes?.exchanges || []} />
          </div>

          {/* Spread Chart */}
          <SpreadChart
            historicalData={historicalFiat}
            fiatData={quotes?.fiatData}
            maxVentaUsdt={quotes?.maxVenta ?? 0}
            baseCurrency={baseCurrency}
            onSelectBaseCurrency={setBaseCurrency}
          />
        </div>

        {/* Bandas Card */}
        <BandasSection
          mayorista={quotes?.fiatData?.mayorista?.price || 0}
          ipcHistory={ipcHistory}
          historicalFiat={historicalFiat}
          fullHolidays={fullHolidays}
        />
      </div>
    </div>
  );
};
