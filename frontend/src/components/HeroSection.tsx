import { useState, useEffect } from 'react';
import { 
  Title, 
  Text, 
  Button, 
  Group, 
  Container, 
  Box, 
  Image, 
  Stack
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 810);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleShopNow = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If products section doesn't exist yet, just scroll down
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <Box
      pos="relative"
      style={{
        background: 'linear-gradient(135deg, #1864ab 0%, #1971c2 50%, #1c7ed6 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box
        pos="absolute"
        w={300}
        h={300}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          top: '-100px',
          left: '-100px',
        }}
      />
      <Box
        pos="absolute"
        w={200}
        h={200}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          bottom: '10%',
          right: '5%',
        }}
      />

      <Container size="xl" py={{ base: 40, sm: 60, md: 80 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Conditionally render order based on mobile/desktop */}
          {isMobile ? (
            <>
              {/* Image Section - First on mobile (ABOVE text) */}
              <Box
                style={{ 
                  flex: '1 1 50%',
                  display: 'flex',
                  justifyContent: 'center',
                  transform: isVisible ? 'translateY(-5px)' : 'translateY(0px)',
                  transition: 'transform 2s ease-in-out',
                }}
                pt={{ base: 'md', md: 0 }}
              >
                {/* Circle highlight behind image */}
                <Box
                  pos="absolute"
                  style={{
                    width: isMobile ? '250px' : '400px',
                    height: isMobile ? '250px' : '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                    zIndex: 0,
                  }}
                />
                
                <Image
                  src="/featured.png"
                  alt="Featured Products"
                  fallbackSrc="https://placehold.co/600x400?text=Featured+Products"
                  style={{
                    width: '100%',
                    maxWidth: isMobile ? '400px' : '800px',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 2,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))',
                  }}
                />
              </Box>

              {/* Content Section - Second on mobile (BELOW image) */}
              <Stack
                gap="lg"
                style={{ 
                  flex: '1 1 50%',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                  paddingBottom: '2rem',
                }}
                px={{ base: 'md', md: 0 }}
                align="center"
              >
                <Title
                  order={1}
                  fw={800}
                  c="white"
                  ta="center"
                  style={{
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    lineHeight: 1.1,
                    textShadow: '0px 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Discover
                  <Text
                    component="span"
                    inherit
                    variant="gradient"
                    gradient={{ from: '#ffd700', to: '#ffed4e', deg: 45 }}
                    style={{ display: 'block' }}
                  >
                    Various Products
                  </Text>
                </Title>

                <Text
                  c="rgba(255, 255, 255, 0.9)"
                  ta="center"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  Explore our extensive marketplace featuring everything from electronics and furniture 
                  to home essentials and lifestyle products from trusted sellers worldwide.
                </Text>

                <Group gap="md" wrap="wrap" justify="center">
                  <Button
                    size="lg"
                    radius="xl"
                    leftSection={<IconShoppingCart size={20} />}
                    variant="white"
                    color="dark"
                    onClick={handleShopNow}
                    style={{
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    Shop Now
                  </Button>
                </Group>
              </Stack>
            </>
          ) : (
            <>
              {/* Desktop Layout - Content first, Image second */}
              <Stack
                gap="lg"
                style={{ 
                  flex: '1 1 50%',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                  paddingBottom: '2rem',
                }}
                px={{ base: 'md', md: 0 }}
                align="center"
              >
                <Title
                  order={1}
                  fw={800}
                  c="white"
                  ta="center"
                  style={{
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    lineHeight: 1.1,
                    textShadow: '0px 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Discover
                  <Text
                    component="span"
                    inherit
                    variant="gradient"
                    gradient={{ from: '#ffd700', to: '#ffed4e', deg: 45 }}
                    style={{ display: 'block' }}
                  >
                    Various Products
                  </Text>
                </Title>

                <Text
                  c="rgba(255, 255, 255, 0.9)"
                  ta="center"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  Explore our extensive marketplace featuring everything from electronics and furniture 
                  to home essentials and lifestyle products from trusted sellers worldwide.
                </Text>

                <Group gap="md" wrap="wrap" justify="center">
                  <Button
                    size="lg"
                    radius="xl"
                    leftSection={<IconShoppingCart size={20} />}
                    variant="white"
                    color="dark"
                    onClick={handleShopNow}
                    style={{
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    Shop Now
                  </Button>
                </Group>
              </Stack>

              <Box
                style={{ 
                  flex: '1 1 50%',
                  display: 'flex',
                  justifyContent: 'center',
                  transform: isVisible ? 'translateY(-5px)' : 'translateY(0px)',
                  transition: 'transform 2s ease-in-out',
                }}
                pt={{ base: 'md', md: 0 }}
              >
                {/* Circle highlight behind image */}
                <Box
                  pos="absolute"
                  style={{
                    width: isMobile ? '250px' : '400px',
                    height: isMobile ? '250px' : '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                    zIndex: 0,
                  }}
                />
                
                <Image
                  src="/featured.png"
                  alt="Featured Products"
                  fallbackSrc="https://placehold.co/600x400?text=Featured+Products"
                  style={{
                    width: '100%',
                    maxWidth: isMobile ? '600px' : '900px',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 2,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))',
                  }}
                />
              </Box>
            </>
          )}
        </div>
      </Container>
    </Box>
  );
};