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
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '../types';

// Enhanced form interface with password confirmation
interface SignUpFormData extends RegisterRequest {
  confirmPassword: string;
}

export const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => (value !== values.password ? 'Passwords do not match' : null),
    },
  });

  const handleSubmit = async (values: SignUpFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple data preparation
      const sanitizedData: RegisterRequest = {
        name: values.name.trim(),
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      
      await register(sanitizedData);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
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
            Create account
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{' '}
            <Anchor size="sm" component={Link} to="/sign-in">
              Sign in
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
                  label="Full Name"
                  placeholder="Your full name"
                  required
                  key={form.key('name')}
                  {...form.getInputProps('name')}
                />

                <TextInput
                  label="Username"
                  placeholder="Your username"
                  required
                  key={form.key('username')}
                  {...form.getInputProps('username')}
                />

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  required
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                  key={form.key('confirmPassword')}
                  {...form.getInputProps('confirmPassword')}
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  mt="xl" 
                  loading={loading}
                >
                  Create account
                </Button>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Center>
    </Container>
  );
};
