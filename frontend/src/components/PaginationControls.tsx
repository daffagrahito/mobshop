import { Group, Pagination, Text, Select } from '@mantine/core';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onLimitChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  console.log('PaginationControls props:', { currentPage, totalPages, itemsPerPage, totalItems });

  return (
    <Group justify="space-between" align="center" mt="xl">
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          Showing {startItem} to {endItem} of {totalItems} products
        </Text>
      </Group>

      <Group gap="md">
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Show:
          </Text>
          <Select
            size="xs"
            value={itemsPerPage.toString()}
            onChange={(value) => value && onLimitChange(parseInt(value))}
            data={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '30', label: '30' },
              { value: '50', label: '50' },
            ]}
            w={70}
          />
        </Group>

        {totalPages > 1 && (
          <Pagination
            value={currentPage}
            onChange={onPageChange}
            total={totalPages}
            size="sm"
            siblings={1}
            boundaries={1}
          />
        )}
      </Group>
    </Group>
  );
};
