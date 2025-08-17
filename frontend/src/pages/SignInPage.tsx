import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  Center,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types';

export const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const form = useForm<LoginRequest>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 1 ? 'Username is required' : null),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      await login(values);
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center>
        <Stack w="100%">
          <Title ta="center" order={1}>
            Welcome back!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor size="sm" component={Link} to="/sign-up">
              Create account
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                {error && (
                  <Alert icon={<IconInfoCircle size="1rem" />} color="red">
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Username"
                  placeholder="Your username"
                  required
                  key={form.key('username')}
                  {...form.getInputProps('username')}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />

                <Button type="submit" fullWidth mt="xl" loading={loading}>
                  Sign in
                </Button>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Center>
    </Container>
  );
};
