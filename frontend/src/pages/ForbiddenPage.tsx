import { Container, Title, Text, Button, Stack, Center } from '@mantine/core';
import { IconLock, IconLogin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const ForbiddenPage = () => {
  return (
    <Container size="sm" py="xl">
      <Center>
        <Stack align="center" gap="lg">
          <IconLock size={80} color="var(--mantine-color-red-6)" />
          
          <Text size="80px" fw={900} c="red" lh={1}>
            403
          </Text>
          
          <Title order={1} ta="center">
            Forbidden Access
          </Title>
          
          <Text ta="center" c="dimmed" size="lg">
            You don't have permission to access this page. 
            Please sign in to continue.
          </Text>
          
          <Stack gap="sm" align="center">
            <Button
              component={Link}
              to="/sign-in"
              leftSection={<IconLogin size={18} />}
              size="md"
            >
              Sign In
            </Button>
            
            <Button
              component={Link}
              to="/"
              variant="subtle"
              size="md"
            >
              Go back to homepage
            </Button>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
};
