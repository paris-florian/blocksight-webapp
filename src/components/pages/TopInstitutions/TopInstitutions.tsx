import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import styles from './TopInstitutionsView.module.css';
import { ColumnDefinition, ColumnDefinitionType, DataTable, IRecord, SortDirection } from '../../Table/DataTable';
import { IFilterValue } from '../TopTraders/types';
import { query, SortConfig } from '../../../services/Query.service';
import { FilterControls } from '../TopTraders/FilterControls';

const fields: ColumnDefinition[] = [
  { 
    fieldName: "name", 
    name: "Name", 
    sortable: false, 
    filterable: false, 
    type: ColumnDefinitionType.NameWithAvatar, 
    sortIndex: 0 
  },
  { 
    fieldName: "average-trade-return-percentage", 
    name: "Avg. Trade ROI", 
    filterable: true, 
    sortable: true, 
    type: ColumnDefinitionType.Percentage, 
    group: "ROI", 
    labelGroup: "Performance", 
    sortIndex: 1 
  },
  { 
    fieldName: "winrate-total", 
    name: "Winrate", 
    filterable: true, 
    sortable: true, 
    type: ColumnDefinitionType.Percentage, 
    group: "Winrate", 
    labelGroup: "Performance", 
    sortIndex: 2 
  },
  { 
    fieldName: "drawdown", 
    name: "Drawdown", 
    filterable: true, 
    sortable: true, 
    type: ColumnDefinitionType.Percentage, 
    group: "Drawdown", 
    labelGroup: "Risk", 
    sortIndex: 3 
  },
  { 
    fieldName: "tags", 
    name: "Tags", 
    sortable: false, 
    filterable: true, 
    type: ColumnDefinitionType.Labels, 
    labelGroup: "Tags", 
    sortIndex: 4,
    labelOptions: [
      { label: '🏛️ Institution', value: 'institution' },
      // { label: '🐋 Whale', value: 'whale' },
      { label: '🔄 Exchange', value: 'high_roi' },
      { label: '👨‍💼 Insider', value: 'high_winrate' },
      { label: '👨‍💻 Coin Creator', value: 'top_performer' },
      { label: '📢 Influencer', value: 'active_trader' },
    ]
  },
];

const records: IRecord[] = [
  {
    id: "1", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 59 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
  {
    id: "2", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 60 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
  {
    id: "3", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 60 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
  {
    id: "4", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 60 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
  {
    id: "5", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 60 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
  {
    id: "6", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 60 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
  {
    id: "7", 
    data: [
      { fieldName: "name", id: "1", value: { name: "Trump", img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" } },
      { fieldName: "average-trade-return-percentage", id: "2", value: 21 },
      { fieldName: "winrate-total", id: "3", value: 60 },
      { fieldName: "drawdown", id: "4", value: 11 },
      { fieldName: "tags", id: "5", value: ["🏛️ Institution", "👨‍💼 Insider"] },
    ]
  },
];

const TopInstitutionsView = () => {
  const [filterValues, setFilterValues] = useState<IFilterValue[]>([]);
  const [sortField, setSortField] = useState<SortConfig>({ 
    fieldName: 'winrate-total', 
    direction: SortDirection.descending 
  });

  const handleFilterChange = (newFilters: IFilterValue[]) => {
    setFilterValues(newFilters);
  };

  const getActiveFilterCount = () => {
    return filterValues.length;
  };

  const filteredAndSortedRecords = query(records, filterValues, sortField, fields);

  return (
    <div className={styles.container}>
      <Box sx={{ mb: 3, position: 'relative' }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          Top Institutions
        </Typography>

        <FilterControls
          onFilterChange={handleFilterChange}
          fields={fields}
          activeFilterCount={getActiveFilterCount()}
        />
      </Box>

      <DataTable 
        handleSort={(name, direction) => { setSortField({fieldName: name, direction}) }} 
        columnDefinitionsArray={fields} 
        records={filteredAndSortedRecords} 
      />

      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
        <Typography variant="caption">
          Showing {filteredAndSortedRecords.length} of {records.length} traders
        </Typography>
      </Box>
    </div>
  );
};

export default TopInstitutionsView; 