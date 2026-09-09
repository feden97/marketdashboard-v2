import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { BaseCurrency } from './DollarQuotesTable';
import { ProcessedFiatQuotes } from '../../services/quotesService';

interface SpreadChartProps {
  historicalData: any[];
  fiatData?: ProcessedFiatQuotes;
  maxVentaUsdt: number;
  baseCurrency: BaseCurrency;
  onSelectBaseCurrency: (base: BaseCurrency) => void;
}

export const SpreadChart: React.FC<SpreadChartProps> = ({
  historicalData,
  fiatData,
  maxVentaUsdt,
  baseCurrency,
  onSelectBaseCurrency,
}) => {
  const { labels, data, cclWins, baseWins } = useMemo(() => {
    const lbls: string[] = [];
    const pts: number[] = [];
    let cWins = 0;
    let bWins = 0;

    historicalData.forEach((d) => {
      const target = d.ccl;
      const base = d[baseCurrency];
      if (target && base && base > 0) {
        lbls.push(d.date);
        const spread = ((target / base) - 1) * 100;
        pts.push(spread);
        if (spread > 0) cWins++;
        else if (spread < 0) bWins++;
      }
    });

    // Append live point if available
    if (fiatData && fiatData.ccl.price > 0) {
      const liveBase = baseCurrency === 'usdt' ? maxVentaUsdt : fiatData[baseCurrency]?.price || 0;
      if (liveBase > 0) {
        const liveSpread = ((fiatData.ccl.price / liveBase) - 1) * 100;
        const now = new Date();
        const nowStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(
          2,
          '0'
        )}-${now.getFullYear()}`;

        if (lbls.at(-1) === nowStr) {
          pts[pts.length - 1] = liveSpread;
        } else {
          lbls.push(nowStr);
          pts.push(liveSpread);
        }
      }
    }

    return { labels: lbls, data: pts, cclWins: cWins, baseWins: bWins };
  }, [historicalData, fiatData, maxVentaUsdt, baseCurrency]);

  const plugins = useMemo(() => {
    const zonesPlugin = {
      id: 'zonesPlugin',
      beforeDraw(chart: any) {
        if (baseCurrency !== 'usdt') return;
        const { ctx, chartArea, scales: { y } } = chart;
        if (!y || !chartArea) return;

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.save();

        const drawZone = (yMin: number, yMax: number, color: string, text: string, isExtreme = false) => {
          const top = y.getPixelForValue(yMax);
          const bottom = y.getPixelForValue(yMin);
          const dTop = Math.max(top, chartArea.top);
          const dBot = Math.min(bottom, chartArea.bottom);
          if (dTop >= dBot) return;

          ctx.fillStyle = color;
          ctx.fillRect(chartArea.left, dTop, chartArea.width, dBot - dTop);

          if (text && window.innerWidth >= 768) {
            ctx.fillStyle = isLight
              ? `rgba(0,0,0,${isExtreme ? 0.35 : 0.22})`
              : `rgba(255,255,255,${isExtreme ? 0.35 : 0.22})`;
            ctx.font = `bold ${isExtreme ? '24px' : '18px'} sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, chartArea.left + chartArea.width / 2, dTop + (dBot - dTop) / 2);
          }
        };

        drawZone(2.0, y.max, 'rgba(239,68,68,0.15)', 'VENDER CEDEARs - COMPRAR USDT', true);
        drawZone(1.0, 2.0, 'rgba(239,68,68,0.05)', 'Oportunidad de venta CEDEARs o compra USDT');
        drawZone(-2.0, -1.0, 'rgba(16,185,129,0.05)', 'Oportunidad de venta USDT o compra CEDEARs');
        drawZone(y.min, -2.0, 'rgba(16,185,129,0.15)', 'VENDER USDT - COMPRAR CEDEARs', true);

        ctx.restore();
      },
    };

    const zeroLinePlugin = {
      id: 'zeroLine',
      afterDraw(chart: any) {
        const yScale = chart.scales.y;
        if (!yScale) return;
        const yPx = yScale.getPixelForValue(0);
        if (yPx < yScale.top || yPx > yScale.bottom) return;

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        chart.ctx.save();
        chart.ctx.beginPath();
        chart.ctx.moveTo(chart.chartArea.left, yPx);
        chart.ctx.lineTo(chart.chartArea.right, yPx);
        chart.ctx.lineWidth = 1.5;
        chart.ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.3)';
        chart.ctx.stroke();
        chart.ctx.restore();
      },
    };

    return [zonesPlugin, zeroLinePlugin];
  }, [baseCurrency]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data,
          borderWidth: 2.5,
          pointRadius: (ctx: any) => (ctx.dataIndex === ctx.dataset.data.length - 1 ? 4 : 0),
          pointBackgroundColor: (ctx: any) =>
            ctx.dataset.data[ctx.dataIndex] >= 0 ? '#10b981' : '#ef4444',
          pointHoverRadius: 5,
          fill: false,
          tension: 0.1,
          segment: {
            borderColor: (ctx: any) =>
              ctx.p0?.parsed?.y >= 0 ? '#10b981' : '#ef4444',
          },
        },
      ],
    };
  }, [labels, data]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c: any) => `Spread: ${Number(c.parsed.y).toFixed(2)}%`,
          },
        },
      },
      scales: {
        x: {
          display: true,
          offset: true,
          ticks: { color: '#64748b', maxTicksLimit: 6 },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        y: {
          display: true,
          ticks: { color: '#64748b' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
      },
      interaction: { mode: 'index' as const, intersect: false },
    };
  }, []);

  const pills: BaseCurrency[] = ['usdt', 'oficial', 'mep', 'ccl', 'blue'];

  const baseNameSummary =
    baseCurrency === 'oficial' ? 'Oficial' : baseCurrency === 'blue' ? 'Blue' : baseCurrency.toUpperCase();

  return (
    <div style={{ textAlign: 'center', marginTop: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div
          id="chart-title"
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textAlign: 'left',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Spread CCL vs {baseCurrency.toUpperCase()} (YTD)
        </div>
        <div className="base-pills" id="base-currency-pills">
          {pills.map((p) => (
            <button
              key={p}
              className={`base-pill ${baseCurrency === p ? 'active' : ''}`}
              onClick={() => onSelectBaseCurrency(p)}
              type="button"
            >
              {p === 'oficial' ? 'Oficial' : p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '200px', width: '100%' }}>
        <Line data={chartData} options={chartOptions} plugins={plugins} />
      </div>

      <div className="data-summary-row">
        <div>
          Periodos ganadores CCL:
          <br />
          <span id="ccl-wins" style={{ color: 'var(--green)', fontWeight: 700, fontSize: '20px' }}>
            {cclWins} Días
          </span>
        </div>
        <div>
          Periodos ganadores {baseNameSummary}:
          <br />
          <span id="base-wins" style={{ color: 'var(--red)', fontWeight: 700, fontSize: '20px' }}>
            {baseWins} Días
          </span>
        </div>
      </div>
    </div>
  );
};
