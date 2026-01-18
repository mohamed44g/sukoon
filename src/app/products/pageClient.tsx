"use client"
import { Box, Container, Typography, Grid, Button, Stack, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import FadeInUp from '@/components/FadeInUp';
import { productsApi } from '@/services/api';

const ProductsPageClient = ({ initialProducts }: { initialProducts: Product[] }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // لو العدد المبدئي أقل من 8، يبقى مفيش داتا تانية
  const [hasMore, setHasMore] = useState(initialProducts.length === 8);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    addToCart(product, variant, quantity);
    setSnackbar({ open: true, message: `تمت إضافة ${product.name} (${variant.size}) × ${quantity} للسلة` });
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newProducts = await productsApi.getAll(nextPage);

      if (newProducts.length > 0) {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        // لو اللي راجع أقل من 8، يبقى وصلنا للنهاية
        if (newProducts.length < 8) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more products", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      {/* ... (Quote Section كما هو) ... */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden' }}>
        <Box className="pattern-ornament" sx={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', py: 4, px: { xs: 2, md: 6 }, borderTop: '2px solid', borderBottom: '2px solid', borderColor: 'rgba(207, 115, 23, 0.2)', bgcolor: 'rgba(207, 115, 23, 0.05)', borderRadius: 4 }}>
            <Typography sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', color: 'primary.main', fontSize: '1.5rem', bgcolor: 'background.paper', px: 1 }}>۞</Typography>
            <Typography variant="h4" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, lineHeight: 2, whiteSpace: 'pre-line' }}>
              <Box component="span" sx={{ color: 'primary.main', opacity: 0.8 }}>"</Box>
              {'يقول ﷺ: حبب إلي من دنياكم النساء، والطيب، وجعلت قرة عيني في الصلاة'}
              <Box component="span" sx={{ color: 'primary.main', opacity: 0.8 }}>"</Box>
            </Typography>
            <Typography sx={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', color: 'primary.main', fontSize: '1.5rem', bgcolor: 'background.paper', px: 1 }}>۞</Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8, position: 'relative' }}>
        <Stack alignItems="center" spacing={2} sx={{ mb: 8 }}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h2" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, textAlign: 'center', pb: 3 }}>
              كل العطور
            </Typography>
            {/* Decoration lines... */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
              <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', transform: 'rotate(45deg)' }} />
              <Box sx={{ width: 250, height: 2, bgcolor: 'primary.main' }} />
              <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', transform: 'rotate(45deg)' }} />
            </Stack>
          </Box>
        </Stack>

        <Grid container spacing={4} justifyContent={'center'} alignItems={'center'}>
          {products.map((product) => (
            <Grid size={{ xs: 10, sm: 6, lg: 3 }} key={product.id}>
              <FadeInUp>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </FadeInUp>
            </Grid>
          ))}
        </Grid>

        <Stack alignItems="center" sx={{ mt: 8 }}>
          {products.length === 0 && (
            <Typography sx={{ fontWeight: 700 }}>لا يوجد منتجات لعرضها.</Typography>
          )}

          {hasMore && (
            <Button
              variant="outlined"
              size="large"
              onClick={loadMore}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <ExpandMoreIcon />}
              sx={{ px: 5, py: 1.5, borderRadius: 50, fontSize: '1.1rem', fontFamily: '"Amiri", serif' }}
            >
              {loading ? 'جاري التحميل...' : 'عرض المزيد'}
            </Button>
          )}
        </Stack>
      </Container>

      <Footer />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ bgcolor: 'primary.main', color: 'white' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsPageClient;