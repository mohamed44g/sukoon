import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  Grid,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  FlashOn as FlashOnIcon, // أيقونة للشراء المباشر
  VerifiedUser as VerifiedIcon,
  LocalShipping as ShippingIcon,
  Autorenew as ReturnIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Product, ProductVariant } from '@/types';
import { calculateDiscountPercentage, getDisplayPrice } from '@/types';
import { API_URL } from '@/lib/api';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (variant: ProductVariant, quantity: number) => void; // 👈 1. إضافة الخاصية
}

const MotionBox = motion(Box);

const ProductDetail = ({ product, onAddToCart, onBuyNow }: ProductDetailProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountPercent = selectedVariant
    ? calculateDiscountPercentage(selectedVariant.price, selectedVariant.discount_price)
    : null;
  const displayPrice = selectedVariant ? getDisplayPrice(selectedVariant) : 0;

  const handleAddToCart = () => {
    if (onAddToCart && selectedVariant) {
      onAddToCart(selectedVariant, quantity);
    }
  };

  // 👇 2. دالة الشراء المباشر
  const handleBuyNow = () => {
    if (onBuyNow && selectedVariant) {
      onBuyNow(selectedVariant, quantity);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
       {/* ... (نفس الكود السابق للصور والعناوين) ... */}
       <Grid container spacing={{ xs: 4, lg: 8 }}>
        <Grid size = {{xs: 12, lg: 6}}>
           {/* ... كود الصور ... */}
             <Stack spacing={3}>
            {/* Main Image */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: { xs: '4/5', md: '16/11' },
                bgcolor: 'secondary.main',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url('${API_URL}${product.images[selectedImageIndex] || '/placeholder.svg'}')`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  transition: 'transform 1s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              />
            </MotionBox>

            {/* Thumbnails */}
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', py: 1 }}>
              {product.images.map((url, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    flexShrink: 0,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: selectedImageIndex === index ? 'primary.main' : 'divider',
                    opacity: selectedImageIndex === index ? 1 : 0.7,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Box
                    component="img"
                    src={`${API_URL}${url}`}
                    alt={`${product.name} - ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        </Grid>

        {/* Product Info */}
        <Grid size = {{xs: 12, lg: 6}}>
           <Stack spacing={3} sx={{ pt: 2 }}>
            {/* ... (Badge, Title, Price, Description, Size Selector) ... */}
            
             {/* Badge */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Box sx={{ height: "1px", width: 40, bgcolor: 'primary.main' }} />
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: '"Amiri", serif',
                }}
              >
                 فخامة لا تضاهى 
              </Typography>
              <Box sx={{ height: "1px", width: 40, bgcolor: 'primary.main' }} />
            </MotionBox>

            {/* Title */}
            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Amiri", serif',
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </Typography>
            </MotionBox>

            {/* Price */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                pb: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                }}
              >
                {displayPrice}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color: 'text.secondary',
                  fontFamily: '"Amiri", serif',
                }}
              >
                ج
              </Typography>
              {selectedVariant?.discount_price && (
                <>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: '1.1rem',
                      textDecoration: 'line-through',
                      opacity: 0.5,
                      fontFamily: '"Amiri", serif',
                      px: 1,
                    }}
                  >
                    {selectedVariant.price} ج
                  </Typography>
                  <Chip
                    label={`خصم ${discountPercent}%`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(194, 84, 80, 0.2)',
                      color: 'error.main',
                      border: '1px solid',
                      borderColor: 'rgba(194, 84, 80, 0.3)',
                      fontFamily: '"Amiri", serif',
                    }}
                  />
                </>
              )}
            </MotionBox>

            {/* Description */}
            <Typography
              sx={{
                color: 'text.secondary',
                lineHeight: 2,
                fontSize: '1.1rem',
                fontFamily: '"Amiri", serif',
                textAlign: 'justify',
              }}
            >
              {product.description}
            </Typography>

            {/* Size Selector */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
                <Typography sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}>الحجم</Typography>
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: 'primary.main',
                    textUnderlineOffset: 4,
                  }}
                >
                  اختر الحجم المناسب 
                </Typography>
              </Box>
              <Stack direction="row" gap={2}>
                {product.variants.map((variant, index) => (
                  <Box
                    key={variant.size}
                    onClick={() => setSelectedVariantIndex(index)}
                    sx={{
                      width: 96,
                      height: 48,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: selectedVariantIndex === index ? 'primary.main' : 'divider',
                      bgcolor: selectedVariantIndex === index ? 'rgba(212, 165, 116, 0.1)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      position: 'relative',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Typography sx={{ color: selectedVariantIndex === index ? 'text.primary' : 'text.secondary' }}>
                      {variant.size}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Quantity & Add to Cart & Buy Now */}
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{ mt: 'auto' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  height: 56,
                  width: { xs: '100%', sm: 120 },
                }}
              >
                <IconButton onClick={() => setQuantity((q) => q + 1)} sx={{ flex: 1 }}>
                  <AddIcon />
                </IconButton>
                <Typography sx={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>{quantity}</Typography>
                <IconButton onClick={() => setQuantity((q) => Math.max(1, q - 1))} sx={{ flex: 1 }}>
                  <RemoveIcon />
                </IconButton>
              </Box>

              {/* 👇 3. تعديل الأزرار */}
              <Button
                variant="outlined" // تغيير النمط إلى Outlined
                onClick={handleAddToCart}
                startIcon={<CartIcon sx={{ ml: 1 }} />}
                sx={{
                  flex: 1,
                  height: 56,
                  fontSize: '1.1rem',
                  fontFamily: '"Amiri", serif',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(207, 115, 23, 0.05)',
                  },
                }}
              >
                إضافة للسلة
              </Button>

              <Button
                variant="contained" // شراء الآن يكون هو البارز
                onClick={handleBuyNow}
                startIcon={<FlashOnIcon sx={{ ml: 1 }} />}
                sx={{
                  flex: 1,
                  height: 56,
                  fontSize: '1.1rem',
                  fontFamily: '"Amiri", serif',
                  boxShadow: '0 4px 20px rgba(212, 165, 116, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 30px rgba(212, 165, 116, 0.4)',
                  },
                }}
              >
                شراء الآن
              </Button>
            </Stack>

             {/* Trust Badges */}
            <Grid container spacing={2} sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              {[
                { icon: <VerifiedIcon />, label: 'ضمان أصالة 100%' },
                { icon: <ShippingIcon />, label: 'شحن سريع وآمن' },
                { icon: <ReturnIcon />, label: 'سياسة استرجاع مرنة' },
              ].map((item) => (
                <Grid size={{xs: 4}} key={item.label}>
                  <Stack alignItems="center" spacing={1}>
                    <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>

          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;