import {
  AppShell,
  Burger,
  Group,
  Button,
  UnstyledButton,
  Text,
  Menu,
  Avatar,
  rem,
  Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconLogout, IconUser, IconShoppingCart } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MobileShopIcon } from './MobileShopIcon';
import { Footer } from './Footer';

interface HeaderProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<HeaderProps> = ({ children }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Group h="100%">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <UnstyledButton component={Link} to="/">
                <Group gap="xs">
                  <MobileShopIcon size={28} color="var(--mantine-color-blue-6)" />
                  <Text size="xl" fw={700} c="blue">
                    MobileShop
                  </Text>
                </Group>
              </UnstyledButton>
            </Group>

            <Group h="100%" visibleFrom="sm">
              
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/checkout"
                    variant="subtle"
                    size="sm"
                    px="xs"
                    aria-label="Shopping Cart"
                  >
                    <IconShoppingCart size={20} />
                  </Button>
                  <Menu
                    width={200}
                    position="bottom-end"
                    transitionProps={{ transition: 'pop-top-right' }}
                    withinPortal
                  >
                    <Menu.Target>
                      <UnstyledButton>
                        <Group gap={7}>
                          <Avatar color="blue" radius="xl" size={30}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Text fw={500} size="sm" lh={1} mr={3}>
                            {user?.name}
                          </Text>
                          <IconChevronDown
                            style={{ width: rem(12), height: rem(12) }}
                            stroke={1.5}
                          />
                        </Group>
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                      >
                        Profile
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        onClick={handleLogout}
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </>
              ) : (
                <Group>
                  <Button
                    component={Link}
                    to="/sign-in"
                    variant="subtle"
                    size="sm"
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/sign-up"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </Group>
              )}
            </Group>

            {/* Mobile Menu */}
            <Group hiddenFrom="sm">
              {isAuthenticated ? (
                <Menu>
                  <Menu.Target>
                    <Avatar color="blue" radius="xl" size={30}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconShoppingCart style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                      component={Link}
                      to="/checkout"
                      onClick={close}
                    >
                      Cart
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group>
                  <Button component={Link} to="/sign-in" variant="subtle" size="sm" onClick={close}>
                    Sign In
                  </Button>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {!isAuthenticated && (
          <>
            <Button component={Link} to="/sign-in" variant="subtle" fullWidth onClick={close}>
              Sign In
            </Button>
            <Button component={Link} to="/sign-up" fullWidth onClick={close}>
              Sign Up
            </Button>
          </>
        )}
        {isAuthenticated && (
          <Button
            component={Link}
            to="/checkout"
            variant="subtle"
            fullWidth
            onClick={close}
            leftSection={<IconShoppingCart size={16} />}
          >
            Cart
          </Button>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          {children}
        </Container>
      </AppShell.Main>

      <Footer />
    </AppShell>
  );
};
