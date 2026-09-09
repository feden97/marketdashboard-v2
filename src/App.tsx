import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { Navbar, MainTab, TasasSubTab } from './components/layout/Navbar';
import { ResumenTab } from './components/resumen/ResumenTab';
import { DolaresTab } from './components/dolares/DolaresTab';
import { TasasTab } from './components/tasas/TasasTab';
import { useTheme } from './hooks/useTheme';
import { useQuotes } from './hooks/useQuotes';
import { useRates } from './hooks/useRates';
import { useMacro } from './hooks/useMacro';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const DashboardContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<MainTab>('resumen');
  const [activeTasasSubTab, setActiveTasasSubTab] = useState<TasasSubTab>('pesos');

  const {
    data: quotesData,
    historicalData,
    lastUpdatedTime,
  } = useQuotes();

  const { data: ratesData } = useRates();
  const { data: macroData } = useMacro();

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
  };

  return (
    <AppShell>
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        activeTasasSubTab={activeTasasSubTab}
        onSelectTasasSubTab={setActiveTasasSubTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="main-content">
        <ResumenTab
          isActive={activeTab === 'resumen'}
          quotes={quotesData}
          bestPf={ratesData?.bestPf}
          bestAccount={ratesData?.bestYieldAccount}
          yieldMatrix={ratesData?.yieldMatrix}
          inflationStats={macroData?.inflationStats}
          holidays={macroData?.holidaysList || []}
        />

        <DolaresTab
          isActive={activeTab === 'argentina'}
          quotes={quotesData}
          historicalFiat={historicalData}
          lastUpdatedTime={lastUpdatedTime}
          ipcHistory={macroData?.ipcHistory}
          fullHolidays={macroData?.fullHolidays}
        />

        <TasasTab
          isActive={activeTab === 'tasas'}
          subTab={activeTasasSubTab}
          cuentasRemuneradas={ratesData?.cuentasRemuneradas || []}
          plazosFijos={ratesData?.plazosFijos || []}
          fcis={ratesData?.fcis || []}
          yieldMatrix={ratesData?.yieldMatrix}
        />
      </div>
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
};

export default App;
