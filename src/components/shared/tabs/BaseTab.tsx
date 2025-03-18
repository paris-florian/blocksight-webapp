import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import TabContent from './TabContent';

interface BaseTabProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onMount?: () => void;
  onUnmount?: () => void;
}

const baseStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const BaseTab: React.FC<BaseTabProps> = ({
  children,
  sx,
  onMount,
  onUnmount
}) => {
  React.useEffect(() => {
    onMount?.();
    return () => onUnmount?.();
  }, [onMount, onUnmount]);

  return (
    <TabContent sx={{ ...baseStyle, ...sx }}>
      {children}
    </TabContent>
  );
};

export default BaseTab; 