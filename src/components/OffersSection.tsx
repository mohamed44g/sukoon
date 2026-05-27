'use client';
import { useState } from 'react';
import { Box, Typography, Button, Grid, Stack, Chip, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';
import Slider from 'react-slick';

// استيراد ملفات الستاينق الخاصة بـ react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { API_URL } from '@/lib/api';
import FadeInUp from './FadeInUp';

// --- تخصيص أسهم التنقل لـ React Slick ---
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: { xs: 5, md: -20 },
        top: '50%',
        transform: 'translateY(-50%)',
        bgcolor: 'rgba(0,0,0,0.5)',
        color: 'white',
        zIndex: 2,
        '&:hover': { bgcolor: 'primary.main' }
      }}
    >
      <ArrowForwardIosIcon fontSize="small" />
    </IconButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: { xs: 5, md: -20 },
        top: '50%',
        transform: 'translateY(-50%)',
        bgcolor: 'rgba(0,0,0,0.5)',
        color: 'white',
        zIndex: 2,
        '&:hover': { bgcolor: 'primary.main' }
      }}
    >
      <ArrowBackIosNewIcon fontSize="small" />
    </IconButton>
  );
};

// --- مكون داخلي يمثل الشريحة الواحدة ---
const OfferSlide = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const defaultVariant = product.variants.find(v => v.discount_price) || product.variants[0];
  const activeVariant = selectedVariant || defaultVariant;

  const hasDiscount = !!activeVariant?.discount_price;
  const price = activeVariant?.price || 0;
  const discountPrice = activeVariant?.discount_price || 0;
  const isOutOfStock = null;

  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: { xs: 4, md: 6 },
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        mx: { xs: 1, md: 2 },
        my: 2,
        height: '100%',
      }}
    >
      {/* الزخارف الجانبية - مخفية في الموبايل لتقليل المساحة وطول الكارت */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, width: 64, height: 64, borderTop: '2px solid', borderRight: '2px solid', borderColor: 'rgba(207, 115, 23, 0.3)', borderTopRightRadius: 12, zIndex: 20, pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />
      <Box sx={{ position: 'absolute', bottom: 16, left: 16, width: 64, height: 64, borderBottom: '2px solid', borderLeft: '2px solid', borderColor: 'rgba(207, 115, 23, 0.3)', borderBottomLeftRadius: 12, zIndex: 20, pointerEvents: 'none', display: { xs: 'none', md: 'block' } }} />

      <Grid container sx={{ height: '100%' }}>
        {/* Product Image */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ position: 'relative', height: { xs: 180, sm: 220, lg: 'auto' }, minHeight: { lg: 500 } }}>
          <Image
            src={`${API_URL}${product.images[0] || '/placeholder.svg'}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority={true}
          />

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: { xs: 'linear-gradient(to top, #261e16, transparent)', lg: 'linear-gradient(to left, #261e16, transparent)' },
              zIndex: 1
            }}
          />

          {hasDiscount && (
            <Chip
              label={`خصم ${discountPercent}%`}
              size="small"
              sx={{
                position: 'absolute',
                top: { xs: 12, md: 24 },
                right: { xs: 12, md: 24 },
                bgcolor: 'rgba(153, 27, 27, 0.9)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'white',
                fontFamily: '"Amiri", serif',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                zIndex: 2
              }}
            />
          )}
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box
            sx={{
              p: { xs: 2.5, lg: 8 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: { xs: 1.5, md: 3 },
              position: 'relative',
              height: '100%',
            }}
          >
            {/* Pattern Overlay */}
            <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")`, opacity: 0.05, pointerEvents: 'none' }} />

            <Box sx={{ zIndex: 10 }}>
              <Typography variant="h3" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, fontSize: { xs: '1.25rem', lg: '2.75rem' }, color: 'white', lineHeight: 1.2 }}>
                {product.name}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: 'text.secondary',
                lineHeight: { xs: 1.5, md: 1.8 },
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: 300,
                fontFamily: '"Amiri", serif',
                borderRight: '2px solid',
                borderColor: 'rgba(207, 115, 23, 0.2)',
                pr: { xs: 1.5, md: 3 },
                zIndex: 10,
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: { xs: 2, md: 3 },
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
                  size="small"
                  onClick={() => setSelectedVariant(v)}
                  variant={v.size === activeVariant.size ? "filled" : "outlined"}
                  sx={{
                    cursor: 'pointer',
                    fontFamily: '"Amiri", serif',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    height: { xs: 26, md: 32 },
                    bgcolor: v.size === activeVariant.size ? 'rgba(212, 165, 116, 0.2)' : 'transparent',
                    borderColor: v.size === activeVariant.size ? 'primary.main' : 'rgba(255,255,255,0.1)',
                    color: v.size === activeVariant.size ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    '&:hover': { borderColor: 'rgba(212, 165, 116, 0.5)' },
                  }}
                />
              ))}
            </Stack>

            <Box sx={{ width: '100%', height: "1px", background: 'linear-gradient(to right, #473624, rgba(207, 115, 23, 0.5), #473624)', zIndex: 10 }} />

            <Stack direction={{ xs: 'row', sm: 'row' }} justifyContent={{ xs: 'space-between', sm: 'flex-start' }} alignItems="flex-end" spacing={{ xs: 2, sm: 4 }} sx={{ zIndex: 10 }}>
              <Box>
                {hasDiscount && (
                  <Typography sx={{ color: 'rgba(200, 173, 147, 0.5)', fontSize: { xs: '0.8rem', md: '1rem' }, textDecoration: 'line-through', textDecorationColor: 'rgba(239, 68, 68, 0.5)', mb: 0, fontFamily: '"Amiri", serif' }}>
                    {price} ج
                  </Typography>
                )}
                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                  <Typography sx={{ color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' }, transform: 'translateY(4px)', fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
                    {hasDiscount ? discountPrice : price}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.85rem', md: '1.1rem' }, fontWeight: 400, color: 'primary.main', fontFamily: '"Amiri", serif' }}>
                    جنيه
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ flex: { xs: 'none', sm: 1 }, minWidth: { xs: 120, sm: 200 } }}>
                <Button
                  onClick={() => addToCart(product, activeVariant, 1, "offer")}
                  disabled={isOutOfStock || false}
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCartIcon sx={{ ml: { xs: 0.5, md: 1 } }} />}
                  sx={{
                    height: { xs: 42, md: 56 },
                    fontSize: { xs: '0.95rem', md: '1.25rem' },
                    fontFamily: '"Amiri", serif',
                    borderRadius: { xs: 2, md: 3 },
                    boxShadow: '0 4px 20px rgba(207, 115, 23, 0.2)',
                    bgcolor: isOutOfStock ? 'secondary.main' : 'primary.main',
                    '&:hover': {
                      boxShadow: '0 4px 30px rgba(207, 115, 23, 0.4)',
                      bgcolor: isOutOfStock ? 'secondary.main' : 'primary.dark',
                    },
                  }}
                >
                  {isOutOfStock ? 'نفذت' : 'اضافة للعربة'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// --- المكون الرئيسي بقوة React Slick ---
const OffersSection = ({ offers }: { offers: Product[] }) => {

  // إعدادات سلايدر React Slick لعرض سلايد واحدة فقط في كل صفحة (fade أو slide مريح)
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true, // دعم كامل للاتجاه العربي الافتراضي للمتجر
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: any) => (
      <Box sx={{ bottom: "-10px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </Box>
    ),
    customPaging: () => (
      <Box
        className="dot-indicator"
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease",
          ".slick-active &": {
            bgcolor: "primary.main",
            transform: "scale(1.3)",
          }
        }}
      />
    )
  };

  if (!offers || offers.length === 0) return null;

  return (
    <Box component="section" sx={{ py: 0, mt: { xs: 10, md: 20 }, px: { xs: 1, md: 4 } }}>
      {/* العنوان */}
      <FadeInUp>
        <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Amiri", serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '3rem' },
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Box component="span" sx={{ color: 'primary.main', fontSize: { xs: '1rem', md: '1.5rem' }, verticalAlign: 'middle', px: 1, display: 'inline-block' }}>❖</Box>
            العــــــروض
            <Box component="span" sx={{ color: 'primary.main', fontSize: { xs: '1rem', md: '1.5rem' }, verticalAlign: 'middle', px: 1, display: 'inline-block' }}>❖</Box>
          </Typography>

          <Typography
            sx={{
              color: 'rgba(200, 173, 147, 0.8)',
              fontFamily: '"Amiri", serif',
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              maxWidth: 700,
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.8,
              px: 2
            }}
          >
            "كأنك تمشي بعد المطر، الأرض ما زالت دافئة، والهواء يحمل سرًّا لا يُقال… هذه ليست رائحة، هذا إحساس وجد طريقه إليك."
          </Typography>
        </Stack>
      </FadeInUp>

      {/* منطقة السلايدر */}
      <Box
        sx={{
          position: 'relative',
          mt: { xs: 3, md: 6 },
          maxWidth: 1200,
          mx: 'auto',
          // تخصيص استايل النقاط الافتراضي لـ slick
          '& .slick-dots li': { width: '12px', height: '12px', mx: 0.5 }
        }}
      >
        <Slider {...settings}>
          {offers.map((offer) => (
            <Box key={offer.id} sx={{ height: '100%' }}>
              <OfferSlide product={offer} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default OffersSection;