import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Chip, 
  Avatar, 
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  IconButton,
  Skeleton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon, 
  CalendarToday as CalendarTodayIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ThumbUp as ThumbUpIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getArticleBySlug, getRelatedArticles, Article } from '../../../data/articles';
import { 
  UserInteraction, 
  loadUserInteractions, 
  toggleLike, 
  toggleSave, 
  shareItem 
} from '../../../services/InteractionService';
import styles from './ArticleView.module.css';

const ArticleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInteractions, setUserInteractions] = useState<UserInteraction>({ liked: [], saved: [] });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fromCurrency, setFromCurrency] = useState<string | null>(null);

  useEffect(() => {
    // Load user interactions
    setUserInteractions(loadUserInteractions());

    // Check if we came from a currency view
    const searchParams = new URLSearchParams(location.search);
    const source = searchParams.get('source');
    const currencyId = searchParams.get('currency');
    
    if (source === 'currency' && currencyId) {
      setFromCurrency(currencyId);
    }

    if (slug) {
      // Simulate loading delay
      setLoading(true);
      setTimeout(() => {
        const foundArticle = getArticleBySlug(slug);
        if (foundArticle) {
          setArticle(foundArticle);
          setRelatedArticles(getRelatedArticles(foundArticle.id));
        }
        setLoading(false);
      }, 500);
    }
  }, [slug, location.search]);

  const handleRelatedArticleClick = (articleSlug: string) => {
    // Preserve the source information when navigating to related articles
    const query = fromCurrency ? `?source=currency&currency=${fromCurrency}` : '';
    navigate(`/articles/${articleSlug}${query}`);
    // Scroll to top when navigating to a new article
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    if (fromCurrency) {
      // Navigate back to the feed tab of the currency view
      navigate(`/currencies/${fromCurrency}#feed`);
    } else {
      // Default navigation to the main feed
      navigate('/feed');
    }
  };

  // Handle like button click
  const handleLike = () => {
    if (article) {
      setUserInteractions(toggleLike(article.id, userInteractions));
    }
  };

  // Handle save button click
  const handleSave = () => {
    if (article) {
      setUserInteractions(toggleSave(article.id, userInteractions));
    }
  };

  // Handle share button click
  const handleShare = () => {
    if (article) {
      shareItem(article.id, article.title)
        .then(shareUrl => {
          setSnackbarMessage(`Link copied to clipboard: ${shareUrl}`);
          setSnackbarOpen(true);
        })
        .catch(err => {
          setSnackbarMessage('Failed to copy link to clipboard');
          setSnackbarOpen(true);
        });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className={styles.articleContainer}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBackClick} sx={{ mr: 2, color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Skeleton variant="text" width="30%" height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box>
            <Skeleton variant="text" width={120} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            <Skeleton variant="text" width={180} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          </Box>
        </Box>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
      </Container>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="lg" className={styles.articleContainer}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
            Article Not Found
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
            The article you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleBackClick}
            sx={{ 
              bgcolor: '#3f51b5', 
              '&:hover': { bgcolor: '#303f9f' } 
            }}
          >
            Back to Feed
          </Button>
        </Box>
      </Container>
    );
  }

  const backButtonText = fromCurrency ? `Back to ${fromCurrency} Feed` : 'Back to Feed';

  return (
    <Container maxWidth="lg" className={styles.articleContainer}>
      {/* Back button */}
      <Box sx={{ mb: 4, px: { xs: 2, md: 0 } }}>
        <Button
          onClick={handleBackClick}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'none',
            '&:hover': { 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white'
            }
          }}
        >
          {backButtonText}
        </Button>
      </Box>

      {/* Article Header */}
      <Box 
        sx={{ 
          position: 'relative',
          height: { xs: '300px', md: '500px' },
          mb: 5,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          mx: { xs: 2, md: 0 }
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${article.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)',
            zIndex: 1
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
            zIndex: 2
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 5 },
            zIndex: 3
          }}
        >
          <Chip 
            label={article.category} 
            sx={{ 
              mb: 2, 
              bgcolor: '#3f51b5', 
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            {article.title}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 2,
              maxWidth: '800px',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            {article.summary}
          </Typography>
        </Box>
      </Box>

      {/* Article Meta */}
      <Grid container spacing={3} sx={{ mb: 5, px: { xs: 2, md: 0 } }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              src={article.author.avatar} 
              alt={article.author.name}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                {article.author.name}
              </Typography>
              {article.author.bio && (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {article.author.bio}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {article.publishedDate}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {article.readTime}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, mb: 2 }}>
            <IconButton 
              onClick={handleLike}
              sx={{ 
                color: userInteractions.liked.includes(article?.id || 0) ? '#FF4081' : 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } 
              }}
            >
              {userInteractions.liked.includes(article?.id || 0) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            </IconButton>
            <IconButton 
              onClick={handleSave}
              sx={{ 
                color: userInteractions.saved.includes(article?.id || 0) ? '#4FC3F7' : 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } 
              }}
            >
              {userInteractions.saved.includes(article?.id || 0) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            <IconButton 
              onClick={handleShare}
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } 
              }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4, px: { xs: 2, md: 0 } }}>
        {article.tags.map((tag, index) => (
          <Chip 
            key={index} 
            label={tag} 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' }
            }} 
          />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4, mx: { xs: 2, md: 0 } }} />

      {/* Article Content */}
      <Grid container sx={{ px: { xs: 2, md: 0 } }}>
        <Grid item xs={12}>
          <Box 
            className={styles.articleContent}
            sx={{ 
              mb: 6,
              maxWidth: { xs: '100%', md: '100%' }
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 6, mx: { xs: 2, md: 0 } }} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Box sx={{ mb: 6, px: { xs: 2, md: 0 } }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Related Articles
          </Typography>
          <Grid container spacing={3}>
            {relatedArticles.map((relatedArticle) => (
              <Grid item xs={12} sm={6} md={4} key={relatedArticle.id}>
                <Card 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    }
                  }}
                  onClick={() => handleRelatedArticleClick(relatedArticle.slug)}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={relatedArticle.coverImage}
                    alt={relatedArticle.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 'bold',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {relatedArticle.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {relatedArticle.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {relatedArticle.publishedDate}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {relatedArticle.readTime}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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
    </Container>
  );
};

export default ArticleView; 