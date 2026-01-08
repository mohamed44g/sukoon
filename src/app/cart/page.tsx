"use client"
import Link from 'next/link';
import { Box, Container, Typography, Grid, Button, Stack, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { getDisplayPrice } from '@/types';
import { API_URL } from '@/lib/api';

const MotionBox = motion(Box);

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 12 }}>
          <Stack alignItems="center" justifyContent="center" spacing={3} sx={{ textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.5 }} />
            <Typography variant="h4" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}>سلة التسوق فارغة</Typography>
            <Typography sx={{ color: 'text.secondary', fontFamily: '"Amiri", serif', fontSize: '1.1rem' }}>لم تقم بإضافة أي منتجات بعد</Typography>
            <Button component={Link} href='/' variant="contained" size="large" sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 50, fontFamily: '"Amiri", serif', fontSize: '1.1rem' }}>
              تصفح العطور
            </Button>
          </Stack>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}>سلة التسوق الملكية</Typography>
            <Typography sx={{ color: 'text.secondary', fontFamily: '"Amiri", serif' }}>{totalItems} منتجات</Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid size = {{xs: 12, lg: 8}} >
            <Stack spacing={2}>
              {items.map((item, index) => {
                const price = getDisplayPrice(item.selectedVariant);
                return (
                  <MotionBox
                    key={`${item.product.id}-${item.selectedVariant.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
                  >
                    <Box sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                      <Box component="img" src={`${API_URL}${item.product.images[0]}`} alt={item.product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, fontSize: '1.1rem' }}>{item.product.name}</Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{item.selectedVariant.size}</Typography>
                        </Box>
                        <IconButton onClick={() => removeFromCart(item.product.id, item.selectedVariant.size)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'primary.main' }}>
                          <IconButton size="small" onClick={() => updateQuantity(item.product.id, item.selectedVariant.size, item.quantity + 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.product.id, item.selectedVariant.size, item.quantity - 1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          {price * item.quantity} <Box component="span" sx={{ color: 'primary.main', fontSize: '0.85rem', fontFamily: '"Amiri", serif' }}>ج</Box>
                        </Typography>
                      </Stack>
                    </Box>
                  </MotionBox>
                );
              })}
            </Stack>
          </Grid>

          {/* Order Summary */}
          <Grid size = {{xs: 12, lg: 4}}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'sticky', top: 96 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                ملخص الطلب
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ color: 'text.secondary' }}>
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice} ج</span>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ color: 'text.secondary' }}>
                  <span>الشحن</span>
                  <Typography sx={{ color: 'primary.main' }}>يحدد لاحقاً</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent="space-between" sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider', fontWeight: 700, fontSize: '1.25rem' }}>
                <span>الإجمالي</span>
                <span>{totalPrice} <Box component="span" sx={{ color: 'primary.main', fontSize: '0.85rem', fontFamily: '"Amiri", serif' }}>ج</Box></span>
              </Stack>

              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckoutIcon />}
                sx={{ mt: 3, height: 56, fontSize: '1.25rem', fontFamily: '"Amiri", serif', boxShadow: '0 4px 20px rgba(212, 165, 116, 0.2)' }}
              >
                إتمام الطلب
              </Button>
              

              <Button
                component={Link}
                href="/"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<ArrowBackIcon />}
                sx={{ mt: 2, height: 48, fontFamily: '"Amiri", serif' }}
              >
                متابعة التسوق
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default CartPage;
