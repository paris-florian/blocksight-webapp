import React from 'react';
import styles from './CustomTabNavigation.module.css';

interface Tab {
  id: string;
  name: string;
  element: React.ReactElement;
}

interface CustomTabNavigationProps {
  tabs: Tab[];
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const CustomTabNavigation: React.FC<CustomTabNavigationProps> = ({
  tabs,
  currentTab,
  onTabChange,
}) => {
  return (
    <nav className={styles.navTabs}>
      {tabs.map(t => (
        <button 
          key={t.id}
          onClick={() => onTabChange(t)} 
          className={`${styles.tab} ${currentTab.id === t.id ? styles.tabactive : ""}`}
        >
          {t.name}
        </button>
      ))}
    </nav>
  );
};

export default CustomTabNavigation; 