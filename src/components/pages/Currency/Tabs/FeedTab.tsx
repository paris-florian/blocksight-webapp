import React, { useState, useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Chip, Avatar, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { ThumbUpOutlined, ThumbUp, ShareOutlined, BookmarkBorderOutlined, Bookmark } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  UserInteraction, 
  loadUserInteractions, 
  toggleLike, 
  toggleSave, 
  shareItem, 
  getArticleSlug 
} from '../../../../services/InteractionService';
import { mockNews, NewsItem } from '../../../pages/Feed/FeedView';
import TabTitle from '../../../../components/shared/TabTitle';
import CategoryFilter from '../../../../components/shared/CategoryFilter';
import { COMMON_CATEGORIES } from '../../../../constants/categories';

interface FeedTabProps {
  currencySymbol?: string;
}

const FeedTab: React.FC<FeedTabProps> = ({ currencySymbol }) => {
  const { currencyId } = useParams();
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

  // Filter news for the current currency
  const filterNewsByCurrency = (news: NewsItem[], symbol?: string): NewsItem[] => {
    if (!symbol) return news;
    
    const lowerSymbol = symbol.toLowerCase();
    
    return news.filter(item => {
      // Check if the item's category matches the currency
      if (item.category && item.category.toLowerCase() === lowerSymbol) {
        return true;
      }
      
      // Check if any of the item's tags match the currency
      if (item.tags && item.tags.some(tag => tag.toLowerCase() === lowerSymbol)) {
        return true;
      }
      
      // Check if the item's title or description contains the currency symbol
      if (
        item.title.toLowerCase().includes(lowerSymbol) ||
        item.description.toLowerCase().includes(lowerSymbol)
      ) {
        return true;
      }
      
      return false;
    });
  };

  // Filter news based on selected category and currency
  const currencySymbolForFilter = currencySymbol || (currencyId ? String(currencyId) : '');
  
  // First filter by currency
  const currencyFilteredNews = filterNewsByCurrency(mockNews, currencySymbolForFilter);
  
  // Then filter by category
  const categoryFilteredNews = selectedCategory === 'All' 
    ? currencyFilteredNews 
    : currencyFilteredNews.filter(item => item.category === selectedCategory);
  
  // Sort news based on filter (top by likes, latest by time)
  const sortedNews = [...categoryFilteredNews].sort((a, b) => {
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
    navigate(`/articles/${slug}?source=currency&currency=${currencySymbolForFilter}`);
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Main Feed Section */}
      <Box>
        <Box sx={{ mb: 3 }}>
          <TabTitle>
            {currencySymbolForFilter ? `$${currencySymbolForFilter} Feed` : 'My Feed'}
          </TabTitle>
        </Box>
        
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

      {sortedNews.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {sortedNews.map((item) => (
            <Paper 
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
                      src={item.source ? `/logos/${item.source.toLowerCase().replace(/\s+/g, '-')}.png` : ""}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {item.source}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleLike(item.id); }}
                      sx={{ color: userInteractions.liked.includes(item.id) ? 'primary.main' : 'rgba(255, 255, 255, 0.6)' }}
                    >
                      {userInteractions.liked.includes(item.id) ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleSave(item.id); }}
                      sx={{ color: userInteractions.saved.includes(item.id) ? 'primary.main' : 'rgba(255, 255, 255, 0.6)' }}
                    >
                      {userInteractions.saved.includes(item.id) ? <Bookmark fontSize="small" /> : <BookmarkBorderOutlined fontSize="small" />}
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleShare(item); }}
                      sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    >
                      <ShareOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', py: 4 }}>
          No news items found for this currency.
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedTab;