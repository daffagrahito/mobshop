import { Container, Title, Text, Paper, Center, Stack, Button } from '@mantine/core';
import { IconShoppingCart, IconTool } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const CheckoutPage = () => {
  return (
    <Container size="sm" py="xl">
      <Center>
        <Paper withBorder shadow="md" p="xl" radius="md" w="100%" maw={500}>
          <Stack align="center" gap="lg">
            <IconTool size={64} color="var(--mantine-color-blue-6)" />
            
            <Title order={1} ta="center">
              Checkout
            </Title>
            
            <Text size="xl" ta="center" c="dimmed">
              Coming soon
            </Text>
            
            <Text ta="center" c="dimmed">
              We're working hard to bring you an amazing checkout experience. 
              Stay tuned for updates!
            </Text>
            
            <Button
              component={Link}
              to="/"
              leftSection={<IconShoppingCart size={18} />}
              size="md"
              mt="md"
            >
              Continue Shopping
            </Button>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
};
