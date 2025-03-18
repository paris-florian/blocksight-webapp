import React from 'react';
import { Box, Button, Chip, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FilterModal from './FilterModal';
import { IFilterValue } from './types';
import { ColumnDefinition } from '../../Table/DataTable';

interface FilterControlsProps {
  onFilterChange: (filters: IFilterValue[]) => void;
  fields: ColumnDefinition[];
  activeFilterCount: number;
  initialFilters?: IFilterValue[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  onFilterChange,
  fields,
  activeFilterCount,
  initialFilters = [],
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{
            bgcolor: activeFilterCount > 0 ? '#2A2A2A' : '#1E1E1E',
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            px: 2,
            '&.Mui-disabled': {
              bgcolor: '#1E1E1E',
              color: 'rgba(255, 255, 255, 0.3)'
            },
            gap: "6px",
            height: 40,
            fontSize: '0.9rem',
            fontWeight: 500,
            '& .MuiButton-startIcon': {
              margin: 0
            }
          }}
        >
          Filters
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              sx={{
                bgcolor: '#3A3A3A',
                color: 'white',
                height: 20,
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '0.75rem'
                }
              }}
            />
          )}
        </Button>

        <FilterModal
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
          fields={fields}
          onFilterChange={onFilterChange}
          anchorEl={anchorEl}
          initialFilters={initialFilters}
        />

        <Tooltip 
          title="Coming Soon" 
          placement="top"
          sx={{
            bgcolor: '#2A2A2A',
            color: 'white',
            fontSize: '0.75rem',
            py: 0.5,
            px: 1,
            borderRadius: '4px'
          }}
        >
          <span>
            <Button
              variant="contained"
              startIcon={<ViewWeekIcon />}
              disabled
              sx={{
                bgcolor: '#1E1E1E',
                color: 'rgba(255, 255, 255, 0.3)',
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                '&.Mui-disabled': {
                  bgcolor: '#1E1E1E',
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                gap: "6px",
                height: 40,
                fontSize: '0.9rem',
                fontWeight: 500,
                '& .MuiButton-startIcon': {
                  margin: 0
                }
              }}
            >
              Columns
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}; 