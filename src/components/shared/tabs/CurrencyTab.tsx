import React from 'react';
import { Box, Grid, SxProps, Theme } from '@mui/material';
import BaseTab from './BaseTab';
import MetricCard from '../metrics/MetricCard';
import GaugeMetric from '../metrics/GaugeMetric';

interface CurrencyTabProps {
  metrics: {
    label: string;
    value: string | number;
    change?: number;
  }[];
  gauges: {
    label: string;
    value: number;
    status?: string;
  }[];
  onMetricClick?: (label: string) => void;
  onGaugeClick?: (label: string) => void;
  sx?: SxProps<Theme>;
}

const gridStyle: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 2,
};

export const CurrencyTab: React.FC<CurrencyTabProps> = ({
  metrics,
  gauges,
  onMetricClick,
  onGaugeClick,
  sx
}) => {
  return (
    <BaseTab sx={sx}>
      <Box sx={gridStyle}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            change={metric.change?.toString()}
            onClick={() => onMetricClick?.(metric.label)}
          />
        ))}
      </Box>
      <Box sx={gridStyle}>
        {gauges.map((gauge) => (
          <GaugeMetric
            key={gauge.label}
            label={gauge.label}
            value={gauge.value}
            status={gauge.status}
            onClick={() => onGaugeClick?.(gauge.label)}
          />
        ))}
      </Box>
    </BaseTab>
  );
};

export default CurrencyTab; 