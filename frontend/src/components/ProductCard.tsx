import { useState } from 'react';
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Modal,
  Grid,
  Rating,
  NumberFormatter,
  ActionIcon,
  Divider,
  ScrollArea,
} from '@mantine/core';
import { IconShoppingCart, IconEye } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/sign-in');
    }
  };

  const formatPrice = (price: number) => {
    return price;
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock > 50) return 'green';
    if (stock > 20) return 'yellow';
    if (stock > 0) return 'orange';
    return 'red';
  };

  const getStockText = (stock: number) => {
    if (stock > 50) return 'In Stock';
    if (stock > 20) return 'Limited Stock';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
        <Card.Section>
          <Image
            src={product.thumbnail}
            height={200}
            alt={product.title}
            fit="cover"
            fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
          />
        </Card.Section>

        <Stack gap="xs" mt="md" style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start">
            <Text fw={500} size="sm" lineClamp={2} style={{ flex: 1 }}>
              {product.title}
            </Text>
            <ActionIcon
              variant="subtle"
              color="blue"
              size="sm"
              onClick={() => setModalOpened(true)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Group>

          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text size="lg" fw={700} c="blue">
                <NumberFormatter
                  value={formatPrice(product.price)}
                  prefix="$"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                />
              </Text>
              <Group gap={4}>
                <Rating value={product.rating} readOnly size="xs" />
                <Text size="xs" c="dimmed">
                  ({product.rating.toFixed(1)})
                </Text>
              </Group>
            </Stack>
            <Badge
              color={getStockBadgeColor(product.stock)}
              variant="light"
              size="sm"
            >
              {getStockText(product.stock)}
            </Badge>
          </Group>

          <Text size="xs" c="dimmed" lineClamp={2}>
            {product.description}
          </Text>

          <Button
            fullWidth
            mt="auto"
            leftSection={<IconShoppingCart size={16} />}
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            variant="filled"
            size="sm"
            radius="md"
          >
            Buy Now
          </Button>
        </Stack>
      </Card>

      {/* Product Detail Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={product.title}
        size="lg"
        centered
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack gap="md">
          {/* Image Gallery */}
          <div>
            <Image
              src={product.images?.[currentImageIndex] || product.thumbnail}
              height={300}
              fit="contain"
              alt={product.title}
              fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
              radius="md"
            />
            {product.images && product.images.length > 1 && (
              <Group gap="xs" mt="sm" justify="center">
                {product.images.map((image, index) => (
                  <ActionIcon
                    key={index}
                    variant={index === currentImageIndex ? 'filled' : 'light'}
                    size="sm"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      width={30}
                      height={30}
                      fit="cover"
                      radius="xs"
                    />
                  </ActionIcon>
                ))}
              </Group>
            )}
          </div>

          <Divider />

          {/* Product Information */}
          <Grid>
            <Grid.Col span={6}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Price</Text>
                <Text size="xl" fw={700} c="blue">
                  <NumberFormatter
                    value={formatPrice(product.price)}
                    prefix="$"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                  />
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Stock</Text>
                <Badge
                  color={getStockBadgeColor(product.stock)}
                  variant="light"
                  size="lg"
                >
                  {product.stock} units left
                </Badge>
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Rating</Text>
                <Group gap="xs">
                  <Rating value={product.rating} readOnly size="sm" />
                  <Text size="sm" fw={500}>
                    {product.rating.toFixed(1)}/5
                  </Text>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Brand</Text>
                <Text size="sm" fw={500}>
                  {product.brand || 'Generic'}
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>

          <Divider />

          {/* Description */}
          <div>
            <Text size="sm" c="dimmed" mb="xs">Description</Text>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {product.description}
            </Text>
          </div>

          {/* Category */}
          <Group>
            <Text size="sm" c="dimmed">Category:</Text>
            <Badge variant="outline" size="sm">
              {product.category}
            </Badge>
          </Group>

          <Divider />

          {/* Action Buttons */}
          <Group gap="sm">
            <Button
              flex={1}
              leftSection={<IconShoppingCart size={16} />}
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              size="md"
            >
              Buy Now
            </Button>
            <Button
              variant="light"
              onClick={() => setModalOpened(false)}
              size="md"
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
