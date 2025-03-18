import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Modal, IconButton, Stack, TextField, FormControlLabel, Checkbox, InputAdornment, Paper, Autocomplete, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IFilterProps, IFilterState, IFilterFolder, FilterOperator, IFilterValue, TRADER_TAGS, ITraderTag } from './types';
import { ColumnDefinitionType } from '../../Table/DataTable';

interface FilterFoldersResult {
  folders: Record<string, IFilterFolder>;
  rootFields: Array<{ id: string; name: string; labelGroup?: string; sortIndex: number; }>;
}

const validateSortIndices = (fields: IFilterProps['fields']) => {
  // Group fields by labelGroup
  const groupedFields = fields.reduce((acc, field) => {
    const group = field.labelGroup || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(field);
    return acc;
  }, {} as Record<string, typeof fields>);

  // Validate each group
  Object.entries(groupedFields).forEach(([group, fields]) => {
    const sortedFields = [...fields].sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0));
    
    // Check for duplicate sortIndex values
    const sortIndices = fields.map(f => f.sortIndex || 0);
    const uniqueSortIndices = new Set(sortIndices);
    if (uniqueSortIndices.size !== sortIndices.length) {
      throw new Error(`Duplicate sortIndex values found in group "${group}"`);
    }

    // Check for gaps in sortIndex sequence
    const min = Math.min(...sortIndices);
    const max = Math.max(...sortIndices);
    const expectedLength = max - min + 1;
    if (sortIndices.length !== expectedLength) {
      throw new Error(`Non-sequential sortIndex values found in group "${group}"`);
    }
  });
};

const createFilterFolders = (fields: IFilterProps['fields']): FilterFoldersResult => {
  // Validate sort indices before processing
  validateSortIndices(fields);

  return fields
    .filter(metric => metric.filterable)
    .sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0))
    .reduce<FilterFoldersResult>((acc, metric) => {
      // Handle root-level fields (no group)
      if (!metric.group) {
        return {
          ...acc,
          rootFields: [
            ...acc.rootFields,
            {
              id: metric.fieldName,
              name: metric.name,
              labelGroup: metric.labelGroup,
              sortIndex: metric.sortIndex || 0
            }
          ]
        };
      }

      // Handle grouped fields
      const key = `${metric.labelGroup}_${metric.group}`;
      const existingFolder = acc.folders[key];
      const updatedFields = existingFolder?.fields || [];

      return {
        ...acc,
        folders: {
          ...acc.folders,
          [key]: {
            id: key,
            name: metric.group,
            labelGroup: metric.labelGroup || 'Other',
            sortIndex: metric.sortIndex || 0,
            fields: [
              ...updatedFields,
              {
                id: metric.fieldName,
                name: metric.name,
                sortIndex: metric.sortIndex || 0
              }
            ].sort((a, b) => a.sortIndex - b.sortIndex)
          }
        }
      };
    }, { folders: {}, rootFields: [] });
};

const groupFoldersByLabelGroup = (folders: Record<string, IFilterFolder>): Record<string, IFilterFolder[]> => {
  const groups = Object.values(folders).reduce((groups, folder) => {
    if (!groups[folder.labelGroup]) {
      groups[folder.labelGroup] = [];
    }
    groups[folder.labelGroup].push(folder);
    // Sort folders within each label group
    groups[folder.labelGroup].sort((a, b) => a.sortIndex - b.sortIndex);
    return groups;
  }, {} as Record<string, IFilterFolder[]>);

  // Sort the groups themselves based on the minimum sortIndex in each group
  const sortedGroups: Record<string, IFilterFolder[]> = {};
  Object.entries(groups)
    .sort(([, a], [, b]) => {
      const aMinSort = Math.min(...a.map(f => f.sortIndex));
      const bMinSort = Math.min(...b.map(f => f.sortIndex));
      return aMinSort - bMinSort;
    })
    .forEach(([key, value]) => {
      sortedGroups[key] = value;
    });

  return sortedGroups;
};

const groupFieldsByLabelGroup = (rootFields: Array<{ id: string; name: string; labelGroup?: string; sortIndex: number; }>): Record<string, Array<{ id: string; name: string; sortIndex: number; }>> => {
  const groups = rootFields.reduce((groups, field) => {
    const labelGroup = field.labelGroup || 'Other';
    if (!groups[labelGroup]) {
      groups[labelGroup] = [];
    }
    groups[labelGroup].push({ id: field.id, name: field.name, sortIndex: field.sortIndex });
    // Sort fields within each label group
    groups[labelGroup].sort((a, b) => a.sortIndex - b.sortIndex);
    return groups;
  }, {} as Record<string, Array<{ id: string; name: string; sortIndex: number; }>>);

  // Sort the groups themselves based on the minimum sortIndex in each group
  const sortedGroups: Record<string, Array<{ id: string; name: string; sortIndex: number; }>> = {};
  Object.entries(groups)
    .sort(([, a], [, b]) => {
      const aMinSort = Math.min(...a.map(f => f.sortIndex));
      const bMinSort = Math.min(...b.map(f => f.sortIndex));
      return aMinSort - bMinSort;
    })
    .forEach(([key, value]) => {
      sortedGroups[key] = value;
    });

  return sortedGroups;
};

const FilterModal: React.FC<IFilterProps> = ({ open, onClose, fields, onFilterChange, anchorEl, initialFilters = [] }) => {
  const [state, setState] = useState<IFilterState>({
    openFolders: new Set(),
    filters: []
  });
  const scrollableRef = useRef<HTMLDivElement>(null);
  const { folders, rootFields } = createFilterFolders(fields);
  const groupedFolders = groupFoldersByLabelGroup(folders);
  const groupedRootFields = groupFieldsByLabelGroup(rootFields);

  // Find the tags field from the column definitions
  const tagsField = fields.find(field => field.type === ColumnDefinitionType.Labels);
  
  // Get the current filters from parent component
  useEffect(() => {
    if (open) {
      // When modal opens, use the initialFilters if provided
      setState(prev => ({
        ...prev,
        filters: initialFilters.length > 0 ? initialFilters : prev.filters
      }));
    }
  }, [open, initialFilters]);

  const toggleFolder = (folderId: string) => {
    setState(prev => {
      const newOpenFolders = new Set(prev.openFolders);
      if (newOpenFolders.has(folderId)) {
        newOpenFolders.delete(folderId);
      } else {
        newOpenFolders.add(folderId);
      }
      return { ...prev, openFolders: newOpenFolders };
    });
  };

  const handleFilterChange = (fieldId: string, type: 'number' | 'tags', updates: { operator?: FilterOperator; value?: number | string[]; min?: number; max?: number }) => {
    setState(prev => {
      const newFilters = [...prev.filters];
      const existingFilterIndex = newFilters.findIndex(f => f.fieldName === fieldId);
      
      if (existingFilterIndex >= 0) {
        newFilters[existingFilterIndex] = { 
          ...newFilters[existingFilterIndex],
          ...updates
        };
      } else {
        newFilters.push({ 
          fieldName: fieldId, 
          operator: updates.operator || FilterOperator['>='],
          value: updates.value || (type === 'tags' ? [] : 0),
          type,
          min: updates.min,
          max: updates.max
        });
      }
      
      onFilterChange(newFilters);
      return { ...prev, filters: newFilters };
    });
  };

  const renderFilterFolder = (folder: IFilterFolder) => {
    const isOpen = state.openFolders.has(folder.id);
    
    return (
      <Box key={folder.id} sx={{ bgcolor: 'transparent' }}>
        <Box 
          onClick={() => toggleFolder(folder.id)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            height: '48px',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            color: isOpen ? 'white' : '#8B8B8B',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white'
            }
          }}
        >
          <KeyboardArrowRightIcon 
            sx={{
              fill: "currentColor",
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease-in-out',
              fontSize: '20px',
              mr: 1
            }}
          />
          <Typography sx={{ 
            fontSize: '0.875rem', 
            fontWeight: 500,
            userSelect: 'none'
          }}>
            {folder.name}
          </Typography>
        </Box>
        <Box sx={{ 
          maxHeight: isOpen ? '1000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          pt: isOpen ? 1 : 0,
          pb: isOpen ? 1 : 0
        }}>
          <Stack spacing={1}>
            {folder.fields.map(field => {
              const fieldDef = fields.find(f => f.fieldName === field.id);
              const filter = state.filters.find(f => f.fieldName === field.id);
              const isEnabled = Boolean(filter);
              const isLabelsType = fieldDef?.type === ColumnDefinitionType.Labels;

              return (
                <Box key={field.id}>
                  <Box
                    onClick={() => {
                      if (!isEnabled) {
                        handleFilterChange(field.id, isLabelsType ? 'tags' : 'number', { 
                          operator: isLabelsType ? FilterOperator.in : FilterOperator['>='],
                          value: isLabelsType ? [] : 0
                        });
                      } else {
                        setState(prev => ({
                          ...prev,
                          filters: prev.filters.filter(f => f.fieldName !== field.id)
                        }));
                        onFilterChange(state.filters.filter(f => f.fieldName !== field.id));
                      }
                    }}
                    sx={{
                      display: 'flex', 
                      alignItems: 'center',
                      height: '48px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease-in-out',
                      color: isEnabled ? 'white' : '#8B8B8B',
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        '& .filter-checkbox': {
                          opacity: 1
                        }
                      },
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    <Box
                      className="filter-checkbox"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 1,
                        position: 'absolute',
                        left: 1,
                        height: '100%'
                      }}
                    >
                      <Checkbox 
                        checked={isEnabled}
                        sx={{
                          p: 0.5,
                          color: 'inherit',
                          '&.Mui-checked': {
                            color: 'inherit'
                          }
                        }}
                      />
                    </Box>
                    <Typography sx={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 500,
                      pl: 4
                    }}>
                      {field.name}
                    </Typography>
                  </Box>
                  {isEnabled && (
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1.5, 
                      mt: 1.5, 
                      width: '100%',
                      bgcolor: 'transparent'
                    }}>
                      {isLabelsType ? (
                        <Autocomplete
                          multiple
                          fullWidth
                          options={TRADER_TAGS}
                          value={TRADER_TAGS.filter(tag => {
                            const tagFilter = state.filters.find(f => f.fieldName === field.id);
                            return tagFilter && Array.isArray(tagFilter.value) && tagFilter.value.includes(tag.value);
                          })}
                          onChange={(_, newValue) => {
                            handleFilterChange(field.id, 'tags', {
                              operator: FilterOperator.in,
                              value: newValue.map(tag => tag.value)
                            });
                          }}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select tags..."
                              size="small"
                              sx={{
                                bgcolor: 'transparent',
                                '& .MuiOutlinedInput-root': {
                                  color: 'white',
                                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                                  borderRadius: '8px',
                                  '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2196F3',
                                    borderWidth: '2px'
                                  },
                                  '& .MuiAutocomplete-endAdornment': {
                                    color: '#8B8B8B'
                                  },
                                  '& .MuiAutocomplete-clearIndicator': {
                                    color: '#8B8B8B',
                                    '&:hover': {
                                      color: 'white'
                                    }
                                  },
                                  '& input::placeholder': {
                                    color: '#8B8B8B',
                                    opacity: 1
                                  },
                                  '& .MuiChip-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                                    color: 'white',
                                    '& .MuiChip-deleteIcon': {
                                      color: '#8B8B8B',
                                      '&:hover': {
                                        color: 'white'
                                      }
                                    }
                                  }
                                }
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              {...props}
                              sx={{
                                color: 'white',
                                padding: '8px 16px',
                                '&.MuiAutocomplete-option': {
                                  bgcolor: 'transparent',
                                  '&:hover': {
                                    bgcolor: 'rgba(33, 150, 243, 0.08)'
                                  },
                                  '&[aria-selected="true"]': {
                                    bgcolor: 'rgba(33, 150, 243, 0.15)',
                                    '&:hover': {
                                      bgcolor: 'rgba(33, 150, 243, 0.2)'
                                    }
                                  }
                                }
                              }}
                            >
                              {option.label}
                            </Box>
                          )}
                          componentsProps={{
                            paper: {
                              sx: {
                                bgcolor: '#1E1E1E',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                '& .MuiAutocomplete-listbox': {
                                  bgcolor: 'transparent',
                                  padding: '8px 0',
                                  '& .MuiAutocomplete-option': {
                                    minHeight: '36px'
                                  }
                                }
                              }
                            },
                            popper: {
                              sx: {
                                '& .MuiPaper-root': {
                                  bgcolor: '#1E1E1E',
                                  color: 'white'
                                }
                              }
                            }
                          }}
                        />
                      ) : (
                        <>
                          <TextField
                            size="small"
                            type="number"
                            placeholder="Min"
                            value={filter?.min ?? ''}
                            onChange={(e) => handleFilterChange(field.id, 'number', { 
                              min: Number(e.target.value),
                              operator: FilterOperator['>='],
                              value: Number(e.target.value)
                            })}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography sx={{ color: 'white' }}>
                                    %
                                  </Typography>
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              width: '100%',
                              bgcolor: 'transparent',
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '8px',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2196F3',
                                  borderWidth: '2px'
                                }
                              },
                              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                display: 'none'
                              }
                            }}
                          />
                          <TextField
                            size="small"
                            type="number"
                            placeholder="Max"
                            value={filter?.max ?? ''}
                            onChange={(e) => handleFilterChange(field.id, 'number', { 
                              max: Number(e.target.value),
                              operator: FilterOperator['<='],
                              value: Number(e.target.value)
                            })}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography sx={{ color: 'white' }}>
                                    %
                                  </Typography>
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              width: '100%',
                              bgcolor: 'transparent',
                              borderRadius: '8px',
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '8px',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2196F3',
                                  borderWidth: '2px'
                                }
                              },
                              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                display: 'none'
                              }
                            }}
                          />
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    );
  };

  const renderRootField = (field: { id: string; name: string }) => {
    const fieldDef = fields.find(f => f.fieldName === field.id);
    const filter = state.filters.find(f => f.fieldName === field.id);
    const isEnabled = Boolean(filter);
    const isLabelsType = fieldDef?.type === ColumnDefinitionType.Labels;

    return (
      <Box key={field.id}>
        <Box
          onClick={() => {
            if (!isEnabled) {
              handleFilterChange(field.id, isLabelsType ? 'tags' : 'number', { 
                operator: isLabelsType ? FilterOperator.in : FilterOperator['>='],
                value: isLabelsType ? [] : 0
              });
            } else {
              setState(prev => ({
                ...prev,
                filters: prev.filters.filter(f => f.fieldName !== field.id)
              }));
              onFilterChange(state.filters.filter(f => f.fieldName !== field.id));
            }
          }}
          sx={{
            display: 'flex', 
            alignItems: 'center',
            height: '48px',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            color: isEnabled ? 'white' : '#8B8B8B',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              '& .filter-checkbox': {
                opacity: 1
              }
            },
            position: 'relative',
            width: '100%'
          }}
        >
          <Box
            className="filter-checkbox"
            sx={{
              display: 'flex',
              alignItems: 'center',
              opacity: 1,
              position: 'absolute',
              left: 1,
              height: '100%'
            }}
          >
            <Checkbox 
              checked={isEnabled}
              sx={{
                p: 0.5,
                color: 'inherit',
                '&.Mui-checked': {
                  color: 'inherit'
                }
              }}
            />
          </Box>
          <Typography sx={{ 
            fontSize: '0.875rem', 
            fontWeight: 500,
            pl: 4
          }}>
            {field.name}
          </Typography>
        </Box>
        {isEnabled && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            mt: 1.5, 
            width: '100%',
            bgcolor: 'transparent'
          }}>
            {isLabelsType ? (
              <Autocomplete
                multiple
                fullWidth
                options={TRADER_TAGS}
                value={TRADER_TAGS.filter(tag => {
                  const tagFilter = state.filters.find(f => f.fieldName === field.id);
                  return tagFilter && Array.isArray(tagFilter.value) && tagFilter.value.includes(tag.value);
                })}
                onChange={(_, newValue) => {
                  handleFilterChange(field.id, 'tags', {
                    operator: FilterOperator.in,
                    value: newValue.map(tag => tag.value)
                  });
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select tags..."
                    size="small"
                    sx={{
                      bgcolor: 'transparent',
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196F3',
                          borderWidth: '2px'
                        },
                        '& .MuiAutocomplete-endAdornment': {
                          color: '#8B8B8B'
                        },
                        '& .MuiAutocomplete-clearIndicator': {
                          color: '#8B8B8B',
                          '&:hover': {
                            color: 'white'
                          }
                        },
                        '& input::placeholder': {
                          color: '#8B8B8B',
                          opacity: 1
                        },
                        '& .MuiChip-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.06)',
                          color: 'white',
                          '& .MuiChip-deleteIcon': {
                            color: '#8B8B8B',
                            '&:hover': {
                              color: 'white'
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      color: 'white',
                      padding: '8px 16px',
                      '&.MuiAutocomplete-option': {
                        bgcolor: 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(33, 150, 243, 0.08)'
                        },
                        '&[aria-selected="true"]': {
                          bgcolor: 'rgba(33, 150, 243, 0.15)',
                          '&:hover': {
                            bgcolor: 'rgba(33, 150, 243, 0.2)'
                          }
                        }
                      }
                    }}
                  >
                    {option.label}
                  </Box>
                )}
                componentsProps={{
                  paper: {
                    sx: {
                      bgcolor: '#1E1E1E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '& .MuiAutocomplete-listbox': {
                        bgcolor: 'transparent',
                        padding: '8px 0',
                        '& .MuiAutocomplete-option': {
                          minHeight: '36px'
                        }
                      }
                    }
                  },
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        bgcolor: '#1E1E1E',
                        color: 'white'
                      }
                    }
                  }
                }}
              />
            ) : (
              <>
                <TextField
                  size="small"
                  type="number"
                  placeholder="Min"
                  value={filter?.min ?? ''}
                  onChange={(e) => handleFilterChange(field.id, 'number', { 
                    min: Number(e.target.value),
                    operator: FilterOperator['>='],
                    value: Number(e.target.value)
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ color: 'white' }}>
                          %
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    width: '100%',
                    bgcolor: 'transparent',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2196F3',
                        borderWidth: '2px'
                      }
                    },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      display: 'none'
                    }
                  }}
                />
                <TextField
                  size="small"
                  type="number"
                  placeholder="Max"
                  value={filter?.max ?? ''}
                  onChange={(e) => handleFilterChange(field.id, 'number', { 
                    max: Number(e.target.value),
                    operator: FilterOperator['<='],
                    value: Number(e.target.value)
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ color: 'white' }}>
                          %
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    width: '100%',
                    bgcolor: 'transparent',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2196F3',
                        borderWidth: '2px'
                      }
                    },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      display: 'none'
                    }
                  }}
                />
              </>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)'
          }
        }
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '480px',
          maxHeight: '80vh',
          bgcolor: '#1E1E1E',
          boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          outline: 'none',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          position: 'sticky', 
          top: 0, 
          bgcolor: '#1E1E1E', 
          zIndex: 1, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                Filters
              </Typography>
              <IconButton 
                size="small" 
                onClick={onClose}
                sx={{ 
                  color: '#8B8B8B',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          ref={scrollableRef}
          sx={{
            overflowY: 'auto',
            flex: 1,
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack spacing={4}>
              {/* Render fields by label groups */}
              {Object.entries({
                ...groupedRootFields,
                ...groupedFolders
              })
                .sort(([, a], [, b]) => {
                  const aMinSort = Math.min(...(Array.isArray(a) && a[0] && !('fields' in a[0]) 
                    ? a.map(f => f.sortIndex)
                    : (a as IFilterFolder[]).map(f => f.sortIndex)
                  ));
                  const bMinSort = Math.min(...(Array.isArray(b) && b[0] && !('fields' in b[0])
                    ? b.map(f => f.sortIndex)
                    : (b as IFilterFolder[]).map(f => f.sortIndex)
                  ));
                  return aMinSort - bMinSort;
                })
                .map(([labelGroup, items]) => (
                <Box key={labelGroup}>
                  <Typography 
                    sx={{ 
                      color: '#8B8B8B', 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      mb: 2, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}
                  >
                    {labelGroup}
                  </Typography>
                  <Stack spacing={1}>
                    {/* Render root fields for this label group */}
                    {Array.isArray(items) && items[0] && !('fields' in items[0]) ? (
                      items.map(renderRootField)
                    ) : (
                      (items as IFilterFolder[]).map(renderFilterFolder)
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal; 