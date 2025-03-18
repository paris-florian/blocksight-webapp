import React, { useState } from 'react';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tab, Tabs } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './DashboardTab.module.css';

// Types
interface Trader {
  id: number;
  name: string;
  type: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
}

interface GaugeMetricProps {
  value: number;
  label: string;
  status?: string;
}

// Mock data
const mockTraders: Trader[] = [
  { id: 1, name: 'Entity 1', type: 'BTC', price: 85940.05, change1h: -0.10, change24h: 2.19, change7d: -10.98 },
  { id: 2, name: 'Entity 2', type: 'BTC', price: 85940.05, change1h: -0.10, change24h: 2.19, change7d: -10.98 },
  { id: 3, name: 'Entity 3', type: 'BTC', price: 85940.05, change1h: -0.10, change24h: 2.19, change7d: -10.98 },
];

const formatPercentage = (value: number, includeSign: boolean = true): string => {
  const sign = includeSign ? (value > 0 ? '+' : '') : '';
  return `${sign}${value.toFixed(2)}%`;
};

const cardStyle = {
  bgcolor: 'white',
  borderRadius: '12px',
  p: 2,
  boxShadow: 'none',
};

const metricHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 0.5,
};

const metricLabelStyle = {
  color: 'text.secondary',
  fontSize: '0.875rem',
};

const GaugeMetric: React.FC<GaugeMetricProps> = ({ value, label, status = '' }) => (
  <Card sx={cardStyle}>
    <Box sx={metricHeaderStyle}>
      <Typography variant="body2" sx={metricLabelStyle}>
        {label}
      </Typography>
      <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
    </Box>
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
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
      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
          {value}
        </Typography>
        {status && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: -0.5 }}>
            {status}
          </Typography>
        )}
      </Box>
    </Box>
  </Card>
);

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change }) => (
  <Card sx={cardStyle}>
    <Box sx={metricHeaderStyle}>
      <Typography variant="body2" sx={metricLabelStyle}>
        {label}
      </Typography>
      <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 500 }}>{value}</Typography>
      {change && (
        <Typography
          variant="body2"
          sx={{
            color: change.startsWith('+') ? '#1EC490' : '#FF4B4B',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {change}
        </Typography>
      )}
    </Box>
  </Card>
);

export const DashboardTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
        Entity Overview
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 3 }}>
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
            <GaugeMetric value={62} label="Activity Score" status="Good" />
            <GaugeMetric value={19} label="Risk Level" status="Low" />
            <GaugeMetric value={39} label="Impact Score" status="Medium" />
            <MetricCard
              label="Total Value"
              value="$1,234,567"
              change="+2.06%"
            />
            <MetricCard
              label="Active Positions"
              value="12"
              change="+1"
            />
            <MetricCard
              label="Win Rate"
              value="65%"
              change="+5%"
            />
          </Box>

          <Card sx={cardStyle}>
            <Box sx={{ mb: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, newValue: number) => setSelectedTab(newValue)}
                sx={{
                  minHeight: 'auto',
                  '& .MuiTabs-flexContainer': { gap: 1 },
                }}
                TabIndicatorProps={{ sx: { display: 'none' } }}
              >
                {['Overview', 'Positions', 'History', 'Relationships'].map((label, index) => (
                  <Tab
                    key={label}
                    label={label}
                    sx={{
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 2,
                      py: 0.75,
                      borderRadius: '20px',
                      color: selectedTab === index ? 'text.primary' : 'text.secondary',
                      bgcolor: selectedTab === index ? 'action.selected' : 'transparent',
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} width={40}>#</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>Name</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">Value</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">1h %</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">24h %</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">7d %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTraders.map((trader) => (
                    <TableRow key={trader.id}>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" sx={{ color: 'text.secondary', p: 0.5 }}>
                            <StarBorderIcon fontSize="small" />
                          </IconButton>
                          {trader.id}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            component="img"
                            src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
                            sx={{ width: 20, height: 20, borderRadius: '50%' }}
                          />
                          {trader.name}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">
                        ${trader.price.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">
                        {formatPercentage(trader.change1h)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">
                        {formatPercentage(trader.change24h)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} align="right">
                        {formatPercentage(trader.change7d)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardTab; 