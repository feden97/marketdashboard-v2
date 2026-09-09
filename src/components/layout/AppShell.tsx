import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-body)',
        color: 'var(--text-main)',
      }}
    >
      {children}
    </div>
  );
};
