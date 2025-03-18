import React, { useState, useEffect } from 'react';
import { Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { isEntityFollowed, toggleFollow } from '../../services/FollowService';

interface FollowButtonProps {
    id: string;
    name: string;
    symbol?: string;
    image?: string;
    type: 'currency' | 'trader';
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
    className?: string;
}

// Styled Chip component with confetti animation
const StyledFollowChip = styled(Chip)(({ theme }) => ({
    borderRadius: '16px',
    transition: 'all 0.15s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '0 4px',
    position: 'relative',
    overflow: 'visible',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'scale(1.03)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
        transform: 'scale(0.97)',
    },
    '&.followed': {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
        color: '#FFD700',
        '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.08)',
        },
    },
    '&::before, &::after': {
        position: 'absolute',
        content: '""',
        display: 'none',
        width: '140%',
        height: '100%',
        left: '-20%',
        zIndex: -1000,
        transition: 'all ease-in-out 0.5s',
        backgroundRepeat: 'no-repeat',
    },
    // Default white bubbles for unfollowing
    '&::before': {
        top: '-75%',
        backgroundImage: `
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, transparent 20%, rgba(255, 255, 255, 0.8) 20%, transparent 30%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, transparent 10%, rgba(255, 255, 255, 0.8) 15%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%)
        `,
        backgroundSize: '10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%',
    },
    '&::after': {
        bottom: '-75%',
        backgroundImage: `
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, transparent 10%, rgba(255, 255, 255, 0.8) 15%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 20%, transparent 20%)
        `,
        backgroundSize: '15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%',
    },
    // Gold bubbles for following
    '&.followed::before': {
        backgroundImage: `
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, transparent 20%, #FFD700 20%, transparent 30%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, transparent 10%, #FFD700 15%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%)
        `,
    },
    '&.followed::after': {
        backgroundImage: `
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, transparent 10%, #FFD700 15%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%),
            radial-gradient(circle, #FFD700 20%, transparent 20%)
        `,
    },
    '&.animate::before': {
        display: 'block',
        animation: 'topBubbles ease-in-out 0.75s forwards',
    },
    '&.animate::after': {
        display: 'block',
        animation: 'bottomBubbles ease-in-out 0.75s forwards',
    },
    '@keyframes topBubbles': {
        '0%': {
            backgroundPosition: '5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%',
        },
        '50%': {
            backgroundPosition: '0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%',
        },
        '100%': {
            backgroundPosition: '0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%',
            backgroundSize: '0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%',
        },
    },
    '@keyframes bottomBubbles': {
        '0%': {
            backgroundPosition: '10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%',
        },
        '50%': {
            backgroundPosition: '0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%',
        },
        '100%': {
            backgroundPosition: '0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%',
            backgroundSize: '0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%',
        },
    },
}));

export const FollowButton: React.FC<FollowButtonProps> = ({ 
    id, 
    name, 
    symbol, 
    image, 
    type, 
    size = 'medium', 
    showText = true,
    className
}) => {
    // State to track if entity is followed
    const [isFollowed, setIsFollowed] = useState(false);
    // State for animation
    const [isAnimating, setIsAnimating] = useState(false);
    // Track previous follow state for animation color
    const [wasFollowed, setWasFollowed] = useState(false);
    // Reference to button element
    const buttonRef = React.useRef<HTMLDivElement>(null);
    
    // Check initial follow status
    useEffect(() => {
        const followStatus = isEntityFollowed(id, type);
        setIsFollowed(followStatus);
        setWasFollowed(followStatus);
    }, [id, type]);

    // Handle follow/unfollow click
    const handleToggleFollow = (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent event propagation
        event.stopPropagation();
        
        // Store previous state for animation
        setWasFollowed(isFollowed);
        
        // Toggle follow status
        const newFollowState = toggleFollow({
            id,
            name,
            symbol,
            image,
            type
        });
        
        setIsFollowed(newFollowState);
        
        // Animate button
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, 700);
    };

    // Determine CSS classes based on state
    const getButtonClasses = () => {
        const classes = [];
        
        // Current follow state determines styling
        if (isFollowed) {
            classes.push('followed');
        }
        
        // Animation state
        if (isAnimating) {
            classes.push('animate');
        }
        
        // Add custom class if provided
        if (className) {
            classes.push(className);
        }
        
        return classes.join(' ');
    };

    return (
        <div ref={buttonRef} style={{ position: 'relative', display: 'inline-block' }}>
            <StyledFollowChip
                className={getButtonClasses()}
                onClick={handleToggleFollow}
                variant="outlined"
                label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isFollowed ? 
                            <StarIcon 
                                fontSize={size} 
                                sx={{ 
                                    color: '#FFD700', 
                                    marginRight: showText ? 0.5 : 0 
                                }} 
                            /> : 
                            <StarOutlineIcon 
                                fontSize={size} 
                                sx={{ 
                                    marginRight: showText ? 0.5 : 0 
                                }} 
                            />
                        }
                        {showText && (
                            <Typography 
                                variant="body2" 
                                component="span" 
                                sx={{ 
                                    fontWeight: 500, 
                                    fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '0.95rem' : '0.85rem'
                                }}
                            >
                                {isFollowed ? 'Following' : 'Follow'}
                            </Typography>
                        )}
                    </div>
                }
                size={size === 'small' ? 'small' : 'medium'}
                sx={{
                    height: size === 'small' ? 28 : size === 'large' ? 38 : 32,
                    '& .MuiChip-label': {
                        padding: size === 'small' ? '0 8px' : '0 12px',
                    }
                }}
            />
        </div>
    );
}; 