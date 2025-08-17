import { 
  Group, 
  Select, 
  TextInput, 
  NumberInput,
  ActionIcon, 
  Badge, 
  Button, 
  Stack, 
  Paper,
  Modal,
  Title,
  Grid,
  Text,
  Divider
} from '@mantine/core';
import { IconSearch, IconX, IconSortAscending, IconSortDescending, IconAdjustments } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';

export interface FilterState {
  search: string;
  category: string;
  sortBy: 'title' | 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  priceMin: number | '';
  priceMax: number | '';
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  totalProducts: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  totalProducts,
}) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [localFilters, setLocalFilters] = useState({
    category: filters.category,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({
          ...filters,
          search: searchInput,
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters, onFiltersChange]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setLocalFilters({
      category: filters.category,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
    });
  }, [filters.category, filters.sortBy, filters.sortOrder, filters.priceMin, filters.priceMax]);

  const applyFilters = () => {
    onFiltersChange({
      ...filters,
      category: localFilters.category,
      sortBy: localFilters.sortBy,
      sortOrder: localFilters.sortOrder,
      priceMin: localFilters.priceMin,
      priceMax: localFilters.priceMax,
    });
    setModalOpened(false);
  };

  const updateLocalFilter = (key: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const updateMultipleFilters = (updates: Partial<FilterState>) => {
    setLocalFilters(prev => ({
      ...prev,
      ...updates,
    }));
    
    onFiltersChange({
      ...filters,
      ...updates,
    });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      category: '',
      sortBy: 'title',
      sortOrder: 'asc',
      priceMin: '',
      priceMax: '',
    };
    
    onFiltersChange(clearedFilters);
    setLocalFilters({
      category: '',
      sortBy: 'title',
      sortOrder: 'asc',
      priceMin: '',
      priceMax: '',
    });
  };

  const activeFiltersCount = [
    filters.category,
    (filters.priceMin !== '' || filters.priceMax !== '') ? 'price' : '',
    filters.sortBy !== 'title' ? filters.sortBy : '',
    filters.sortOrder !== 'asc' ? filters.sortOrder : '',
  ].filter(Boolean).length;

  const hasPendingChanges = 
    localFilters.category !== filters.category ||
    localFilters.sortBy !== filters.sortBy ||
    localFilters.sortOrder !== filters.sortOrder ||
    localFilters.priceMin !== filters.priceMin ||
    localFilters.priceMax !== filters.priceMax;

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ 
      value: cat, 
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
    })),
  ];

  const sortOptions = [
    { value: 'title', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <>
      <Paper withBorder p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Stack gap="md">
          {/* Search and Advanced Filters Button */}
          <Group gap="md" align="flex-end">
            <TextInput
              placeholder="Search products..."
              leftSection={<IconSearch size={16} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ flex: 1, minWidth: '200px' }}
              rightSection={
                searchInput && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setSearchInput('')}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                )
              }
            />

            <Button
              variant="light"
              leftSection={<IconAdjustments size={16} />}
              onClick={() => setModalOpened(true)}
              color={activeFiltersCount > 0 ? 'blue' : 'gray'}
            >
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge size="xs" color="red" ml="xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="subtle" color="red" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </Group>

          {/* Results count and active filter tags */}
          <Group justify="space-between">
            <Badge variant="light" size="lg" color="blue">
              {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
            </Badge>
            
            {/* Active filter tags */}
            {(filters.search || activeFiltersCount > 0) && (
              <Group gap="xs">
                {filters.search && (
                  <Badge
                    variant="filled"
                    color="blue"
                    rightSection={
                      <ActionIcon 
                        size="xs" 
                        color="currentColor" 
                        variant="transparent" 
                        onClick={() => {
                          updateFilter('search', '');
                          setSearchInput('');
                        }}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    "{filters.search}"
                  </Badge>
                )}
                {filters.category && (
                  <Badge
                    variant="filled"
                    color="green"
                    rightSection={
                      <ActionIcon size="xs" color="currentColor" variant="transparent" onClick={() => updateFilter('category', '')}>
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {categoryOptions.find(opt => opt.value === filters.category)?.label}
                  </Badge>
                )}
                {(filters.priceMin !== '' || filters.priceMax !== '') && (
                  <Badge
                    variant="filled"
                    color="orange"
                    rightSection={
                      <ActionIcon 
                        size="xs" 
                        color="currentColor" 
                        variant="transparent" 
                        onClick={() => {
                          updateMultipleFilters({
                            priceMin: '',
                            priceMax: '',
                          });
                        }}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {filters.priceMin !== '' && filters.priceMax !== '' 
                      ? `$${filters.priceMin} - $${filters.priceMax}`
                      : filters.priceMin !== ''
                      ? `From $${filters.priceMin}`
                      : `Up to $${filters.priceMax}`
                    }
                  </Badge>
                )}
                {(filters.sortBy !== 'title' || filters.sortOrder !== 'asc') && (
                  <Badge
                    variant="filled"
                    color="purple"
                    rightSection={
                      <ActionIcon 
                        size="xs" 
                        color="currentColor" 
                        variant="transparent" 
                        onClick={() => {
                          updateMultipleFilters({
                            sortBy: 'title',
                            sortOrder: 'asc',
                          });
                        }}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {sortOptions.find(opt => opt.value === filters.sortBy)?.label} ({filters.sortOrder.toUpperCase()})
                  </Badge>
                )}
              </Group>
            )}
          </Group>
        </Stack>
      </Paper>

      {/* Advanced Filters Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="sm">
            <IconAdjustments size={24} />
            <Title order={3}>Advanced Filters</Title>
          </Group>
        }
        size="lg"
        centered
      >
        <Stack gap="xl">
          {/* Categories Section */}
          <div>
            <Text fw={600} size="sm" mb="xs" color="gray.7">
              Category
            </Text>
            <Select
              placeholder="Select a category"
              data={categoryOptions}
              value={localFilters.category}
              onChange={(value) => updateLocalFilter('category', value || '')}
              clearable
              searchable
              style={{ width: '100%' }}
            />
          </div>

          <Divider />

          {/* Price Range Section */}
          <div>
            <Text fw={600} size="sm" mb="xs" color="gray.7">
              Price Range
            </Text>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <NumberInput
                  placeholder="Min price"
                  value={localFilters.priceMin}
                  onChange={(value) => updateLocalFilter('priceMin', value === '' ? '' : Number(value) || '')}
                  min={0}
                  max={999999}
                  step={1}
                  prefix="$"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={false}
                  thousandSeparator=","
                  hideControls={false}
                  error={
                    localFilters.priceMin !== '' && localFilters.priceMax !== '' && 
                    Number(localFilters.priceMin) > Number(localFilters.priceMax) 
                      ? 'Min cannot exceed max' 
                      : undefined
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  placeholder="Max price"
                  value={localFilters.priceMax}
                  onChange={(value) => updateLocalFilter('priceMax', value === '' ? '' : Number(value) || '')}
                  min={0}
                  max={999999}
                  step={1}
                  prefix="$"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={false}
                  thousandSeparator=","
                  hideControls={false}
                  error={
                    localFilters.priceMin !== '' && localFilters.priceMax !== '' && 
                    Number(localFilters.priceMax) < Number(localFilters.priceMin) 
                      ? 'Max cannot be less than min' 
                      : undefined
                  }
                />
              </Grid.Col>
            </Grid>
          </div>

          <Divider />

          {/* Sorting Section */}
          <div>
            <Text fw={600} size="sm" mb="xs" color="gray.7">
              Sort Products
            </Text>
            <Grid gutter="md">
              <Grid.Col span={8}>
                <Select
                  placeholder="Sort by"
                  data={sortOptions}
                  value={localFilters.sortBy}
                  onChange={(value) => updateLocalFilter('sortBy', value || 'title')}
                  style={{ width: '100%' }}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Button
                  variant={localFilters.sortOrder === 'asc' ? 'filled' : 'light'}
                  leftSection={
                    localFilters.sortOrder === 'asc' ? (
                      <IconSortAscending size={16} />
                    ) : (
                      <IconSortDescending size={16} />
                    )
                  }
                  onClick={() => updateLocalFilter('sortOrder', localFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  fullWidth
                  size="sm"
                >
                  {isMobile 
                    ? (localFilters.sortOrder === 'asc' ? 'Asc' : 'Desc')
                    : (localFilters.sortOrder === 'asc' ? 'Ascending' : 'Descending')
                  }
                </Button>
              </Grid.Col>
            </Grid>
          </div>

          {/* Modal Actions */}
          <Group justify="space-between" mt="lg">
            <Button variant="subtle" color="red" onClick={clearFilters}>
              Clear All Filters
            </Button>
            <Button 
              onClick={applyFilters}
              color={hasPendingChanges ? 'blue' : 'gray'}
              variant={hasPendingChanges ? 'filled' : 'light'}
            >
              Apply Filters
              {hasPendingChanges && ' *'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
