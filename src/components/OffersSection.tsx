'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Grid, Stack, Chip } from '@mui/material';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { API_URL } from '@/lib/api';

const MotionBox = motion.create(Box);

const OffersSection = ({ offers }: { offers: Product[] }) => {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State للاحتفاظ باختيار المستخدم اليدوي فقط
  // القيمة null تعني أن المستخدم لم يختر شيئاً، وسنستخدم الافتراضي
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // تحريك الكاروسيل تلقائياً كل 5 ثواني
  useEffect(() => {
    if (!offers || offers.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
      // عند الانتقال للمنتج التالي تلقائياً، نعيد تصفير الاختيار اليدوي
      setSelectedVariant(null);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers]);

  const product = offers && offers.length > 0 ? offers[currentIndex] : null;

  if (!product) return null;

  // --- بداية التصحيح ---
  // بدلاً من useEffect، نقوم بحساب الـ Variant النشط أثناء الريندر
  // 1. نحدد الافتراضي (الذي عليه خصم أو الأول)
  const defaultVariant = product.variants.find(v => v.discount_price) || product.variants[0];
  
  // 2. إذا اختار المستخدم شيئاً نستخدمه، وإلا نستخدم الافتراضي
  const activeVariant = selectedVariant || defaultVariant;
  // --- نهاية التصحيح ---

  const hasDiscount = !!activeVariant?.discount_price;
  const price = activeVariant?.price || 0;
  const discountPrice = activeVariant?.discount_price || 0;
  
  // يمكنك استبدال null بالتحقق الفعلي من الكمية إذا كان متاحاً في الـ activeVariant
  const isOutOfStock = null; 

  // حساب نسبة الخصم
  const discountPercent = hasDiscount 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  return (
    <Box ref={ref} component="section" sx={{ py: 0, mt: 20 }}>
      {/* Section Title */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Amiri", serif',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', verticalAlign: 'middle', px: 2, mt: '-10px', display: 'inline-block' }}>❖</Box>
            العــــــروض
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
            "كأنك تمشي بعد المطر، الأرض ما زالت دافئة، والهواء يحمل سرًّا لا يُقال… هذه ليست رائحة، هذا إحساس وجد طريقه إليك."
          </Typography>
        </Stack>
      </MotionBox>

      {/* Offer Card Carousel */}
      <Box sx={{ mt: 7, position: 'relative', minHeight: { xs: 'auto', lg: 500 } }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id} // المفتاح لتغيير الأنيميشن عند تغير المنتج
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 6,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
              }}
            >
              {/* Corner Decorations */}
              <Box sx={{ position: 'absolute', top: 16, right: 16, width: 64, height: 64, borderTop: '2px solid', borderRight: '2px solid', borderColor: 'rgba(207, 115, 23, 0.3)', borderTopRightRadius: 12, zIndex: 20, pointerEvents: 'none' }} />
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, width: 64, height: 64, borderBottom: '2px solid', borderLeft: '2px solid', borderColor: 'rgba(207, 115, 23, 0.3)', borderBottomLeftRadius: 12, zIndex: 20, pointerEvents: 'none' }} />

              <Grid container>
                {/* Product Image */}
                <Grid size={{ xs: 12, lg: 6 }} sx={{ height: { xs: 350, lg: 'auto' }, minHeight: { lg: 500 } }}>
                  <Box
                    sx={{
                      height: "100%",
                      backgroundImage: `url("${API_URL}${product.images[0] || '/placeholder.svg'}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: { xs: 'linear-gradient(to top, #261e16, transparent)', lg: 'linear-gradient(to left, #261e16, transparent)' },
                      }}
                    />

                    {/* Badge */}
                    {hasDiscount && (
                      <Chip
                        icon={<LocalFireDepartmentIcon sx={{ fontSize: 14, color: 'white !important' }} />}
                        label={`خصم ${discountPercent}%`}
                        sx={{
                          position: 'absolute',
                          top: 24,
                          right: 24,
                          bgcolor: 'rgba(153, 27, 27, 0.9)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: 'white',
                          fontFamily: '"Amiri", serif',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    )}
                  </Box>
                </Grid>

                {/* Product Info */}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Box
                    sx={{
                      p: { xs: 3, lg: 8 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 3,
                      position: 'relative',
                      height: '100%',
                    }}
                  >
                    {/* Pattern Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")`,
                        opacity: 0.05,
                        pointerEvents: 'none',
                      }}
                    />

                    <Box sx={{ zIndex: 10 }}>
                      <Typography variant="h3" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, fontSize: { xs: '2rem', lg: '2.75rem' }, color: 'white', lineHeight: 1.3, mb: 1 }}>
                        {product.name}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        fontFamily: '"Amiri", serif',
                        borderRight: '2px solid',
                        borderColor: 'rgba(207, 115, 23, 0.2)',
                        pr: 3,
                        zIndex: 10,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                      }}
                    >
                      {product.description}
                    </Typography>

                    {/* Variants Selection */}
                    <Stack direction="row" gap={1} flexWrap="wrap" sx={{ zIndex: 10 }}>
                      {product.variants.map((v) => (
                        <Chip
                          key={v.size}
                          label={v.size}
                          onClick={() => setSelectedVariant(v)}
                          variant={v.size === activeVariant.size ? "filled" : "outlined"}
                          sx={{
                            cursor: 'pointer',
                            fontFamily: '"Amiri", serif',
                            bgcolor: v.size === activeVariant.size ? 'rgba(212, 165, 116, 0.2)' : 'transparent',
                            borderColor: v.size === activeVariant.size ? 'primary.main' : 'rgba(255,255,255,0.1)',
                            color: v.size === activeVariant.size ? 'primary.main' : 'text.secondary',
                            border: '1px solid',
                            '&:hover': {
                              borderColor: 'rgba(212, 165, 116, 0.5)',
                            },
                          }}
                        />
                      ))}
                    </Stack>

                    {/* Divider */}
                    <Box sx={{ width: '100%', height: "1px", background: 'linear-gradient(to right, #473624, rgba(207, 115, 23, 0.5), #473624)', zIndex: 10 }} />

                    {/* Price & Button */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} spacing={4} sx={{ zIndex: 10 }}>
                      <Box>
                        {hasDiscount && (
                          <Typography sx={{ color: 'rgba(200, 173, 147, 0.5)', fontSize: '1rem', textDecoration: 'line-through', textDecorationColor: 'rgba(239, 68, 68, 0.5)', mb: 0.5, fontFamily: '"Amiri", serif' }}>
                            {price} ج
                          </Typography>
                        )}
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                          <Typography sx={{ color: 'white', fontSize: '2.5rem', fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
                            {hasDiscount ? discountPrice : price}
                          </Typography>
                          <Typography sx={{ fontSize: '1.1rem', fontWeight: 400, color: 'primary.main', fontFamily: '"Amiri", serif' }}>
                            جنيه
                          </Typography>
                        </Stack>
                      </Box>

                      <motion.div style={{ flex: 1, minWidth: 200 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => addToCart(product, activeVariant, 1)}
                          disabled={isOutOfStock || false}
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingCartIcon sx={{ ml: 1 }} />}
                          sx={{
                            height: 56,
                            fontSize: '1.25rem',
                            fontFamily: '"Amiri", serif',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(207, 115, 23, 0.2)',
                            bgcolor: isOutOfStock ? 'secondary.main' : 'primary.main',
                            '&:hover': {
                              boxShadow: '0 4px 30px rgba(207, 115, 23, 0.4)',
                              bgcolor: isOutOfStock ? 'secondary.main' : 'primary.dark',
                            },
                          }}
                        >
                          {isOutOfStock ? 'نفذت الكمية' : 'إضافة للسلة'}
                        </Button>
                      </motion.div>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default OffersSection;