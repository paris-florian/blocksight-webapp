import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import styles from "./Header.module.css";
import logo from "../assets/logo.svg";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, ClickAwayListener, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography, Avatar, Badge, Tooltip, Card, Divider, Popover } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tokens, Token } from "../data/data";
import { isNotificationRelevant } from "../services/FollowService";
import { getArticleSlug } from "../services/InteractionService";

// Notification item interface
interface NotificationItem {
    id: number;
    title: string;
    description: string;
    source: string;
    timeAgo: string;
    image?: string;
    category?: string;
    tags?: string[];
    isRead: boolean;
}

// LocalStorage key for read notifications
const READ_NOTIFICATIONS_KEY = 'blocksight_read_notifications';

// Function to load read notifications from localStorage
const loadReadNotifications = (): number[] => {
    try {
        const storedData = localStorage.getItem(READ_NOTIFICATIONS_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading read notifications from localStorage:', error);
    }
    return [];
};

// Function to save read notifications to localStorage
const saveReadNotifications = (readIds: number[]): void => {
    try {
        localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(readIds));
    } catch (error) {
        console.error('Error saving read notifications to localStorage:', error);
    }
};

// Mock notifications data
const mockNotifications: NotificationItem[] = [
    {
        id: 1,
        title: 'Metaplanet Buys 497 More Bitcoin',
        description: 'Japanese investment firm Metaplanet added another 497 Bitcoin to its holdings.',
        source: 'Finance Feeds',
        timeAgo: '50 minutes ago',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        category: 'Bitcoin',
        tags: ['BTC', 'Metaplanet', 'Institution'],
        isRead: false
    },
    {
        id: 2,
        title: 'Ethereum Layer-2 Solutions See Record Volume',
        description: 'Layer-2 scaling solutions for Ethereum have experienced unprecedented growth this week.',
        source: 'Crypto Insights',
        timeAgo: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
        category: 'Ethereum',
        tags: ['ETH', 'Layer2', 'Arbitrum', 'Optimism'],
        isRead: false
    },
    {
        id: 3,
        title: 'SEC Commissioner Hints at ETF Approval',
        description: 'SEC Commissioner suggests the regulatory body might approve spot Ethereum ETFs.',
        source: 'Regulatory Watch',
        timeAgo: '3 hours ago',
        image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
        category: 'Ethereum',
        tags: ['ETH', 'SEC', 'ETF', 'Regulation'],
        isRead: false
    },
    {
        id: 4,
        title: 'DeFi Protocol Aave Launches V4',
        description: 'Decentralized finance protocol Aave has officially launched its V4 upgrade.',
        source: 'DeFi Daily',
        timeAgo: '5 hours ago',
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
        category: 'DeFi',
        tags: ['AAVE', 'DeFi', 'V4'],
        isRead: false
    },
    {
        id: 5,
        title: 'Japan Accelerates CBDC Development',
        description: 'The Bank of Japan has announced plans to accelerate its CBDC development program.',
        source: 'Global Finance',
        timeAgo: '7 hours ago',
        image: 'https://images.unsplash.com/photo-1601841197690-6f0838bdb005?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        category: 'CBDC',
        tags: ['Japan', 'CBDC', 'Central Bank'],
        isRead: false
    }
];

// Styled components
const StyledSearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderRadius: '8px',
        height: '38px',
        overflow: 'hidden',
        '& fieldset': {
            borderColor: 'rgba(80, 80, 80, 0.5)',
            borderWidth: '1px',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(100, 100, 100, 0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#3f51b5',
            borderWidth: '1px',
        },
    },
    '& .MuiInputBase-input': {
        color: '#b8b8b8',
        padding: '8px 14px',
        fontSize: '13px',
        fontFamily: 'monospace',
    },
    '& .MuiInputAdornment-root': {
        color: '#6e6e6e',
    },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: '4px',
    margin: '3px 0',
    '&:hover': {
        backgroundColor: 'rgba(40, 40, 40, 0.8)',
        cursor: 'pointer',
    },
}));

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredResults, setFilteredResults] = useState<Token[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLButtonElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLButtonElement | null>(null);
    
    // Initialize notifications with read status from localStorage
    const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
        const readIds = loadReadNotifications();
        return mockNotifications.map(notification => ({
            ...notification,
            isRead: readIds.includes(notification.id)
        }));
    });
    
    // Get filtered notifications based on followed entities
    const filteredNotifications = notifications.filter(notification => 
        isNotificationRelevant(notification)
    );
    
    // Update unread count to only count relevant notifications
    const unreadCount = filteredNotifications.filter(notification => !notification.isRead).length;
    
    // Update localStorage when read status changes
    useEffect(() => {
        const readIds = notifications
            .filter(notification => notification.isRead)
            .map(notification => notification.id);
        
        saveReadNotifications(readIds);
    }, [notifications]);
    
    const handleNotificationOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };
    
    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };
    
    const handleNotificationClick = (notification: NotificationItem) => {
        // Mark notification as read
        setNotifications(prevNotifications => 
            prevNotifications.map(item => 
                item.id === notification.id ? { ...item, isRead: true } : item
            )
        );
        
        // Generate proper article slug and navigate
        const slug = getArticleSlug(notification.id, notification.title);
        navigate(`/articles/${slug}`);
        handleNotificationClose();
    };
    
    const markAllAsRead = () => {
        setNotifications(prevNotifications => 
            prevNotifications.map(item => ({ ...item, isRead: true }))
        );
    };
    
    const isNotificationOpen = Boolean(notificationAnchorEl);
    
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Filter tokens based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = tokens.filter(token => 
            token.name.toLowerCase().includes(query) || 
            token.symbol.toLowerCase().includes(query) ||
            (token.contractAddress && token.contractAddress.toLowerCase().includes(query))
        );
        setFilteredResults(filtered);
    }, [searchQuery]);

    const handleSearchFocus = () => {
        setShowResults(true);
    };

    const handleSearchBlur = () => {
        // Delay hiding results to allow for clicking on them
        setTimeout(() => {
            setShowResults(false);
        }, 200);
    };

    const handleTokenSelect = (token: Token) => {
        navigate(`/currencies/${token.id}`);
        setSearchQuery('');
        setShowResults(false);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Function to highlight matching text in search results
    const highlightMatch = (text: string, query: string) => {
        if (!query.trim()) return text;
        
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (!lowerText.includes(lowerQuery)) return text;
        
        const startIndex = lowerText.indexOf(lowerQuery);
        const endIndex = startIndex + lowerQuery.length;
        
        return (
            <>
                {text.substring(0, startIndex)}
                <span style={{ 
                    backgroundColor: 'rgba(63, 81, 181, 0.15)', 
                    color: '#7986cb', 
                    padding: '0 2px',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(63, 81, 181, 0.3)'
                }}>
                    {text.substring(startIndex, endIndex)}
                </span>
                {text.substring(endIndex)}
            </>
        );
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <nav className={styles.navSection}>
                    <div className={styles.logoContainer} onClick={() => navigate('/')}>
                        <img src={logo} alt="BlockSight Logo" className={styles.logoImage} />
                    </div>
                    <ul className={styles.navLinks}>
                        <li className={isActive('/') ? styles.active : ''} onClick={() => navigate('/')}>Overview</li>
                        <li className={isActive('/feed') ? styles.active : ''} onClick={() => navigate('/feed')}>Feed</li>
                        <li className={isActive('/superchart') ? styles.active : ''} onClick={() => navigate('/superchart/btc')}>Superchart</li>
                        <li className={isActive('/top-tokens') ? styles.active : ''} onClick={() => navigate('/top-tokens')}>Top Tokens</li>
                        <li className={isActive('/top-traders') ? styles.active : ''} onClick={() => navigate('/top-traders')}>Top Traders</li>
                        {/* <li className={isActive('/top-institutions') ? styles.active : ''} onClick={() => navigate('/top-institutions')}>Top Institutions</li> */}
                        {/* <li className={isActive('/top-influencers') ? styles.active : ''} onClick={() => navigate('/top-influencers')}>Top Influencers</li> */}
                    </ul>
                </nav>
                
                <div className={styles.rightSection}>
                    <Box ref={searchRef} className={styles.searchContainer} position="relative">
                        <StyledSearchField
                            size="small"
                            sx={{
                               width: '20rem',

                            }}
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#6e6e6e', fontSize: '16px' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            onClick={handleClearSearch}
                                            size="small"
                                            sx={{ color: '#6e6e6e', padding: '2px' }}
                                        >
                                            <CloseIcon fontSize="small" sx={{ fontSize: '14px' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {showResults && filteredResults.length > 0 && (
                            <Paper 
                                className={styles.searchResults}
                                sx={{ 
                                    position: 'absolute', 
                                    top: '100%', 
                                    left: 0, 
                                    right: 0, 
                                    mt: 1, 
                                    zIndex: 1000,
                                    backgroundColor: '#121212',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(80, 80, 80, 0.5)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                                    maxHeight: '400px',
                                    overflow: 'auto'
                                }}
                            >
                                <List>
                                    {filteredResults.map((token) => (
                                        <StyledListItem key={token.id} onClick={() => handleTokenSelect(token)}>
                                            <ListItemAvatar>
                                                <Avatar src={token.image} alt={token.symbol}>
                                                    {token.symbol[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ color: '#b8b8b8', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '13px' }}>
                                                        {highlightMatch(token.symbol, searchQuery)}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography sx={{ color: '#6e6e6e', display: 'block', fontFamily: 'monospace', fontSize: '12px' }}>
                                                            {highlightMatch(token.name, searchQuery)}
                                                        </Typography>
                                                        {token.contractAddress && (
                                                            <Typography 
                                                                sx={{ 
                                                                    color: '#505050', 
                                                                    fontSize: '11px',
                                                                    fontFamily: 'monospace',
                                                                    display: 'block',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                {highlightMatch(token.contractAddress, searchQuery)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </StyledListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Box>
                    
                    <div className={styles.iconGroup}>
                        <Tooltip title="Notifications">
                            <IconButton 
                                className={styles.headerIcon} 
                                ref={notificationRef}
                                onClick={handleNotificationOpen}
                            >
                                <Badge badgeContent={unreadCount} color="primary">
                                    <NotificationsIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        
                        <Popover
                            open={isNotificationOpen}
                            anchorEl={notificationAnchorEl}
                            onClose={handleNotificationClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            PaperProps={{
                                sx: {
                                    width: 360,
                                    maxHeight: 500,
                                    bgcolor: '#121212',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(80, 80, 80, 0.5)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                                    overflow: 'hidden'
                                }
                            }}
                        >
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(80, 80, 80, 0.5)' }}>
                                <Typography sx={{ color: '#b8b8b8', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '14px' }}>
                                    Notifications
                                </Typography>
                                {unreadCount > 0 && (
                                    <Typography 
                                        onClick={markAllAsRead}
                                        sx={{ 
                                            color: '#3f51b5', 
                                            fontSize: '12px', 
                                            cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Mark all as read
                                    </Typography>
                                )}
                            </Box>
                            
                            <Box sx={{ maxHeight: 380, overflowY: 'auto', p: 0 }}>
                                {filteredNotifications.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography sx={{ color: '#6e6e6e', fontSize: '14px' }}>
                                            {notifications.length === 0 ? 
                                                'No notifications' : 
                                                'No notifications for followed entities. Follow more to see relevant updates.'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    filteredNotifications.map((notification) => (
                                        <Card 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            sx={{ 
                                                bgcolor: notification.isRead ? 'rgba(20, 20, 20, 0.8)' : 'rgba(30, 30, 30, 0.9)',
                                                borderRadius: 0,
                                                boxShadow: 'none',
                                                p: 2,
                                                cursor: 'pointer',
                                                borderBottom: '1px solid rgba(80, 80, 80, 0.2)',
                                                transition: 'background-color 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: 'rgba(40, 40, 40, 0.8)',
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {notification.image && (
                                                    <Box 
                                                        sx={{ 
                                                            width: 60, 
                                                            height: 60, 
                                                            borderRadius: '8px',
                                                            overflow: 'hidden',
                                                            flexShrink: 0,
                                                            backgroundImage: `url(${notification.image})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    />
                                                )}
                                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                    <Typography 
                                                        sx={{ 
                                                            color: notification.isRead ? '#b8b8b8' : 'white',
                                                            fontWeight: notification.isRead ? 'normal' : 'bold',
                                                            fontSize: '13px',
                                                            mb: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    <Typography 
                                                        sx={{ 
                                                            color: '#6e6e6e',
                                                            fontSize: '12px',
                                                            mb: 0.5,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            lineHeight: '1.3'
                                                        }}
                                                    >
                                                        {notification.description}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography sx={{ color: '#505050', fontSize: '11px' }}>
                                                            {notification.source}
                                                        </Typography>
                                                        <Typography sx={{ color: '#505050', fontSize: '11px' }}>
                                                            {notification.timeAgo}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Card>
                                    ))
                                )}
                            </Box>
                            
                            <Box sx={{ 
                                p: 2, 
                                borderTop: '1px solid rgba(80, 80, 80, 0.5)', 
                                textAlign: 'center',
                                backgroundColor: 'rgba(20, 20, 20, 0.8)'
                            }}>
                                <Typography 
                                    onClick={() => {
                                        navigate('/feed');
                                        handleNotificationClose();
                                    }}
                                    sx={{ 
                                        color: '#3f51b5', 
                                        fontSize: '13px', 
                                        cursor: 'pointer',
                                        padding: '4px 0',
                                        display: 'block',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    View Feed
                                </Typography>
                            </Box>
                        </Popover>
                        
                        <Tooltip title="Settings">
                            <IconButton className={styles.headerIcon}>
                                <SettingsIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Profile">
                            <IconButton className={styles.headerIcon}>
                                <AccountCircleIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </header>
    );
};