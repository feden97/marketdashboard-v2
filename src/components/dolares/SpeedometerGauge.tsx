import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { calculateGaugeState } from '../../utils/gaugeMath';

interface SpeedometerGaugeProps {
  mayorista: number;
  inf: number;
  sup: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({ mayorista, inf, sup }) => {
  const { angleDeg, bg, text } = calculateGaugeState(mayorista, inf, sup);
  const mid = inf + (sup - inf) / 2;

  return (
    <div
      style={{
        flex: 1,
        minWidth: '280px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '10px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '2/1',
          height: 'auto',
          margin: '20px auto 0',
        }}
      >
        <span
          id="velocimetro-mid"
          style={{
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#9ca3af',
            fontSize: '0.9em',
            fontWeight: 'bold',
          }}
        >
          {formatCurrency(mid)}
        </span>
        <span
          id="velocimetro-inf"
          style={{
            position: 'absolute',
            bottom: '-25px',
            left: 0,
            color: '#9ca3af',
            fontSize: '0.9em',
            fontWeight: 'bold',
          }}
        >
          {formatCurrency(inf)}
        </span>
        <span
          id="velocimetro-sup"
          style={{
            position: 'absolute',
            bottom: '-25px',
            right: 0,
            color: '#9ca3af',
            fontSize: '0.9em',
            fontWeight: 'bold',
          }}
        >
          {formatCurrency(sup)}
        </span>

        {/* Semicircle gradient arc */}
        <div
          style={{
            width: '100%',
            height: '200%',
            borderRadius: '50%',
            background:
              'conic-gradient(from 270deg at 50% 50%, #10b981 0deg 45deg, #facc15 45deg 135deg, #f97316 135deg 162deg, #ef4444 162deg 180deg, transparent 180deg 360deg)',
            WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)',
            maskImage: 'radial-gradient(transparent 55%, black 56%)',
          }}
        />

        {/* Needle */}
        <div
          id="gauge-needle"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '6px',
            height: '120px',
            backgroundColor: '#ffffff',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${angleDeg}deg)`,
            transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
            borderRadius: '6px',
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        />

        {/* Center cap */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            zIndex: 11,
            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '35px' }}>
        <div
          style={{
            color: '#9ca3af',
            fontSize: '0.85em',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 'bold',
            marginBottom: '5px',
          }}
        >
          Dólar Mayorista
        </div>
        <div
          id="gauge-mayorista-box"
          style={{
            display: 'inline-block',
            fontSize: '1.8em',
            fontWeight: 'bold',
            backgroundColor: bg,
            color: text,
            padding: '4px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'background-color 0.5s ease',
          }}
        >
          {formatCurrency(mayorista)}
        </div>
      </div>
    </div>
  );
};
