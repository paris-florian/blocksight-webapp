import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import styles from './ViewHeader.module.css';

interface ViewHeaderProps {
  title: string;
  subtitle?: string;
  iconUrl?: string;
  onSwap?: () => void;
  showSwapButton?: boolean;
  rightContent?: React.ReactNode;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  title,
  subtitle,
  iconUrl,
  onSwap,
  showSwapButton = false,
  rightContent
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.mainContent}>
        <div className={styles.iconContainer}>
          {iconUrl && (
            <img
              src={iconUrl}
              alt={`${title} icon`}
              className={styles.icon}
            />
          )}
          {showSwapButton && (
            <IconButton 
              className={styles.swapButton}
              size="small"
              aria-label="swap"
              onClick={onSwap}
            >
              <SwapHorizIcon fontSize="small" sx={{fill: "white"}} />
            </IconButton>
          )}
        </div>
        <div className={styles.info}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>
      </div>
      
      {rightContent && (
        <div className={styles.rightContent}>
          {rightContent}
        </div>
      )}
    </header>
  );
};

export default ViewHeader; 