import React from 'react';
import { Box, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  feedFilter?: 'top' | 'latest';
  onFeedFilterChange?: (filter: 'top' | 'latest') => void;
  showFeedFilter?: boolean;
  sx?: object; // Optional styling prop
  darkMode?: boolean;
}

/**
 * A reusable component for filtering content by categories and feed type
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  feedFilter = 'top',
  onFeedFilterChange,
  showFeedFilter = true,
  sx = {},
  darkMode = true,
}) => {
  // Determine styling based on darkMode
  const toggleButtonGroupStyles = darkMode 
    ? {
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        p: 0.25,
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRadius: '20px',
          px: 2,
          py: 0.75,
          color: 'white',
          textTransform: 'none',
          '&.Mui-selected': {
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          },
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      } 
    : {
        bgcolor: 'action.hover',
        borderRadius: '20px',
        p: 0.25,
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRadius: '20px',
          px: 1.5,
          py: 0.5,
          color: 'text.secondary',
          textTransform: 'none',
          '&.Mui-selected': {
            bgcolor: 'white',
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'white',
            },
          },
          '&:hover': {
            bgcolor: 'action.hover',
          },
        },
      };

  // Helper function to get bgcolor for chips
  const getChipBgColor = (category: string) => {
    if (darkMode) {
      return selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.1)';
    } else {
      return selectedCategory === category ? 'primary.main' : 'background.paper';
    }
  };

  // Helper function to get color for chips
  const getChipColor = (category: string) => {
    if (darkMode) {
      return selectedCategory === category ? 'black' : 'white';
    } else {
      return selectedCategory === category ? 'white' : 'text.primary';
    }
  };

  // Helper function to get hover bgcolor for chips
  const getChipHoverBgColor = (category: string) => {
    if (darkMode) {
      return selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.2)';
    } else {
      return selectedCategory === category ? 'primary.dark' : 'action.hover';
    }
  };

  // Helper function to get fontWeight for chips
  const getChipFontWeight = (category: string) => {
    return selectedCategory === category ? 600 : 400;
  };

  // Helper function to get border for chips (only used in light mode)
  const getChipBorder = (category: string) => {
    if (!darkMode) {
      return selectedCategory === category ? 'none' : '1px solid rgba(0, 0, 0, 0.1)';
    }
    return undefined;
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        ...sx
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          overflowX: 'auto', 
          pb: 1,
          flexGrow: 1
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => onCategoryChange(category)}
            sx={{
              bgcolor: getChipBgColor(category),
              color: getChipColor(category),
              '&:hover': {
                bgcolor: getChipHoverBgColor(category),
              },
              fontWeight: getChipFontWeight(category),
              border: getChipBorder(category),
            }}
          />
        ))}
      </Box>

      {showFeedFilter && onFeedFilterChange && (
        <ToggleButtonGroup
          value={feedFilter}
          exclusive
          onChange={(_, newValue) => newValue && onFeedFilterChange(newValue as 'top' | 'latest')}
          size="small"
          sx={toggleButtonGroupStyles}
        >
          <ToggleButton value="top">Top</ToggleButton>
          <ToggleButton value="latest">Latest</ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  );
};

export default CategoryFilter; 