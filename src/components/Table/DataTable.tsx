import { Box, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import styles from './DataTable.module.css';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TRADER_TAGS } from '../pages/TopTraders/types';

interface NameWithAvatar {
  name: string;
  img: string;
}

export interface ILabelOption {
  label: string;
  value: string;
}

export interface IData {
  id: string;
  fieldName: string;
  value: string | number | string[] | NameWithAvatar;
}

export enum SortDirection {
  ascending = "asc",
  descending = "desc",
}

export interface IRecord {
  id: string;
  data: IData[];
}

export enum ColumnDefinitionType {
    Text, 
    RedGreenText,
    Labels,
    Currency,
    Percentage,
    NameWithAvatar
}

interface Dictionary<T> {
    [Key: string]: T;
}

export interface ColumnDefinition {
  sortIndex: number;
  fieldName: string;
  sortable: boolean;
  filterable: boolean;
  name: string;
  type: ColumnDefinitionType;
  group?: string;
  labelGroup?: string;
  labelOptions?: ILabelOption[];
  imageFieldName?: string;
}

const SortIcon: React.FC<{ direction: SortDirection, active: boolean }> = ({ direction, active }) => (
    active ? (
      <ArrowDropDownIcon 
        sx={{ 
          fontSize: '1rem',
          transform: direction === SortDirection.ascending ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease',
          verticalAlign: 'middle',
          mr: 0.1,
          color: 'inherit'
        }} 
      />
    ) : null
  );

const formatValue = (value: string | number | string[] | NameWithAvatar, type: ColumnDefinitionType): string => {
  if (typeof value === 'number') {
    switch (type) {
      case ColumnDefinitionType.Percentage:
        return `${value.toFixed(2)}%`;
      case ColumnDefinitionType.Currency:
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      default:
        return value.toString();
    }
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object' && 'name' in value) {
    return value.name;
  }
  return value.toString();
};

// Helper function to map tag value to label (with emoji)
const getTagLabel = (tagValue: string): string => {
  const tag = TRADER_TAGS.find(t => t.value === tagValue);
  return tag ? tag.label : tagValue;
};

const renderCell = (data: IData, type: ColumnDefinitionType, align: 'left' | 'right', record: IRecord, columnDefinition: ColumnDefinition) => {
  const value = data.value;
  
  switch (type) {
    case ColumnDefinitionType.NameWithAvatar:
      let nameValue: string;
      let imgSrc: string;
      
      if (typeof value === 'object' && 'name' in value && 'img' in value) {
        const nameWithAvatar = value as NameWithAvatar;
        nameValue = nameWithAvatar.name;
        imgSrc = nameWithAvatar.img;
      } else {
        nameValue = value as string;
        imgSrc = '';
        
        if (columnDefinition.imageFieldName) {
          const imageField = record.data.find(d => d.fieldName === columnDefinition.imageFieldName);
          if (imageField && typeof imageField.value === 'string') {
            imgSrc = imageField.value;
          }
        }
      }
      
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={imgSrc}
            alt={nameValue}
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              mr: 1,
              objectFit: 'cover',
            }}
          />
          <span>{nameValue}</span>
        </Box>
      );
    
    case ColumnDefinitionType.RedGreenText:
      const numValue = Number(value);
      return (
        <span style={{ color: numValue >= 0 ? '#4CAF50' : '#F44336' }}>
          {numValue >= 0 ? '+' : ''}{formatValue(value, type)}
        </span>
      );
    
    case ColumnDefinitionType.Percentage:
      const percentValue = Number(value);
      return (
        <span style={{ color: percentValue >= 0 ? '#4CAF50' : '#F44336' }}>
          {percentValue >= 0 ? '+' : ''}{formatValue(value, type)}
        </span>
      );
    
    case ColumnDefinitionType.Labels:
      const labels = value as string[];
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
          {labels.map((tagValue, index) => (
            <Chip
              key={index}
              label={getTagLabel(tagValue)}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontSize: '0.75rem',
                height: '24px',
              }}
            />
          ))}
        </Box>
      );
    
    default:
      return formatValue(value, type);
  }
};

export function DataTable(props: {
  columnDefinitionsArray: ColumnDefinition[]; 
  records: IRecord[], 
  handleSort: (fieldName: string, direction: SortDirection) => void,
  onRowClick?: (recordId: string) => void
}) {
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.descending);
    const [sortField, setSortField] = useState<string>('winRate1m');

    const columnDefinitions: Dictionary<ColumnDefinition> = {};
    props.columnDefinitionsArray.forEach(element => {
        columnDefinitions[element.fieldName] = element;
    });

    const handleSort = (fieldName: string) => {
        if (sortField === fieldName) {
            const newSortDirection = sortDirection === SortDirection.ascending ? SortDirection.descending : SortDirection.ascending;
            props.handleSort(fieldName, newSortDirection);
            setSortDirection(newSortDirection);
        } else {
            props.handleSort(fieldName, SortDirection.descending);
            setSortField(fieldName);
            setSortDirection(SortDirection.descending);
        }
    };

    return (<TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell 
            key={"index"}
            sx={{ 
              color: '#8B8B8B', 
              fontWeight: 500,
              fontSize: '0.875rem', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'left',
              py: 1.5,
            }} 
            className={styles.tableHeaderCell}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-start', flexDirection: 'row'}}>
              #
            </Box>
          </TableCell>
            
          {props.columnDefinitionsArray.map((field, index) => (
            <TableCell 
              key={index}
              sx={{ 
                color: '#8B8B8B', 
                fontWeight: 500,
                fontSize: '0.875rem', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: index <= 0 ? 'left' : 'right',
                py: 1.5,
              }} 
              onClick={() => field.sortable && handleSort(field.fieldName)}
              className={`${styles.tableHeaderCell} ${field.sortable ? styles.sortable : ''}`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: index <= 0 ? 'flex-start' : 'flex-end', flexDirection: 'row' }}>
                {field.sortable && (
                  <SortIcon 
                    direction={sortDirection} 
                    active={sortField === field.fieldName} 
                  />
                )}
                {field.name}
              </Box>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.records.map((record, rowIndex) => {
          // Filter record data to only include fields that have a definition
          const definedFields = record.data.filter(data => columnDefinitions[data.fieldName]);
          
          return (
            <TableRow 
              key={record.id} 
              hover
              onClick={() => props.onRowClick && props.onRowClick(record.id)}
              sx={{ 
                '&:last-child td': { 
                  borderBottom: 'none' 
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  cursor: props.onRowClick ? 'pointer' : 'default'
                },
                transition: 'background-color 0.2s ease'
              }}
            >
              <TableCell 
                key="index"
                sx={{ 
                  color: "white",
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                  textAlign: 'left',
                  py: 1.5,
                }} 
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton size="small" sx={{ color: '#8B8B8B', p: 0, mr: 1 }}>
                    <StarBorderIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  {rowIndex + 1}
                </Box>
              </TableCell>
              {props.columnDefinitionsArray.map((column, colIndex) => {
                const data = definedFields.find(d => d.fieldName === column.fieldName);
                
                if (!data) {
                  // If no data found for this column, render an empty cell
                  return (
                    <TableCell 
                      key={`${record.id}-${column.fieldName}`}
                      sx={{ 
                        color: "white",
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                        textAlign: colIndex <= 0 ? 'left' : 'right',
                        py: 1.5,
                      }} 
                    >
                      -
                    </TableCell>
                  );
                }
                
                return (
                  <TableCell 
                    key={data.id}
                    sx={{ 
                      color: "white",
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
                      textAlign: colIndex <= 0 ? 'left' : 'right',
                      py: 1.5,
                    }} 
                  >
                    {renderCell(data, column.type, colIndex <= 0 ? 'left' : 'right', record, column)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>);
}