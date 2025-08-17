import { Container, Title, Text, Button, Stack, Center } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <Container size="sm" py="xl">
      <Center>
        <Stack align="center" gap="lg">
          <Text size="120px" fw={900} c="blue" lh={1}>
            404
          </Text>
          
          <Title order={1} ta="center">
            Page Not Found
          </Title>
          
          <Text ta="center" c="dimmed" size="lg">
            The page you are looking for does not exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </Text>
          
          <Button
            component={Link}
            to="/"
            leftSection={<IconHome size={18} />}
            size="md"
            mt="md"
          >
            Go back to homepage
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};
