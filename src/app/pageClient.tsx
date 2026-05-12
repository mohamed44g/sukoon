"use client"
import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import FadeInUp from '@/components/FadeInUp';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import OffersSection from '@/components/OffersSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import QuoteBanner from '@/components/QuoteBanner';
import type { Product, Category, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';

const PageClient = ({products, categories, offers} : {products : Product[], categories: Category[], offers : Product[]}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    addToCart(product, variant, quantity);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6, position: 'relative' }}>
        {/* Background Glow Effects */}
        <Box sx={{ position: 'absolute', top: 160, left: 0, width: 256, height: 256, bgcolor: 'rgba(207, 115, 23, 0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 160, right: 0, width: 384, height: 384, bgcolor: 'rgba(207, 115, 23, 0.05)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

        {/* Categories Section */}
        <Box component="section" sx={{ position: 'relative', zIndex: 10 }}>
          <FadeInUp>
            <Stack alignItems="center" spacing={2} sx={{ mb: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Amiri", serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', verticalAlign: 'middle', px: 2, mt: '-10px', display: 'inline-block' }}>❖</Box>
                الأقــســام
                <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', verticalAlign: 'middle', px: 2, mt: '-10px', display: 'inline-block' }}>❖</Box>
              </Typography>
              
              <Typography
                sx={{
                  color: 'rgba(200, 173, 147, 0.8)',
                  fontFamily: '"Amiri", serif',
                  fontSize: '1.1rem',
                  maxWidth: 700,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  lineHeight: 2,
                }}
              >
                " لسنا في عجلة. العطر هنا لا يلاحقك، بل ينتظرك… حتى تكون مستعدًا أن تشعر، لا أن تشم "
              </Typography>
            </Stack>
          </FadeInUp>

          <Grid container spacing={3} mt={7}>
            {categories.map((category, index) => (
              <Grid size={{xs: 6, sm: 6, md: 3}} key={category.id}>
                <FadeInUp delay={index * 0.1}>
                  <CategoryCard category={category}/>
                </FadeInUp>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Offers Section */}
        <OffersSection offers={offers}/>

        {/* Products Section */}
        <Box component="section" sx={{ mt: 20, position: 'relative', zIndex: 10 }}>
          <FadeInUp>
            <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Amiri", serif',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textAlign: 'center',
                  position: 'relative',
                  color: 'white',
                }}
              >
                <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', verticalAlign: 'middle', px: 2, mt: '-10px', display: 'inline-block' }}>❖</Box>
                أحدث المـنـتـجـات
                <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', verticalAlign: 'middle', px: 2, mt: '-10px', display: 'inline-block' }}>❖</Box>
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(200, 173, 147, 0.8)',
                  fontFamily: '"Amiri", serif',
                  fontSize: '1.1rem',
                  maxWidth: 700,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  lineHeight: 2
                }}
              >
                " في كل نفَس حكاية، وفي كل أثر بقايا ذاكرة. نصنع العطر ليُقيم فيك، لا ليمرّ بك مرور العابرين "
              </Typography>
            </Stack>
          </FadeInUp>

          <Grid container spacing={{xs: 1, sm: 4}} mt={7} justifyContent={'center'}>
            {products.map((product, index) => (
              <Grid size={{xs: 6, sm: 6, md: 3}} key={product.id}>
                <FadeInUp delay={0.1 + (index * 0.05)}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </FadeInUp>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Quote Banner */}
      <QuoteBanner />

      {/* Testimonials Section */}
      <Container maxWidth="xl" sx={{mt: 20}}>
        <TestimonialsSection />
      </Container>

      <Footer />
    </Box>
  );
};

export default PageClient;