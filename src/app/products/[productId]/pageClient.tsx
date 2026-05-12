"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Grid, Stack, Breadcrumbs, Snackbar, Alert } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import ProductCard from '@/components/ProductCard';
import type { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useParams, useRouter } from 'next/navigation'; // 👈 1. استيراد useRouter



const ProductPageClient = ({product, related} : {product : Product, related : any}) => {
  const { id } = useParams();
  const router = useRouter(); // 👈 2. تعريف router
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleAddToCart = (variant: ProductVariant, quantity: number) => {
    addToCart(product, variant, quantity);
    setSnackbar({ open: true, message: `تمت إضافة ${product.name} (${variant.size}) × ${quantity} للسلة` });
  };

  // 👇 3. دالة الشراء المباشر
  const handleBuyNow = (variant: ProductVariant, quantity: number) => {
    // الخيار 1: إضافة المنتج للسلة الحالية ثم الذهاب للدفع
    addToCart(product, variant, quantity);
    // توجيه مباشر لصفحة الدفع
    router.push('/checkout');
    
    // ملاحظة: إذا كنت تريد أن يكون "شراء الآن" يفرغ السلة أولاً ويضع هذا المنتج فقط،
    // يمكنك استخدام clearCart() قبل addToCart()، لكن السلوك الشائع هو الإضافة.
  };

  const handleRelatedAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    addToCart(product, variant, quantity);
    setSnackbar({ open: true, message: `تمت إضافة ${product.name} (${variant.size}) × ${quantity} للسلة` });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Box component="main" sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Glow effects */}
        <Box sx={{ position: 'absolute', top: 80, left: 0, width: 384, height: 384, bgcolor: 'rgba(207, 115, 23, 0.05)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: 160, right: 0, width: 500, height: 500, bgcolor: 'rgba(207, 115, 23, 0.05)', borderRadius: '50%', filter: 'blur(150px)', pointerEvents: 'none' }} />

        {/* Breadcrumb */}
        <Container maxWidth="xl" sx={{ py: 3, position: 'relative', zIndex: 10 }}>
          <Breadcrumbs separator={<NavigateBeforeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />} sx={{ fontFamily: '"Amiri", serif', fontSize: '0.9rem', color: 'text.secondary' }}>
            <Typography component={Link} href="/" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>الرئيسية</Typography>
            <Typography sx={{ color: 'primary.main' }}>{product.name}</Typography>
          </Breadcrumbs>
        </Container>

        {/* Product Detail */}
        {/* 👇 4. تمرير handleBuyNow */}
        <ProductDetail product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />

        {/* ... (باقي الكود كما هو) ... */}
        {/* Divider */}
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 8, opacity: 0.4 }}>
          <Box sx={{ height: 1, width: 96, background: 'linear-gradient(to left, transparent, #cf7317)' }} />
          <Typography className="animate-float" sx={{ color: 'primary.main', fontSize: '2rem', px: 3 }}>۞</Typography>
          <Box sx={{ height: 1, width: 96, background: 'linear-gradient(to right, transparent, #cf7317)' }} />
        </Stack>

        {/* Related Products */}
        <Container maxWidth="xl" sx={{ py: 10, position: 'relative' }}>
          <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, position: 'relative' }}>
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', position: 'absolute', right: -32, top: 4 }}>❖</Box>
              قد يعجبك أيضاً
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', position: 'absolute', left: -32, top: 4 }}>❖</Box>
            </Typography>
            <Box sx={{ width: 96, height: 4, bgcolor: 'rgba(207, 115, 23, 0.2)', borderRadius: 2 }} />
          </Stack>
          <Grid container spacing={4} justifyContent={'center'}>
            {related.map((product : any) => (
              <Grid size = {{xs: 9, sm: 6, lg: 3}}key={product.id}>
                <ProductCard product={product} onAddToCart={handleRelatedAddToCart} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductPageClient;