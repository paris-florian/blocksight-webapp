import React, { ReactNode } from 'react';
import { Typography, Box, SxProps, Theme } from '@mui/material';

interface TabTitleProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * TabTitle component for consistent title styling across all tabs
 * 
 * @param {ReactNode} children - The content of the title (usually text)
 * @param {SxProps<Theme>} sx - Optional additional styles to apply
 */
export const TabTitle: React.FC<TabTitleProps> = ({ children, sx }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          color: 'white', 
          mb: 2,
          ...sx 
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default TabTitle; 