import React from 'react';
import { Box, Card, Typography, CircularProgress, SxProps, Theme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface GaugeMetricProps {
  value: number;
  label: string;
  status?: string;
  onClick?: () => void;
}

const cardStyle: SxProps<Theme> = {
  bgcolor: 'white',
  borderRadius: '12px',
  p: 2,
  boxShadow: 'none',
  cursor: 'pointer',
};

const headerStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 0.5,
};

const labelStyle: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.875rem',
};

const iconStyle: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '1.25rem',
};

const gaugeContainerStyle: SxProps<Theme> = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
};

const valueContainerStyle: SxProps<Theme> = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const valueStyle: SxProps<Theme> = {
  fontSize: '1.5rem',
  fontWeight: 500,
};

const statusStyle: SxProps<Theme> = {
  color: 'text.secondary',
  mt: -0.5,
};

export const GaugeMetric: React.FC<GaugeMetricProps> = ({ 
  value, 
  label, 
  status = '',
  onClick 
}) => (
  <Card 
    sx={cardStyle}
    onClick={onClick}
  >
    <Box sx={headerStyle}>
      <Typography variant="body2" sx={labelStyle}>
        {label}
      </Typography>
      <ChevronRightIcon sx={iconStyle} />
    </Box>
    <Box sx={gaugeContainerStyle}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={70}
        thickness={8}
        sx={{
          color: value < 30 ? '#FF4B4B' : value < 70 ? '#FFB937' : '#1EC490',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Box sx={valueContainerStyle}>
        <Typography sx={valueStyle}>
          {value}
        </Typography>
        {status && (
          <Typography variant="caption" sx={statusStyle}>
            {status}
          </Typography>
        )}
      </Box>
    </Box>
  </Card>
);

export default GaugeMetric; 