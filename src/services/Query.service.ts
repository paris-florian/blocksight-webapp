import { ColumnDefinition, ColumnDefinitionType, IData, IRecord, SortDirection } from '../components/Table/DataTable';
import { IFilterValue } from '../components/pages/TopTraders/types';

export interface SortConfig {
  fieldName: string;
  direction: SortDirection;
}

const getField = (data: IData[], fieldName: string): IData | undefined => {
  const fields = data.filter(d => d.fieldName === fieldName);
  if (fields.length === 0) {
    return undefined;
  }
  return fields[0];
};

export const query = (
  records: IRecord[], 
  filters: IFilterValue[], 
  sorting: SortConfig, 
  fields: ColumnDefinition[]
): IRecord[] => {
  return records
    .filter(r => {
      for (const filter of filters) {
        const field = getField(r.data, filter.fieldName);
        if (!field) continue; // Skip if field doesn't exist
        
        const value = field.value;

        if (filter.type === 'tags') {
          const recordTags = value as string[];
          const filterTags = filter.value as string[];
          if (filterTags.length > 0 && !recordTags.some(tag => filterTags.includes(tag))) {
            return false;
          }
          continue;
        }

        if (typeof value !== 'number') continue;
        
        if (filter.min !== undefined && value < filter.min) return false;
        if (filter.max !== undefined && value > filter.max) return false;

        const filterValue = filter.value as number;
        switch (filter.operator) {
          case '>':
            if (value <= filterValue) return false;
            break;
          case '>=':
            if (value < filterValue) return false;
            break;
          case '<':
            if (value >= filterValue) return false;
            break;
          case '<=':
            if (value > filterValue) return false;
            break;
          case '==':
            if (value !== filterValue) return false;
            break;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const fieldA = getField(a.data, sorting.fieldName);
      const fieldB = getField(b.data, sorting.fieldName);

      // If either field doesn't exist, sort to the end
      if (!fieldA) return 1;
      if (!fieldB) return -1;

      const valueA = fieldA.value;
      const valueB = fieldB.value;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sorting.direction === SortDirection.ascending ? valueA - valueB : valueB - valueA;
      }

      const strA = String(valueA);
      const strB = String(valueB);
      return sorting.direction === SortDirection.ascending ? 
        strA.localeCompare(strB) : 
        strB.localeCompare(strA);
    })
    .map(record => {
      // Keep all original data fields, including those without definitions
      const originalData = [...record.data];
      
      // Ensure all defined fields exist in the record
      const definedFields = fields.map(field => {
        const existingField = originalData.find(d => d.fieldName === field.fieldName);
        if (existingField) {
          // Remove from original data to avoid duplicates
          const index = originalData.findIndex(d => d.fieldName === field.fieldName);
          if (index !== -1) {
            originalData.splice(index, 1);
          }
          return existingField;
        }

        const defaultValue = field.type === ColumnDefinitionType.Labels ? [] as string[] : 0;
        return {
          fieldName: field.fieldName,
          id: `${record.id}-${field.fieldName}`,
          value: defaultValue
        } as IData;
      });
      
      // Return record with all fields - both defined and undefined
      return {
        ...record,
        data: [...definedFields, ...originalData]
      };
    });
}; 