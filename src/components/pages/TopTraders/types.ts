import { ColumnDefinition, ColumnDefinitionType, ILabelOption } from '../../Table/DataTable';

export interface IFilterValue {
  fieldName: string;
  operator: FilterOperator;
  value: number | string[];
  type: 'number' | 'tags';
  min?: number;
  max?: number;
}

export enum FilterOperator {
  '>' = '>',
  '<' = '<',
  '>=' = '>=',
  '<=' = '<=',
  '==' = '==',
  'in' = 'in'
}

export interface IFilterFolder {
  id: string;
  name: string;
  labelGroup: string;
  sortIndex: number;
  fields: IFilterField[];
}

export interface IFilterField {
  id: string;
  name: string;
  sortIndex: number;
}

export interface IFilterSection {
  id: string;
  name: string;
}

export interface IFilterProps {
  open: boolean;
  onClose: () => void;
  fields: Array<{
    fieldName: string;
    name: string;
    group?: string;
    labelGroup?: string;
    filterable: boolean;
    type: ColumnDefinitionType;
    sortIndex: number;
    labelOptions?: ILabelOption[];
  }>;
  onFilterChange: (filters: IFilterValue[]) => void;
  anchorEl: HTMLElement | null;
  initialFilters?: IFilterValue[];
}

export interface IFilterState {
  openFolders: Set<string>;
  filters: IFilterValue[];
}

export interface ITraderTag {
  label: string;
  value: string;
}

export const TRADER_TAGS: ITraderTag[] = [
  { label: '🏛️ Institution', value: 'institution' },
  // { label: '🐋 Whale', value: 'whale' },
  { label: '🔄 Exchange', value: 'exchange' },
  { label: '👨‍💼 Insider', value: 'insider' },
  { label: '👨‍💻 Coin Creator', value: 'coin_creator' },
  { label: '📢 Influencer', value: 'influencer' },
]; 