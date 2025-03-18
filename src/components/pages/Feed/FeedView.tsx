import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, ToggleButtonGroup, ToggleButton, Divider, Chip, Avatar, IconButton, Grid, Paper, Snackbar, Alert } from '@mui/material';
import styles from './FeedView.module.css';
import { ThumbUpOutlined, ThumbUp, ShareOutlined, BookmarkBorderOutlined, Bookmark, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  UserInteraction, 
  loadUserInteractions, 
  saveUserInteractions, 
  toggleLike, 
  toggleSave, 
  shareItem, 
  getArticleSlug 
} from '../../../services/InteractionService';
import { slugify } from '../../../utilities/stringUtils';
import TabTitle from '../../../components/shared/TabTitle';
import CategoryFilter from '../../../components/shared/CategoryFilter';
import { COMMON_CATEGORIES } from '../../../constants/categories';

// Types
export interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  timeAgo: string;
  image?: string;
  category?: string;
  likes?: number;
  comments?: number;
  trending?: boolean;
  tags?: string[];
}

// Mock data with enhanced properties
export const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'Metaplanet Buys 497 More Bitcoin, Pushing Holdings to Nearly $251M',
    description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings, spending $43.9 million at an average price of $88,448 per BTC. This strategic move signals growing institution confidence in cryptocurrency as a long-term investment.',
    source: 'Finance Feeds',
    timeAgo: '50 minutes ago',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Institution',
    likes: 342,
    comments: 57,
    trending: true,
    tags: ['bitcoin', 'btc', 'institution', 'investment']
  },
  {
    id: 2,
    title: 'Ethereum Layer-2 Solutions See Record Transaction Volume as Gas Fees Spike',
    description: 'Layer-2 scaling solutions for Ethereum have experienced unprecedented growth this week, with Arbitrum and Optimism recording all-time high transaction volumes. The surge comes as Ethereum mainnet gas fees reached their highest levels since 2022.',
    source: 'Crypto Insights',
    timeAgo: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
    category: 'Technology',
    likes: 215,
    comments: 32,
    trending: true,
    tags: ['ethereum', 'eth', 'layer2', 'arbitrum', 'optimism']
  },
  {
    id: 3,
    title: 'SEC Commissioner Hints at Potential Approval for Spot Ethereum ETFs',
    description: 'In a recent speech, SEC Commissioner Hester Peirce suggested that the regulatory body might be warming up to approving spot Ethereum ETFs following the successful launch of Bitcoin ETFs earlier this year. Market analysts predict this could trigger a new wave of institution investment.',
    source: 'Regulatory Watch',
    timeAgo: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    category: 'Regulation',
    likes: 512,
    comments: 98,
    trending: true,
    tags: ['ethereum', 'eth', 'sec', 'etf', 'regulation']
  },
  {
    id: 4,
    title: 'DeFi Protocol Aave Launches V4 with Enhanced Security Features',
    description: 'Decentralized finance protocol Aave has officially launched its V4 upgrade, introducing advanced security features and improved capital efficiency. The update comes after months of testing and community governance votes.',
    source: 'DeFi Daily',
    timeAgo: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    category: 'DeFi',
    likes: 189,
    comments: 41,
    trending: true,
    tags: ['aave', 'defi', 'protocol', 'security']
  },
  {
    id: 5,
    title: 'Central Bank Digital Currencies: Japan Accelerates CBDC Development',
    description: 'The Bank of Japan has announced plans to accelerate its central bank digital currency (CBDC) development program, with pilot testing scheduled to begin next quarter. This move positions Japan among the leading nations in CBDC implementation.',
    source: 'Global Finance',
    timeAgo: '7 hours ago',
    image: 'https://images.unsplash.com/photo-1601841197690-6f0838bdb005?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'CBDC',
    likes: 276,
    comments: 63,
    trending: true,
    tags: ['cbdc', 'japan', 'regulation', 'digital currency']
  },
  {
    id: 6,
    title: 'NFT Market Shows Signs of Recovery with Trading Volume Up 30%',
    description: 'After months of declining activity, the NFT market is showing strong signs of recovery with trading volume increasing by 30% month-over-month. New collections and renewed interest from institution buyers are driving this resurgence.',
    source: 'NFT Insider',
    timeAgo: '9 hours ago',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    category: 'NFTs',
    likes: 154,
    comments: 27,
    tags: ['nft', 'crypto', 'trading', 'collectibles']
  },
  {
    id: 7,
    title: 'Bitcoin Mining Difficulty Reaches All-Time High as Hash Rate Surges',
    description: 'Bitcoin mining difficulty has adjusted upward by 5.8%, reaching a new all-time high. The increase comes as global hash rate continues to climb, with new mining operations coming online in various regions.',
    source: 'Mining Report',
    timeAgo: '11 hours ago',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Mining',
    likes: 198,
    comments: 45,
    tags: ['bitcoin', 'btc', 'mining', 'hash rate']
  },
  {
    id: 8,
    title: 'Major Exchange Introduces New Trading Features for Institution Clients',
    description: 'A leading cryptocurrency exchange has unveiled a suite of advanced trading features specifically designed for institution clients, including enhanced API access, customizable trading interfaces, and improved security protocols.',
    source: 'Exchange News',
    timeAgo: '14 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Trading',
    likes: 167,
    comments: 29,
    tags: ['exchange', 'trading', 'institution', 'crypto']
  },
];

// Category filters
// Removed categories array in favor of importing from constants

const FeedView = () => {
  const [feedFilter, setFeedFilter] = useState<'top' | 'latest'>('top');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userInteractions, setUserInteractions] = useState<UserInteraction>({ liked: [], saved: [] });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  // Load user interactions from localStorage on component mount
  useEffect(() => {
    setUserInteractions(loadUserInteractions());
  }, []);

  // Handle like button click
  const handleLike = (id: number) => {
    setUserInteractions(toggleLike(id, userInteractions));
  };

  // Handle save button click
  const handleSave = (id: number) => {
    setUserInteractions(toggleSave(id, userInteractions));
  };

  // Handle share button click
  const handleShare = (item: NewsItem) => {
    shareItem(item.id, item.title)
      .then(shareUrl => {
        setSnackbarMessage(`Link copied to clipboard: ${shareUrl}`);
        setSnackbarOpen(true);
      })
      .catch(err => {
        setSnackbarMessage('Failed to copy link to clipboard');
        setSnackbarOpen(true);
      });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Get trending news items
  const trendingNews = mockNews.filter(item => item.trending);
  
  // Filter news based on selected category
  const filteredNews = selectedCategory === 'All' 
    ? mockNews 
    : mockNews.filter(item => item.category === selectedCategory);

  // Sort news based on filter (top by likes, latest by time)
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (feedFilter === 'top') {
      return (b.likes || 0) - (a.likes || 0);
    } else {
      // Simple sort by timeAgo (in a real app, would use actual timestamps)
      return a.timeAgo.localeCompare(b.timeAgo);
    }
  });

  // Handle article click
  const handleArticleClick = (id: number) => {
    const slug = getArticleSlug(id, mockNews.find(item => item.id === id)?.title);
    navigate(`/articles/${slug}`);
  };

  return (
    <Box sx={{ py: 3 }} className={styles.container}>
      {/* Trending Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUp sx={{ color: '#FF4081', mr: 1 }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Trending Now
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {trendingNews.slice(0, 1).map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Paper 
                sx={{ 
                  position: 'relative',
                  height: 400,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%), url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleArticleClick(item.id)}
              >
                <Box sx={{ p: 3 }}>
                  {item.category && (
                    <Chip 
                      label={item.category} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.75rem',
                        height: 24,
                        mb: 1
                      }}
                    />
                  )}
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      mb: 1,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                      {item.source} • {item.timeAgo}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
          
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {trendingNews.slice(1, 5).map((item, index) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Paper 
                    sx={{ 
                      position: 'relative',
                      height: 190,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%), url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleArticleClick(item.id)}
                  >
                    <Box sx={{ p: 2 }}>
                      {item.category && (
                        <Chip 
                          label={item.category} 
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '0.75rem',
                            height: 24,
                            mb: 1
                          }}
                        />
                      )}
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600,
                          mb: 1,
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                          fontSize: '0.9rem',
                          lineHeight: 1.2
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem' }}>
                        {item.source} • {item.timeAgo}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Main Feed Section */}
      <Box sx={{ mb: 4 }}>
        <TabTitle>
          My Feed
        </TabTitle>
        
        <Box sx={{ mb: 3 }}>
          <CategoryFilter 
            categories={COMMON_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            feedFilter={feedFilter}
            onFeedFilterChange={setFeedFilter}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {sortedNews.map((item) => (
          <Card 
            key={item.id} 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer'
              }
            }}
            onClick={() => handleArticleClick(item.id)}
          >
            {item.image && (
              <Box 
                sx={{ 
                  height: 200, 
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                  {item.timeAgo}
                </Typography>
                {item.category && (
                  <Chip 
                    label={item.category} 
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.75rem',
                      height: 24
                    }}
                  />
                )}
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.3, color: 'white' }}>
                {item.title}
              </Typography>
              
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, fontSize: '0.9375rem' }}>
                {item.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={`https://ui-avatars.com/api/?name=${item.source}&background=random`} 
                    sx={{ width: 28, height: 28, mr: 1 }}
                  />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                    {item.source}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleLike(item.id)}
                    sx={{ 
                      color: userInteractions.liked.includes(item.id) ? '#FF4081' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    {userInteractions.liked.includes(item.id) ? 
                      <ThumbUp fontSize="small" /> : 
                      <ThumbUpOutlined fontSize="small" />
                    }
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleShare(item)}
                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    <ShareOutlined fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleSave(item.id)}
                    sx={{ 
                      color: userInteractions.saved.includes(item.id) ? '#4FC3F7' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    {userInteractions.saved.includes(item.id) ? 
                      <Bookmark fontSize="small" /> : 
                      <BookmarkBorderOutlined fontSize="small" />
                    }
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Snackbar for share notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedView; 