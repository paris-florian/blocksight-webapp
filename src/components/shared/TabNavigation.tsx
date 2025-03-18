import React from 'react';
import { Box, Tab, Tabs, SxProps, Theme } from '@mui/material';

interface TabNavigationProps {
  tabs: string[];
  selectedTab: number;
  onTabChange: (index: number) => void;
  sx?: SxProps<Theme>;
}

const tabsContainerStyle: SxProps<Theme> = {
  minHeight: 'auto',
  '& .MuiTabs-flexContainer': { gap: 1 },
};

const tabStyle: SxProps<Theme> = {
  textTransform: 'none',
  minWidth: 'auto',
  px: 2,
  py: 0.75,
  borderRadius: '20px',
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  sx
}) => (
  <Box sx={{ mb: 2, ...sx }}>
    <Tabs
      value={selectedTab}
      onChange={(_, newValue: number) => onTabChange(newValue)}
      sx={tabsContainerStyle}
      TabIndicatorProps={{ sx: { display: 'none' } }}
    >
      {tabs.map((label, index) => (
        <Tab
          key={label}
          label={label}
          sx={{
            ...tabStyle,
            color: selectedTab === index ? 'text.primary' : 'text.secondary',
            bgcolor: selectedTab === index ? 'action.selected' : 'transparent',
          }}
        />
      ))}
    </Tabs>
  </Box>
);

export default TabNavigation; 