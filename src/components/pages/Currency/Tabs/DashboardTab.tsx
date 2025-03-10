import React from 'react';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

// Styled components
const StyledCard = styled(Card)({
    backgroundColor: '#141414',
    borderRadius: '12px',
    padding: '16px',
    color: 'white',
    boxShadow: 'none',
});

const GaugeCard = styled(StyledCard)({
    display: 'flex',
    flexDirection: 'column',
    height: '120px',
    position: 'relative',
    padding: '12px',
});

const StyledProgress = styled(CircularProgress)<{ value: number }>(({ value }) => {
    const getColor = (value: number) => {
        if (value < 30) return '#FF4B4B';
        if (value < 70) return '#FFB937';
        return '#1EC490';
    };

    return {
        color: getColor(value),
        '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
            strokeWidth: '8',
        },
    };
});

const StyledTableCell = styled(TableCell)({
    color: 'white',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '8px 16px',
});

const StyledTableHeaderCell = styled(StyledTableCell)({
    color: '#8B8B8B',
    fontWeight: 600,
    fontSize: '0.875rem',
});

const TimelineCard = styled(StyledCard)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
});

const TimelineItem = styled(Box)({
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    '&:last-child': {
        borderBottom: 'none',
    },
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
    backgroundColor: '#1E1E1E',
    borderRadius: '20px',
    padding: '2px',
    '& .MuiToggleButton-root': {
        color: '#8B8B8B',
        border: 'none',
        borderRadius: '20px',
        padding: '4px 12px',
        textTransform: 'none',
        '&.Mui-selected': {
            backgroundColor: '#fff',
            color: '#000',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
    },
});

const StyledTab = styled(Tab)({
    textTransform: 'none',
    minWidth: 'auto',
    padding: '6px 16px',
    borderRadius: '20px',
    color: 'white',
    '&.Mui-selected': {
        backgroundColor: '#1E1E1E',
    },
});

// Mock data
const mockTraders = [
    { id: 1, name: 'XRP Team', type: 'BTC', price: 85940.05, change1h: -0.10, change24h: 2.19, change7d: -10.98 },
    { id: 2, name: 'Liberty FI', type: 'BTC', price: 85940.05, change1h: -0.10, change24h: 2.19, change7d: -10.98 },
    { id: 3, name: 'Anonymous Trader', type: 'BTC', price: 85940.05, change1h: -0.10, change24h: 2.19, change7d: -10.98 },
];

const mockNews = [
    {
        id: 1,
        title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC,...',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
    },
    // Duplicate the same news item multiple times as shown in the screenshot
    {
        id: 2,
        title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC,...',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
    },
    {
        id: 3,
        title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC,...',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
    },
];

const formatPercentage = (value: number, includeSign = true) => {
    const sign = includeSign ? (value > 0 ? '+' : '') : '';
    return `${sign}${value.toFixed(2)}%`;
};

const GaugeMetric = ({ value, label, status = '' }: { value: number; label: string; status?: string }) => (
    <GaugeCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#8B8B8B', fontSize: '0.875rem' }}>
                {label}
            </Typography>
            <ChevronRightIcon sx={{ color: '#8B8B8B', fontSize: '1.25rem' }} />
        </Box>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <StyledProgress
                variant="determinate"
                value={value}
                size={70}
                thickness={8}
            />
            <Box sx={{ 
                position: 'absolute', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center' 
            }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                    {value}
                </Typography>
                {status && (
                    <Typography variant="caption" sx={{ color: '#8B8B8B', mt: -0.5 }}>
                        {status}
                    </Typography>
                )}
            </Box>
        </Box>
    </GaugeCard>
);

const MetricCard = ({ label, value, change }: { label: string; value: string; change?: string }) => (
    <StyledCard sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#8B8B8B' }}>
                {label}
            </Typography>
            <ChevronRightIcon sx={{ color: '#8B8B8B', fontSize: '1.25rem' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 500 }}>{value}</Typography>
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
    </StyledCard>
);

export const DashboardTab = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [feedFilter, setFeedFilter] = React.useState('top');

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                Today's Stats (24H)
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 3 }}>
                <Box>
                    {/* Stats Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                        <GaugeMetric value={62} label="Retail Net Volume" status="Good" />
                        <GaugeMetric value={19} label="HWT Fear & Greed" status="Extreme Fear" />
                        <GaugeMetric value={39} label="Whale Fear & Greed" status="Fear" />
                        <GaugeMetric value={39} label="Whale" status="Fear" />
                        <MetricCard
                            label="Avg Order Size"
                            value="$172.78"
                            change="+2.06%"
                        />
                        <StyledCard sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ color: '#8B8B8B' }}>
                                    Whale/Retail Volume
                                </Typography>
                                <ChevronRightIcon sx={{ color: '#8B8B8B', fontSize: '1.25rem' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GroupsIcon sx={{ color: '#3861FB', fontSize: '1rem' }} />
                                        <Typography variant="body2">Whale</Typography>
                                    </Box>
                                    <Typography variant="body2">30.32%</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon sx={{ color: '#FFB937', fontSize: '1rem' }} />
                                        <Typography variant="body2">Retail</Typography>
                                    </Box>
                                    <Typography variant="body2">79.68%</Typography>
                                </Box>
                            </Box>
                        </StyledCard>
                    </Box>

                    {/* Top Traders Section */}
                    <StyledCard>
                        <Box sx={{ mb: 2 }}>
                            <Tabs
                                value={selectedTab}
                                onChange={(_, newValue) => setSelectedTab(newValue)}
                                sx={{
                                    minHeight: 'auto',
                                    '& .MuiTabs-flexContainer': {
                                        gap: 1,
                                    },
                                }}
                                TabIndicatorProps={{ sx: { display: 'none' } }}
                            >
                                <StyledTab label="Biggest Holder" />
                                <StyledTab label="$TRUMP PNL" />
                                <StyledTab label="$TRUMP % PNL" />
                                <StyledTab label="Highest Avg. ROI" />
                                <StyledTab label="Highest Winrate" />
                            </Tabs>
                        </Box>

                        <TableContainer sx={{ backgroundColor: 'transparent' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableHeaderCell width={40}>#</StyledTableHeaderCell>
                                        <StyledTableHeaderCell>Name</StyledTableHeaderCell>
                                        <StyledTableHeaderCell align="right">Price</StyledTableHeaderCell>
                                        <StyledTableHeaderCell align="right">1h %</StyledTableHeaderCell>
                                        <StyledTableHeaderCell align="right">24h %</StyledTableHeaderCell>
                                        <StyledTableHeaderCell align="right">7d %</StyledTableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockTraders.map((trader) => (
                                        <TableRow key={trader.id} sx={{ '&:last-child td': { border: 0 } }}>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton size="small" sx={{ color: '#8B8B8B', p: 0.5 }}>
                                                        <StarBorderIcon fontSize="small" />
                                                    </IconButton>
                                                    {trader.id}
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box
                                                        component="img"
                                                        src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
                                                        sx={{ width: 20, height: 20, borderRadius: '50%' }}
                                                    />
                                                    {trader.name}
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">${trader.price.toLocaleString()}</StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    {trader.change1h >= 0 ? 
                                                        <ArrowUpwardIcon sx={{ color: '#1EC490', fontSize: '1rem' }} /> :
                                                        <ArrowDownwardIcon sx={{ color: '#FF4B4B', fontSize: '1rem' }} />
                                                    }
                                                    <Typography sx={{ color: trader.change1h >= 0 ? '#1EC490' : '#FF4B4B' }}>
                                                        {formatPercentage(Math.abs(trader.change1h))}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    {trader.change24h >= 0 ? 
                                                        <ArrowUpwardIcon sx={{ color: '#1EC490', fontSize: '1rem' }} /> :
                                                        <ArrowDownwardIcon sx={{ color: '#FF4B4B', fontSize: '1rem' }} />
                                                    }
                                                    <Typography sx={{ color: trader.change24h >= 0 ? '#1EC490' : '#FF4B4B' }}>
                                                        {formatPercentage(Math.abs(trader.change24h))}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    {trader.change7d >= 0 ? 
                                                        <ArrowUpwardIcon sx={{ color: '#1EC490', fontSize: '1rem' }} /> :
                                                        <ArrowDownwardIcon sx={{ color: '#FF4B4B', fontSize: '1rem' }} />
                                                    }
                                                    <Typography sx={{ color: trader.change7d >= 0 ? '#1EC490' : '#FF4B4B' }}>
                                                        {formatPercentage(Math.abs(trader.change7d))}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </StyledCard>
                </Box>

                {/* News Feed Timeline */}
                <TimelineCard>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1rem' }}>Feed</Typography>
                        <StyledToggleButtonGroup
                            value={feedFilter}
                            exclusive
                            onChange={(_, newValue) => newValue && setFeedFilter(newValue)}
                            size="small"
                        >
                            <ToggleButton value="top">Top</ToggleButton>
                            <ToggleButton value="latest">Latest</ToggleButton>
                        </StyledToggleButtonGroup>
                    </Box>
                    <Box sx={{ overflowY: 'auto', flex: 1 }}>
                        {mockNews.map((item) => (
                            <TimelineItem key={item.id}>
                                <Typography variant="body2" sx={{ color: '#8B8B8B', mb: 1, fontSize: '0.875rem' }}>
                                    {item.timeAgo}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'white', mb: 1, fontWeight: 500, fontSize: '0.9375rem' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#8B8B8B', mb: 1, fontSize: '0.875rem' }}>
                                    {item.description}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#8B8B8B', fontSize: '0.875rem' }}>
                                    {item.source}
                                </Typography>
                            </TimelineItem>
                        ))}
                    </Box>
                </TimelineCard>
            </Box>
        </Box>
    );
};