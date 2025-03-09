import React, { useEffect, useState } from 'react';
import styles from './TimeframeSelector.module.css';

export enum Timeframe {
    "15m" = "15m",
    '1h' = '1h',
    '4h' = '4h',
    '1d' = '1d',
    '1w' = '1w',
    '1M' = '1M',
}

const TimeframeSelector = (props: { defaultTimeframe: Timeframe, availableTimeframes: Timeframe[], setSelectedTimeframe: (timeframe: Timeframe) => void }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(props.defaultTimeframe);

  const handleTimeframeSelect = (TimeframeId: Timeframe) => {
    setSelectedTimeframe(TimeframeId);
  };

  useEffect(() => {

  }, [selectedTimeframe]);
  
  return (
    <div className={styles.container}>
      {props.availableTimeframes.map((timeframe, index) => (
        <React.Fragment key={timeframe}>
          <button
            className={`${styles.timeframeButton} ${selectedTimeframe === timeframe ? styles.selected : ''}`}
            onClick={() => handleTimeframeSelect(timeframe)}
          >
            {timeframe}
          </button>
          {index < props.availableTimeframes.length - 1 && (
            <div className={styles.divider}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeframeSelector;;