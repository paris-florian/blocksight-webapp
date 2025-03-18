import { useState } from "react";
import { query, SortConfig } from "../../../../../services/Query.service";
import { ColumnDefinition, ColumnDefinitionType, DataTable, IRecord, SortDirection } from "../../../../Table/DataTable"
import { IFilterValue } from "../../../TopTraders/types";
import { useNavigate } from "react-router";
import { FilterControls } from "../../../TopTraders/FilterControls";
import { Box, Typography } from "@mui/material";
import styles from "./InstitutionsTab.module.css";
import { traderRecords } from "../../../../../data/data";

const fields: ColumnDefinition[] = [
    { 
      fieldName: "name", 
      name: "Name", 
      sortable: false, 
      filterable: false, 
      type: ColumnDefinitionType.NameWithAvatar, 
      sortIndex: 0,
      imageFieldName: "image" 
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
        { label: '🔄 Exchange', value: 'exchange' },
        { label: '👨‍💼 Insider', value: 'insider' },
        { label: '👨‍💻 Coin Creator', value: 'coin_creator' },
        { label: '📢 Influencer', value: 'influencer' },
      ]
    },
  ];
  

export const InstitutionsTab = () => {
   const [filterValues, setFilterValues] = useState<IFilterValue[]>([
     // Default filter for institution tag - using the correct value from the labelOptions
     {
       fieldName: "tags",
       operator: "in" as any,
       value: ["institution"], // Use simple value for filtering
       type: "tags"
     }
   ]);
    const [sortField, setSortField] = useState<SortConfig>({ 
      fieldName: 'winrate-total', 
      direction: SortDirection.descending 
    });
    const navigate = useNavigate();
  
    const handleFilterChange = (newFilters: IFilterValue[]) => {
      setFilterValues(newFilters);
    };
  
    const getActiveFilterCount = () => {
      return filterValues.length;
    };
  
    const handleRowClick = (recordId: string) => {
      navigate(`/entities/${recordId}`);
    };
  
    const filteredAndSortedRecords = query(traderRecords, filterValues, sortField, fields);
  
    return (
      <div className={styles.container}>
        <Box sx={{ mb: 3, position: 'relative' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
            Institutions
          </Typography>
  
          <FilterControls
            onFilterChange={handleFilterChange}
            fields={fields}
            activeFilterCount={getActiveFilterCount()}
            initialFilters={filterValues}
          />
        </Box>
  
        <DataTable 
          handleSort={(name, direction) => { setSortField({fieldName: name, direction}) }} 
          columnDefinitionsArray={fields} 
          records={filteredAndSortedRecords} 
          onRowClick={handleRowClick}
        />
  
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
          <Typography variant="caption">
            Showing {filteredAndSortedRecords.length} of {traderRecords.length} traders
          </Typography>
        </Box>
      </div>
    );
}