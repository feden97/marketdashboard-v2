import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Activity, Info } from 'lucide-react';
import '../../utils/chartSetup';
import { InflationStats } from '../../types/macro';

interface InflationPanelProps {
  stats?: InflationStats | null;
}

export const InflationPanel: React.FC<InflationPanelProps> = ({ stats }) => {
  const { chartData, years } = useMemo(() => {
    if (!stats || !stats.history.length) {
      return { chartData: { labels: [], datasets: [] }, years: [] };
    }

    const labels = stats.history.map((h) => h.fecha.split(' ')[0]);
    const yrs = stats.history.map((h) => h.fecha.split(' ')[1] || '');
    const dataPoints = stats.history.map((h) => h.valor);
    const bgColors = dataPoints.map((_, i) =>
      i === dataPoints.length - 1 ? '#475569' : '#64748b'
    );

    return {
      chartData: {
        labels,
        datasets: [
          {
            data: dataPoints,
            backgroundColor: bgColors,
            borderRadius: 4,
            barPercentage: 0.8,
          },
        ],
      },
      years: yrs,
    };
  }, [stats]);

  const plugins = useMemo(() => {
    const inflationDatalabels = {
      id: 'inflationDatalabels',
      afterDatasetsDraw(chart: any) {
        const ctx = chart.ctx;
        const textColor =
          getComputedStyle(document.body).getPropertyValue('--text-main').trim() || '#ffffff';
        const isMobile = window.innerWidth < 500;
        chart.data.datasets.forEach((dataset: any, i: number) => {
          chart.getDatasetMeta(i).data.forEach((el: any, idx: number) => {
            const val = dataset.data[idx];
            if (val == null) return;
            ctx.fillStyle = textColor;
            ctx.font = `bold ${isMobile ? '9px' : '10px'} Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(val.toFixed(1).replace('.', ',') + '%', el.x, el.y - 4);
          });
        });
      },
    };

    const yearGroupingPlugin = {
      id: 'yearGroupingPlugin',
      afterDraw(chart: any) {
        if (!years.length) return;
        const ctx = chart.ctx;
        const xAxis = chart.scales.x;

        const yearGroups: { year: string; startIdx: number; endIdx: number }[] = [];
        let curYear = years[0];
        let curStart = 0;
        for (let i = 1; i <= years.length; i++) {
          if (i === years.length || years[i] !== curYear) {
            yearGroups.push({ year: curYear, startIdx: curStart, endIdx: i - 1 });
            if (i < years.length) {
              curYear = years[i];
              curStart = i;
            }
          }
        }

        const tickW = xAxis.getPixelForTick(1) - xAxis.getPixelForTick(0);
        const yPos = xAxis.bottom + 10;
        ctx.save();
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const grp of yearGroups) {
          const startX = xAxis.getPixelForTick(grp.startIdx) - tickW / 2;
          const endX = xAxis.getPixelForTick(grp.endIdx) + tickW / 2;
          const centerX = (startX + endX) / 2;
          const textW = ctx.measureText(grp.year).width + 10;

          ctx.beginPath();
          ctx.moveTo(startX + 5, yPos);
          ctx.lineTo(centerX - textW / 2, yPos);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(centerX + textW / 2, yPos);
          ctx.lineTo(endX - 5, yPos);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(startX + 5, yPos - 3);
          ctx.lineTo(startX + 5, yPos);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(endX - 5, yPos - 3);
          ctx.lineTo(endX - 5, yPos);
          ctx.stroke();

          ctx.fillStyle = '#6b7280';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(centerX - textW / 2 + 2, yPos - 8, textW - 4, 16, 8);
          } else {
            ctx.rect(centerX - textW / 2 + 2, yPos - 8, textW - 4, 16);
          }
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(grp.year, centerX, yPos + 1);
        }
        ctx.restore();
      },
    };

    return [inflationDatalabels, yearGroupingPlugin];
  }, [years]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      layout: { padding: { top: 20, bottom: 25 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#94a3b8',
          bodyColor: '#fff',
          borderColor: '#334155',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (ctx: any) => `${ctx.parsed.y.toFixed(1)}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { size: 10, weight: 'bold' as const }, padding: 5 },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: {
            color: '#64748b',
            padding: 5,
            font: { size: 11 },
            callback: (v: any) => (Number.isInteger(v) ? `${v}%` : `${Number(v).toFixed(1)}%`),
          },
        },
      },
    };
  }, []);

  if (!stats) {
    return (
      <div className="radar-bottom-card inflation-panel">
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Cargando inflación...
        </div>
      </div>
    );
  }

  const formattedPurchasingPower = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(stats.purchasingPowerCost);

  return (
    <div className="radar-bottom-card inflation-panel">
      <div className="radar-bottom-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <h3 className="radar-bottom-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} className="radar-icon-accent" />
          <span>Inflación mensual (IPC)</span>
        </h3>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Cuánto subieron los precios cada mes según el INDEC.
        </span>
      </div>

      <div className="radar-bottom-body" style={{ padding: 16 }}>
        <div className="inf-kpi-grid">
          <div className="inf-kpi-card">
            <div className="inf-kpi-label">ÚLTIMO MES {stats.lastMonthLabel && `(${stats.lastMonthLabel})`}</div>
            <div className="inf-kpi-value text-red">
              {stats.lastMonth.toFixed(1).replace('.', ',')}%
            </div>
          </div>
          <div className="inf-kpi-card">
            <div className="inf-kpi-label">PROMEDIO 12M</div>
            <div className="inf-kpi-value text-yellow">
              {stats.avg12m.toFixed(1).replace('.', ',')}%
            </div>
          </div>
          <div className="inf-kpi-card">
            <div className="inf-kpi-label">ACUM. 12M</div>
            <div className="inf-kpi-value text-orange">
              {stats.acum12m.toFixed(1).replace('.', ',')}%
            </div>
          </div>
        </div>

        <div className="inf-chart-container" style={{ height: 215, width: '100%' }}>
          <Bar data={chartData} options={chartOptions} plugins={plugins} />
        </div>

        <div className="inf-footer-card">
          <Info size={16} style={{ flexShrink: 0, color: 'var(--accent)', marginTop: 2 }} />
          <span>
            Algo que costaba $10.000 hace un año, hoy cuesta <strong>{formattedPurchasingPower}</strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
