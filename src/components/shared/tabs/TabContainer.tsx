import React, { useState, useEffect } from 'react';
import { Box, Card, SxProps, Theme } from '@mui/material';
import TabNavigation from '../TabNavigation';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  sx?: SxProps<Theme>;
  onTabChange?: (tabId: string) => void;
}

const containerStyle: SxProps<Theme> = {
  bgcolor: 'white',
  borderRadius: '12px',
  p: 2,
  boxShadow: 'none',
};

export const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  defaultTab,
  sx,
  onTabChange
}) => {
  // Initialize current tab based on URL hash or default to first tab
  const [currentTab, setCurrentTab] = useState<Tab>(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    return tabs.find(t => t.id === hash) || tabs.find(t => t.id === defaultTab) || tabs[0];
  });

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = currentTab.id;
  }, [currentTab]);

  // Listen for hash changes and update the current tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const tab = tabs.find(t => t.id === hash);
      if (tab) {
        setCurrentTab(tab);
        onTabChange?.(tab.id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [tabs, onTabChange]);

  const handleTabChange = (index: number) => {
    const newTab = tabs[index];
    setCurrentTab(newTab);
    onTabChange?.(newTab.id);
  };

  return (
    <Card sx={{ ...containerStyle, ...sx }}>
      <TabNavigation
        tabs={tabs.map(tab => tab.label)}
        selectedTab={tabs.findIndex(tab => tab.id === currentTab.id)}
        onTabChange={handleTabChange}
      />
      <Box>
        {currentTab.content}
      </Box>
    </Card>
  );
};

export default TabContainer; 