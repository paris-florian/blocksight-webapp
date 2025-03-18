import React, { useState } from 'react';
import { Box, Card, Typography, Chip, Grid, IconButton } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import styles from './DashboardTab.module.css';
import TabTitle from '../../../../components/shared/TabTitle';
import CategoryFilter from '../../../../components/shared/CategoryFilter';
import { COMMON_CATEGORIES } from '../../../../constants/categories';
import { ColumnDefinition, ColumnDefinitionType, DataTable, IRecord, SortDirection } from "../../../../Table/DataTable";
import { query, SortConfig } from "../../../../../services/Query.service";
import { traderRecords } from "../../../../../data/data";
import { useNavigate } from 'react-router-dom';

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

interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  timeAgo: string;
  category: string;
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

// Table column definitions for traders
const fields: ColumnDefinition[] = [
  { 
    fieldName: "name", 
    name: "Name", 
    sortable: false, 
    filterable: false, 
    type: ColumnDefinitionType.NameWithAvatar, 
    sortIndex: 0,
    imageFieldName: "image" 
  },
  { 
    fieldName: "average-trade-return-percentage", 
    name: "Avg. ROI", 
    filterable: true, 
    sortable: true, 
    type: ColumnDefinitionType.Percentage, 
    group: "ROI", 
    labelGroup: "Performance", 
    sortIndex: 1 
  },
  { 
    fieldName: "winrate-total", 
    name: "Winrate", 
    filterable: true, 
    sortable: true, 
    type: ColumnDefinitionType.Percentage, 
    group: "Winrate", 
    labelGroup: "Performance", 
    sortIndex: 2 
  },
  { 
    fieldName: "drawdown", 
    name: "Drawdown", 
    filterable: true, 
    sortable: true, 
    type: ColumnDefinitionType.Percentage, 
    group: "Drawdown", 
    labelGroup: "Risk", 
    sortIndex: 3 
  },
];

// Mock data
const mockNews: NewsItem[] = [
    {
        id: 1,
        title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC,...',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
        category: 'All',
    },
    {
        id: 2,
        title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC,...',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
        category: 'All',
    },
    {
        id: 3,
        title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC,...',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
        category: 'All',
    },
];

const formatPercentage = (value: number, includeSign: boolean = true): string => {
    const sign = includeSign ? (value > 0 ? '+' : '') : '';
    return `${sign}${value.toFixed(2)}%`;
};

const getValueCategory = (value: number): 'low' | 'medium' | 'high' => {
    if (value < 30) return 'low';
    if (value < 70) return 'medium';
    return 'high';
};

// Card styles for different themes
// Dark theme style for all cards to maintain consistency
const cardStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    p: 2,
    boxShadow: 'none',
    color: 'white',
};

// Dark theme style for feed section - matches the main feed component style
const darkCardStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    p: 0,
    boxShadow: 'none',
    color: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
};

const metricHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 0.5,
};

const metricLabelStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
};

const GaugeMetric: React.FC<GaugeMetricProps> = ({ value, label, status = '' }) => (
    <Card sx={cardStyle}>
        <Box sx={metricHeaderStyle}>
            <Typography variant="body2" sx={metricLabelStyle}>
                {label}
            </Typography>
            <ChevronRightIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.25rem' }} />
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
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, color: 'white' }}>
                    {value}
                </Typography>
                {status && (
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: -0.5 }}>
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
            <ChevronRightIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.25rem' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: 'white' }}>{value}</Typography>
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
    const [feedFilter, setFeedFilter] = useState<'top' | 'latest'>('top');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortField, setSortField] = useState<SortConfig>({ 
        fieldName: 'winrate-total', 
        direction: SortDirection.descending 
    });
    const navigate = useNavigate();

    // Filter news for Feed section based on selected category
    const filteredNews = selectedCategory === 'All' 
      ? mockNews 
      : mockNews.filter(item => item.category === selectedCategory);
    
    const sortedNews = [...filteredNews].slice(0, 5);
    
    // Query and sort trader records for the table
    const filteredAndSortedTraders = query(traderRecords, [], sortField, fields).slice(0, 5);
    
    // Handle trader row click
    const handleRowClick = (recordId: string) => {
        navigate(`/traders/${recordId}`);
    };

    return (
        <Box sx={{ py: 3 }}>
            <TabTitle>Today's Stats (24H)</TabTitle>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 3 }}>
                {/* Left column - Statistics section with dark theme */}
                <Box>
                    {/* Stats cards with metric information */}
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
                        <Card sx={cardStyle}>
                            <Box sx={metricHeaderStyle}>
                                <Typography variant="body2" sx={metricLabelStyle}>
                                    Whale/Retail Volume
                                </Typography>
                                <ChevronRightIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.25rem' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GroupsIcon sx={{ color: '#3861FB', fontSize: '1rem' }} />
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Whale</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>30.32%</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon sx={{ color: '#FFB937', fontSize: '1rem' }} />
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Retail</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>79.68%</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Box>

                    {/* Top Traders Table */}
                    <Card sx={cardStyle}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', color: 'white' }}>
                                Top Traders
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'rgba(255, 255, 255, 0.6)', 
                                    cursor: 'pointer',
                                    '&:hover': { color: 'white' },
                                    fontSize: '0.875rem'
                                }}
                                onClick={() => navigate('/traders')}
                            >
                                View All
                            </Typography>
                        </Box>
                        
                        <DataTable 
                            handleSort={(name: string, direction: SortDirection) => { setSortField({fieldName: name, direction}) }} 
                            columnDefinitionsArray={fields} 
                            records={filteredAndSortedTraders} 
                            onRowClick={handleRowClick}
                        />
                    </Card>
                </Box>

                {/* Right column - Feed section with dark theme to match main feed */}
                <Card sx={darkCardStyle}>
                    {/* Feed header */}
                    <Box sx={{ 
                        p: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', color: 'white' }}>Feed</Typography>
                    </Box>

                    {/* Feed filter controls */}
                    <Box sx={{ p: 2 }}>
                        <CategoryFilter 
                            categories={COMMON_CATEGORIES}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            feedFilter={feedFilter}
                            onFeedFilterChange={setFeedFilter}
                            darkMode={true} // Use dark mode to match feed styling
                            sx={{ mb: 1 }}
                        />
                    </Box>

                    {/* Feed items list */}
                    <Box sx={{ overflowY: 'auto', flex: 1 }}>
                        {sortedNews.map((item) => (
                            <Box 
                                key={item.id} 
                                sx={{ 
                                    p: 2, 
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                                    '&:last-child': { borderBottom: 'none' },
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        cursor: 'pointer'
                                    },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1, fontSize: '0.875rem' }}>
                                    {item.timeAgo}
                                </Typography>
                                <Typography sx={{ mb: 1, fontWeight: 500, fontSize: '0.9375rem', color: 'white' }}>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '0.875rem' }}>
                                    {item.description}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                                    {item.source}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default DashboardTab;