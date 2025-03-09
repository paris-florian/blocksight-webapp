import React, { useEffect, useState } from 'react';
import styles from './ChartTopSelector.module.css';

export enum Timeframe {
    "15m" = "15m",
    '1h' = '1h',
    '4h' = '4h',
    '1d' = '1d',
    '1w' = '1w',
    '1M' = '1M',
}

interface MyProps {
  children?: React.ReactNode
}

const ChartTopSelector = (props: MyProps) => {
  return (
    <div className={styles.container}>
      {props.children}
    </div>
  );
};

export default ChartTopSelector;