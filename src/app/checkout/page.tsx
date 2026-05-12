"use client"
import { useState, useMemo, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Stack, TextField, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { getDisplayPrice } from '@/types';
import { egyptGovernorates, getShippingCost } from '@/data/egyptGovernorates';
import { ordersApi } from '@/services/api';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

const MotionBox = motion.create(Box);

const CheckoutPage = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // 👇 1. إضافة حالة النجاح
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    governorate: '',
    addressDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = useMemo(() => getShippingCost(formData.governorate), [formData.governorate]);
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    // 👇 فقط إذا لم يكن هناك نجاح سابق والسلة فارغة نقوم بالتحويل
    if (items.length === 0 && !isSuccess) {
      router.replace('/cart');
    }
  }, [items, router, isSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.governorate || !formData.addressDetails) {
      showSnackbar('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    if (items.length === 0) {
      showSnackbar('سلة التسوق فارغة', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.phone,
        customerAddress: `${formData.governorate} - ${formData.addressDetails}`,
        shippingCost: formData.governorate,
        items: items.map((item) => ({
          productId: item.product.id,
          size: item.selectedVariant.size,
          quantity: item.quantity,
        })),
      };

      await ordersApi.create(orderData);

      clearCart();
      // 👇 2. بدلاً من التوجيه، نعرض رسالة النجاح
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // الصعود لأعلى الصفحة

    } catch (error) {
      console.error(error);
      showSnackbar('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 3. تصميم صفحة النجاح (داخل نفس المكون)
  if (isSuccess) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 20, textAlign: 'center' }}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              bgcolor: 'background.paper',
              p: 6,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'primary.main',
              boxShadow: '0 0 40px rgba(207, 115, 23, 0.1)'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
            <Typography variant="h3" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, mb: 2, color: 'text.primary' }}>
              تم استلام طلبك بنجاح!
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              شكراً لثقتك بنا، {formData.customerName}.<br />
              سيتم التواصل معك من خلال الرقم المسجل ({formData.phone}) <br />
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>في خلال يومين</Box> لتأكيد الطلب والشحن.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/')}
              sx={{
                fontFamily: '"Amiri", serif',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              العودة للرئيسية
            </Button>
          </MotionBox>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 6 }}>
          <ShoppingCartCheckoutIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}>إتمام الطلب</Typography>
            <Typography sx={{ color: 'text.secondary', fontFamily: '"Amiri", serif' }}>أكمل بياناتك لإتمام الطلب</Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          {/* Checkout Form */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <PersonIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}>بيانات العميل</Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="الاسم الكامل" name="customerName" value={formData.customerName} onChange={handleInputChange} required placeholder="أدخل اسمك الكامل" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="01xxxxxxxxx" type="tel" />
                  </Grid>
                </Grid>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 4, mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <LocationOnIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}>عنوان التوصيل</Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      select
                      label="المحافظة"
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleInputChange}
                      required
                      SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: 'background.paper', maxHeight: 300 } } } }}
                    >
                      <MenuItem value="">اختر المحافظة</MenuItem>
                      {egyptGovernorates.map((gov) => (
                        <MenuItem key={gov.name} value={gov.name}>
                          {gov.name} - ({gov.shippingCost} ج شحن)
                        </MenuItem>
                      ))}
                    </TextField>
                    {formData.governorate && (
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1, color: 'primary.main', fontSize: '0.9rem' }}>
                        <LocalShippingIcon sx={{ fontSize: 18 }} />
                        <Typography sx={{ fontFamily: '"Amiri", serif' }}>تكلفة الشحن: {shippingCost} ج</Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth multiline rows={3} label="العنوان بالتفصيل" name="addressDetails" value={formData.addressDetails} onChange={handleInputChange} required placeholder="اكتب العنوان بالتفصيل (المنطقة، الشارع، رقم المبنى، الطابق...)" />
                  </Grid>
                </Grid>

                <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />} sx={{ display: { lg: 'none' }, mt: 4, height: 56, fontSize: '1.25rem', fontFamily: '"Amiri", serif' }}>
                  {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </Button>
              </Box>
            </MotionBox>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <MotionBox initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Box sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'sticky', top: 96 }}>
                <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  ملخص الطلب
                </Typography>

                <Stack spacing={2} sx={{ mb: 3, maxHeight: 256, overflowY: 'auto' }}>
                  {items.map((item) => {
                    const price = getDisplayPrice(item.selectedVariant);
                    return (
                      <Stack key={`${item.product.id}-${item.selectedVariant.size}`} direction="row" gap={1.5}>
                        <Box sx={{ width: 56, height: 56, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                          <Box component="img" src={`${API_URL}${item.product.images[0]}`} alt={item.product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontFamily: '"Amiri", serif', fontWeight: 600, fontSize: '0.9rem' }}>{item.product.name}</Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{item.selectedVariant.size} × {item.quantity}</Typography>
                          <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.9rem' }}>{price * item.quantity} ج</Typography>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>

                <Stack spacing={2} sx={{ mb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ color: 'text.secondary' }}>
                    <span>المجموع الفرعي</span>
                    <span>{totalPrice} ج</span>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ color: 'text.secondary' }}>
                    <span>الشحن</span>
                    {formData.governorate ? <span>{shippingCost} ج</span> : <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', opacity: 0.6 }}>اختر المحافظة</Typography>}
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider', fontWeight: 700, fontSize: '1.25rem' }}>
                  <span>الإجمالي</span>
                  <span>{finalTotal} <Box component="span" sx={{ color: 'primary.main', fontSize: '0.85rem', fontFamily: '"Amiri", serif' }}>ج</Box></span>
                </Stack>

                <Button variant="contained" fullWidth size="large" disabled={isSubmitting} onClick={handleSubmit} sx={{ml: 1, display: { xs: 'none', lg: 'flex' }, mt: 3, height: 56, fontSize: '1.25rem', fontFamily: '"Amiri", serif', boxShadow: '0 4px 20px rgba(207, 115, 23, 0.3)' }}>
                  {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </Button>

                <Grid container spacing={2} sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Grid size={{ xs: 6 }} >
                    <Stack alignItems="center" spacing={0.5}>
                      <LockIcon sx={{ color: 'primary.main' }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>دفع آمن</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack alignItems="center" spacing={0.5}>
                      <LocalShippingIcon sx={{ color: 'primary.main' }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>توصيل لجميع المحافظات</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ bgcolor: snackbar.severity === 'success' ? 'primary.main' : 'error.main', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage;