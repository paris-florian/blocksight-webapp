import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface TabContentProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const contentStyle: SxProps<Theme> = {
  py: 3,
};

export const TabContent: React.FC<TabContentProps> = ({ children, sx }) => {
  return (
    <Box sx={{ ...contentStyle, ...sx }}>
      {children}
    </Box>
  );
};

export default TabContent; 