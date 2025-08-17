import { Container, Group, Text, Stack, Divider, Anchor, SimpleGrid, Box } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

export const Footer = () => {
  return (
    <Box bg="gray.9" mt="auto">
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          {/* Company Info */}
          <Stack gap="md">
            <Text fw={700} size="lg" c="white">
              MobileShop
            </Text>
            <Text size="sm" c="gray.4">
              Your trusted destination for the latest mobile phones and accessories. 
              Discover premium quality products at unbeatable prices.
            </Text>
            <Group gap="xs">
              <IconMapPin size={16} color="var(--mantine-color-gray-4)" />
              <Text size="xs" c="gray.4">
                Jakarta, Indonesia
              </Text>
            </Group>
          </Stack>

          {/* Quick Links */}
          <Stack gap="md">
            <Text fw={600} c="white">
              Quick Links
            </Text>
            <Stack gap="xs">
              <Anchor size="sm" c="gray.4" underline="never">
                Home
              </Anchor>
              <Anchor size="sm" c="gray.4" underline="never">
                About Us
              </Anchor>
              <Anchor size="sm" c="gray.4" underline="never">
                Products
              </Anchor>
              <Anchor size="sm" c="gray.4" underline="never">
                Contact
              </Anchor>
            </Stack>
          </Stack>

          {/* Customer Service */}
          <Stack gap="md">
            <Text fw={600} c="white">
              Customer Service
            </Text>
            <Stack gap="xs">
              <Anchor size="sm" c="gray.4" underline="never">
                Help Center
              </Anchor>
              <Anchor size="sm" c="gray.4" underline="never">
                Shipping Info
              </Anchor>
              <Anchor size="sm" c="gray.4" underline="never">
                Returns & Exchanges
              </Anchor>
              <Anchor size="sm" c="gray.4" underline="never">
                Size Guide
              </Anchor>
            </Stack>
          </Stack>

          {/* Contact Info */}
          <Stack gap="md">
            <Text fw={600} c="white">
              Contact Us
            </Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconPhone size={16} color="var(--mantine-color-gray-4)" />
                <Text size="sm" c="gray.4">
                  +62 21 1234 5678
                </Text>
              </Group>
              <Group gap="xs">
                <IconMail size={16} color="var(--mantine-color-gray-4)" />
                <Text size="sm" c="gray.4">
                  support@mobileshop.com
                </Text>
              </Group>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Divider my="lg" color="gray.8" />

        {/* Copyright */}
        <Group justify="space-between" align="center">
          <Text size="xs" c="gray.5">
            © 2025 MobileShop. All rights reserved.
          </Text>
        </Group>
      </Container>
    </Box>
  );
};
