import React from 'react';
import { Box, Card, Typography, SxProps, Theme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
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

const contentStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 1,
};

const valueStyle: SxProps<Theme> = {
  fontSize: '1.25rem',
  fontWeight: 500,
};

const changeStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  change,
  onClick 
}) => (
  <Card 
    sx={cardStyle}
    onClick={onClick}
    className={onClick ? styles.clickable : ''}
  >
    <Box sx={headerStyle}>
      <Typography variant="body2" sx={labelStyle}>
        {label}
      </Typography>
      <ChevronRightIcon sx={iconStyle} />
    </Box>
    <Box sx={contentStyle}>
      <Typography sx={valueStyle}>{value}</Typography>
      {change && (
        <Typography
          variant="body2"
          sx={{
            ...changeStyle,
            color: change.startsWith('+') ? '#1EC490' : '#FF4B4B',
          }}
        >
          {change}
        </Typography>
      )}
    </Box>
  </Card>
);

export default MetricCard; 