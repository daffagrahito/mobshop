import { SimpleGrid, Text, Center, Loader, Alert, Stack, Container } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ProductCard } from '../components/ProductCard';
import { PaginationControls } from '../components/PaginationControls';
import { HeroSection } from '../components/HeroSection';
import { ProductFilters } from '../components/ProductFilters';
import { useProductsWithFilters } from '../hooks/useProductsWithFilters';

export const HomePage = () => {
  const {
    products,
    categories,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    filters,
    limit,
    handlePageChange,
    handleFiltersChange,
    handleLimitChange,
  } = useProductsWithFilters({ limit: 12 });

  if (loading && products.length === 0) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <HeroSection />
      
      <Container size="xl" px="md" py="xl">
        <Stack gap="xl">
          {/* Product Filters */}
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            totalProducts={total}
          />

          {/* Products Grid */}
          <div>
            {products.length === 0 ? (
              <Center h="200px">
                <Text size="lg" c="dimmed">
                  No products match your filters
                </Text>
              </Center>
            ) : (
              <>
                {loading && (
                  <Center mb="md">
                    <Loader size="sm" />
                  </Center>
                )}
                
                <SimpleGrid
                  cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing="lg"
                  verticalSpacing="lg"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </SimpleGrid>

                {/* Server-side Pagination */}
                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={limit}
                    totalItems={total}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                  />
                )}
              </>
            )}
          </div>
        </Stack>
      </Container>
    </div>
  );
};
