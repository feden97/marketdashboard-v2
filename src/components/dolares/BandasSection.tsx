import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { SpeedometerGauge } from './SpeedometerGauge';
import { formatCurrency } from '../../utils/formatters';
import { calculateGaugeState, generateDatosBandas, getBandaForToday } from '../../utils/gaugeMath';

interface BandasSectionProps {
  mayorista: number;
  ipcHistory?: Record<string, string | number>;
  historicalFiat: any[];
  fullHolidays?: string[];
}

export const BandasSection: React.FC<BandasSectionProps> = ({
  mayorista,
  ipcHistory,
  historicalFiat,
  fullHolidays = [],
}) => {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  const bandas = useMemo(() => generateDatosBandas(ipcHistory), [ipcHistory]);
  const bandaHoy = useMemo(() => getBandaForToday(bandas), [bandas]);

  const {
    c25,
    c75,
    c90,
    diffSup,
    pctSup,
    diffInf,
    pctInf,
  } = calculateGaugeState(mayorista, bandaHoy.inf, bandaHoy.sup);

  // Prepare chart & table data
  const { labels, dataSup, dataInf, dataMay, tableRows } = useMemo(() => {
    const mayoristaMap = Object.fromEntries(
      historicalFiat.filter((d) => d.mayorista).map((d) => [d.date, d.mayorista])
    );

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(
      2,
      '0'
    )}-${today.getFullYear()}`;

    const lbls: string[] = [];
    const supPts: number[] = [];
    const infPts: number[] = [];
    const mayPts: (number | null)[] = [];

    for (const b of bandas) {
      const [dd, mm, yyyy] = b.fecha.split('-');
      const bDate = new Date(+yyyy, +mm - 1, +dd);
      const isWknd = bDate.getDay() === 0 || bDate.getDay() === 6;
      const isHoliday = fullHolidays.includes(`${yyyy}-${mm}-${dd}`);

      if (bDate > today && b.fecha !== todayStr) continue;
      if ((isWknd || isHoliday) && bDate < today && b.fecha !== todayStr) continue;

      lbls.push(b.fecha);
      supPts.push(b.techo);
      infPts.push(b.piso);
      mayPts.push(mayoristaMap[b.fecha] ?? null);
    }

    // Append live mayorista
    if (mayorista > 0) {
      if (lbls.at(-1) === todayStr) {
        mayPts[mayPts.length - 1] = mayorista;
      } else {
        lbls.push(todayStr);
        supPts.push(bandaHoy.sup);
        infPts.push(bandaHoy.inf);
        mayPts.push(mayorista);
      }
    }

    const tRows = [...lbls].reverse().map((lbl, i) => {
      const ri = lbls.length - 1 - i;
      return {
        fecha: lbl,
        mayorista: mayPts[ri],
        techo: supPts[ri],
        piso: infPts[ri],
      };
    });

    return {
      labels: lbls,
      dataSup: supPts,
      dataInf: infPts,
      dataMay: mayPts,
      tableRows: tRows,
    };
  }, [bandas, bandaHoy, mayorista, historicalFiat, fullHolidays]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Banda Superior',
          data: dataSup,
          borderColor: '#f97316',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.2,
        },
        {
          label: 'Banda Inferior',
          data: dataInf,
          borderColor: '#ef4444',
          borderWidth: 2,
          pointRadius: 0,
          fill: '-1',
          tension: 0.2,
          backgroundColor: 'rgba(249, 115, 22, 0.05)',
        },
        {
          label: 'Mayorista',
          data: dataMay,
          borderColor: '#10b981',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: false,
          tension: 0.2,
        },
      ],
    };
  }, [labels, dataSup, dataInf, dataMay]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: { color: '#64748b', usePointStyle: true, boxWidth: 8 },
        },
      },
      scales: {
        x: { ticks: { color: '#64748b', maxTicksLimit: 6 } },
        y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
      },
      interaction: { mode: 'index' as const, intersect: false },
    };
  }, []);

  return (
    <div className="macro-card" style={{ padding: '24px', marginTop: '24px' }}>
      <h2 style={{ color: 'var(--text-main)', margin: '0 0 24px', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.5px' }}>
        Bandas Cambiarias y Dólar Mayorista
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start', marginBottom: '25px' }}>
        <SpeedometerGauge mayorista={mayorista} inf={bandaHoy.inf} sup={bandaHoy.sup} />

        {/* Ranges table + info box */}
        <div style={{ flex: 1.5, minWidth: '280px', width: '100%' }}>
          <table className="data-table" style={{ marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Rango (%)</th>
                <th>Valor mínimo</th>
                <th>Valor máximo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>● Favorable</span>
                </td>
                <td>0 - 25%</td>
                <td>{formatCurrency(bandaHoy.inf)}</td>
                <td>{formatCurrency(c25)}</td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: '#facc15', fontWeight: 600 }}>● Intermedio</span>
                </td>
                <td>25 - 75%</td>
                <td>{formatCurrency(c25)}</td>
                <td>{formatCurrency(c75)}</td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: 'var(--orange)', fontWeight: 600 }}>● Precaución</span>
                </td>
                <td>75 - 90%</td>
                <td>{formatCurrency(c75)}</td>
                <td>{formatCurrency(c90)}</td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: 'var(--red)', fontWeight: 600 }}>● Crítico</span>
                </td>
                <td>90 - 100%</td>
                <td>{formatCurrency(c90)}</td>
                <td>{formatCurrency(bandaHoy.sup)}</td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              backgroundColor: 'var(--bg-card-solid)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              color: 'var(--text-main)',
              borderLeft: '4px solid var(--accent)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div>
              El dólar debería subir{' '}
              <span className="badge-green" style={{ marginLeft: '4px' }}>
                {formatCurrency(diffSup)} (+{pctSup.toFixed(2)}%)
              </span>{' '}
              para llegar a la banda superior
            </div>
            <div>
              El dólar debería bajar{' '}
              <span className="badge-red" style={{ marginLeft: '4px' }}>
                {formatCurrency(diffInf)} (-{pctInf.toFixed(2)}%)
              </span>{' '}
              para llegar a la banda inferior
            </div>
          </div>
        </div>
      </div>

      {/* Chart/Table Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card-solid)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            overflow: 'hidden',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setView('chart')}
            type="button"
            style={{
              backgroundColor: view === 'chart' ? 'var(--bg-card-hover)' : 'transparent',
              color: view === 'chart' ? 'var(--text-main)' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: view === 'chart' ? 600 : 500,
              borderRadius: '8px',
            }}
          >
            Gráfico
          </button>
          <button
            onClick={() => setView('table')}
            type="button"
            style={{
              backgroundColor: view === 'table' ? 'var(--bg-card-hover)' : 'transparent',
              color: view === 'table' ? 'var(--text-main)' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: view === 'table' ? 600 : 500,
              borderRadius: '8px',
            }}
          >
            Tabla
          </button>
        </div>
      </div>

      {view === 'chart' ? (
        <div style={{ height: '250px', width: '100%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div
          style={{
            maxHeight: '250px',
            overflowY: 'auto',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <table className="data-table" style={{ fontSize: '13px', margin: 0, width: '100%', textAlign: 'left', border: 'none' }}>
            <thead
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-card-solid)',
                zIndex: 10,
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <tr>
                <th style={{ padding: '8px' }}>Fecha</th>
                <th style={{ padding: '8px' }}>Mayorista</th>
                <th style={{ padding: '8px' }}>Techo</th>
                <th style={{ padding: '8px' }}>Piso</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{r.fecha}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 'bold' }}>
                    {r.mayorista != null ? formatCurrency(r.mayorista) : '-'}
                  </td>
                  <td style={{ color: 'var(--orange)', fontWeight: 'bold' }}>{formatCurrency(r.techo)}</td>
                  <td style={{ color: 'var(--red)', fontWeight: 'bold' }}>{formatCurrency(r.piso)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
