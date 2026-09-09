import React from 'react';
import { Coins } from 'lucide-react';
import { PesosAccounts } from './PesosAccounts';
import { PlazosFijos } from './PlazosFijos';
import { FciFunds } from './FciFunds';
import { YieldMatrix } from './YieldMatrix';
import { TasasSubTab } from '../layout/Navbar';
import { ProcessedCuentaRemunerada, ProcessedFci, ProcessedPlazoFijo, YieldMatrixData } from '../../types/rates';

interface TasasTabProps {
  subTab: TasasSubTab;
  cuentasRemuneradas: ProcessedCuentaRemunerada[];
  plazosFijos: ProcessedPlazoFijo[];
  fcis: ProcessedFci[];
  yieldMatrix?: YieldMatrixData | null;
  isActive?: boolean;
}

export const TasasTab: React.FC<TasasTabProps> = ({
  subTab,
  cuentasRemuneradas,
  plazosFijos,
  fcis,
  yieldMatrix,
  isActive = true,
}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`} style={{ display: isActive ? 'block' : 'none' }}>
      <div className="panel-ancho">
        <h2 style={{ color: 'var(--text-main)', margin: '0 0 20px', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.5px' }}>
          Tasas de Interés y Rendimientos
        </h2>

        {subTab === 'pesos' ? (
          <div
            id="tasas-pesos"
            style={{
              display: 'block',
              animation: 'fadeIn 0.4s ease forwards',
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '0 20px',
            }}
          >
            <PesosAccounts accounts={cuentasRemuneradas} />
            <PlazosFijos plazosFijos={plazosFijos} />
            <FciFunds fcis={fcis} />
          </div>
        ) : (
          <div
            id="tasas-cripto"
            style={{
              display: 'block',
              animation: 'fadeIn 0.4s ease forwards',
              maxWidth: '100%',
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <div className="tasas-section-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Coins size={16} />
              <span>Rendimientos en Stablecoins</span>
            </div>
            <div className="tasas-section-sub">
              Tasas APY ofrecidas por plataformas cripto argentinas. La mejor tasa de cada moneda se destaca en
              verde.
            </div>
            <YieldMatrix matrix={yieldMatrix} />
          </div>
        )}
      </div>
    </div>
  );
};
