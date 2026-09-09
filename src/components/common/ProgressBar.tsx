import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  lastUpdatedTime: string;
  intervalMs?: number;
  progressPercent?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  lastUpdatedTime,
  intervalMs = 60_000,
  progressPercent: externalProgressPercent,
}) => {
  const totalSeconds = Math.round(intervalMs / 1000);
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  // Reset countdown whenever lastUpdatedTime changes (new data arrived)
  useEffect(() => {
    setSecondsRemaining(totalSeconds);
  }, [lastUpdatedTime, totalSeconds]);

  // Local 1-second interval - only re-renders this isolated component
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : totalSeconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [totalSeconds]);

  const computedPercent = (secondsRemaining / totalSeconds) * 100;
  const percent = externalProgressPercent ?? computedPercent;

  return (
    <div className="update-bar-wrapper">
      <div className="progress-bar-bg">
        <div
          id="update-progress-bar"
          className="progress-bar-fill"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
      <div className="update-time-container">
        <span className="live-dot" />
        <span id="last-updated-time">Act: {lastUpdatedTime}</span>
      </div>
    </div>
  );
};
