import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../hooks/useTheme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      className="theme-toggle-btn"
      onClick={onToggle}
      title="Cambiar Tema"
      type="button"
      aria-label="Alternar tema claro y oscuro"
    >
      {theme === 'dark' ? (
        <Moon className="theme-icon" style={{ display: 'block' }} size={18} />
      ) : (
        <Sun className="theme-icon" style={{ display: 'block' }} size={18} />
      )}
    </button>
  );
};
