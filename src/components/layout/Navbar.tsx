import React from 'react';
import { LayoutDashboard, TrendingUp, Percent, Banknote, Coins } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeMode } from '../../hooks/useTheme';

export type MainTab = 'resumen' | 'argentina' | 'tasas';
export type TasasSubTab = 'pesos' | 'cripto';

interface NavbarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  activeTasasSubTab: TasasSubTab;
  onSelectTasasSubTab: (subTab: TasasSubTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  activeTasasSubTab,
  onSelectTasasSubTab,
  theme,
  onToggleTheme,
}) => {
  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="nav-tabs-group">
          <button
            className={`nav-tab ${activeTab === 'resumen' ? 'active' : ''}`}
            onClick={() => onSelectTab('resumen')}
            type="button"
          >
            <LayoutDashboard size={14} className="nav-tab-icon" />
            <span>Resumen</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'argentina' ? 'active' : ''}`}
            onClick={() => onSelectTab('argentina')}
            type="button"
          >
            <TrendingUp size={14} className="nav-tab-icon" />
            <span>Dólares y Bandas</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'tasas' ? 'active' : ''}`}
            onClick={() => onSelectTab('tasas')}
            type="button"
          >
            <Percent size={14} className="nav-tab-icon" />
            <span>Tasas</span>
          </button>
        </div>

        <div className="nav-actions-right">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      {activeTab === 'tasas' && (
        <div id="sub-tabs-tasas" className="sub-tabs-container" style={{ display: 'flex' }}>
          <button
            className={`sub-tab ${activeTasasSubTab === 'pesos' ? 'active' : ''}`}
            onClick={() => onSelectTasasSubTab('pesos')}
            type="button"
          >
            <Banknote size={13} className="sub-tab-icon" />
            <span>Pesos (ARS)</span>
          </button>
          <button
            className={`sub-tab ${activeTasasSubTab === 'cripto' ? 'active' : ''}`}
            onClick={() => onSelectTasasSubTab('cripto')}
            type="button"
          >
            <Coins size={13} className="sub-tab-icon" />
            <span>Stablecoins</span>
          </button>
        </div>
      )}
    </nav>
  );
};
