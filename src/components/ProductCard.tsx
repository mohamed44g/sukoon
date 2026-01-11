import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { AddShoppingCart, RemoveShoppingCart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Product, ProductVariant } from '@/types';
import { calculateDiscountPercentage, getDisplayPrice } from '@/types';
import { API_URL } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
}

const MotionCard = motion(Card);

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex];

  const discountPercent = selectedVariant
    ? calculateDiscountPercentage(selectedVariant.price, selectedVariant.discount_price)
    : null;

  const displayPrice = selectedVariant ? getDisplayPrice(selectedVariant) : 0;
  const isOutOfStock = null;

  const handleAddToCart = () => {
    if (onAddToCart && selectedVariant && !isOutOfStock) {
      onAddToCart(product, selectedVariant, 1);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.5s',
        '&:hover': {
          borderColor: 'rgba(212, 165, 116, 0.5)',
          boxShadow: '0 20px 40px rgba(212, 165, 116, 0.1)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Image Container */}
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ position: 'relative', p: 2 }}>
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '3/4',
              bgcolor: 'rgba(0,0,0,0.05)'
            }}
          >
            {/* Discount Badge */}
            {discountPercent && (
              <Chip
                label={`خصم ${discountPercent}%`}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  bgcolor: 'error.main',
                  color: 'white',
                  fontFamily: '"Amiri", serif',
                  fontSize: '0.75rem',
                }}
              />
            )}

            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <Chip
                label="نفذت الكمية"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 10,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'text.secondary',
                  fontFamily: '"Amiri", serif',
                }}
              />
            )}

            {/* Next.js Optimized Image */}
            <Image
              src={`${API_URL}${product.images?.[0] || '/placeholder.svg'}`}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.7s',
              }}
              className="hover:scale-110" // أو يمكنك استخدام sx في الـ Box الأب للتحكم في الـ hover
            />
            {/* Hover effect hack via styles since Next/Image handles styles differently */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    transition: 'background 0.3s',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' } // Optional slight overlay
                }} 
            />
          </Box>
        </Box>
      </Link>

      {/* Content */}
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5, 
          p: 2.5,
          justifyContent: 'space-between'
        }}
      >
        <Box>
           {/* Product Name */}
           <Typography
            variant="h6"
            sx={{
              fontFamily: '"Amiri", serif',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', lg: '1.5rem' },
              color: 'text.primary',
              textAlign: 'center',
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              minHeight: '3.2rem',
            }}
          >
            {product.name}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              textOverflow: 'ellipsis',
              minHeight: '2.5rem',
              px: 0,
            }}
          >
            {product.description}
          </Typography>

          {/* Size Selector */}
          {product.variants.length > 1 && (
            <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap" sx={{ mt: 2 }}>
              {product.variants.map((variant, index) => (
                <Chip
                  key={variant.size}
                  label={variant.size}
                  size="small"
                  onClick={() => setSelectedVariantIndex(index)}
                  sx={{
                    cursor: 'pointer',
                    fontFamily: '"Amiri", serif',
                    bgcolor: 'rgba(212, 165, 116, 0.2)',
                    borderColor: selectedVariantIndex === index ? 'primary.main' : 'divider',
                    color: selectedVariantIndex === index ? 'primary.main' : 'text.secondary',
                    border: '1px solid',
                    '&:hover': {
                      borderColor: 'rgba(212, 165, 116, 0.5)',
                    },
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            bgcolor: 'divider',
            mx: 'auto',
            my: 1,
          }}
        />

        {/* Price and Add to Cart */}
        <Box
          sx={{
            mt: 'auto', 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            {selectedVariant?.discount_price && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                  opacity: 0.5,
                  display: 'block',
                }}
              >
                {selectedVariant.price} ج
              </Typography>
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'baseline',
                gap: 0.5,
              }}
            >
              {displayPrice}
              <Typography
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  fontFamily: '"Amiri", serif',
                  color: 'primary.main',
                }}
              >
                ج
              </Typography>
            </Typography>
          </Box>

          <IconButton
            onClick={handleAddToCart}
            sx={{
              width: 40,
              height: 40,
              border: '1px solid',
              borderColor: isOutOfStock ? 'divider' : 'divider',
              bgcolor: isOutOfStock ? 'secondary.main' : 'background.default',
              color: isOutOfStock ? 'text.secondary' : 'primary.main',
              '&:hover': {
                bgcolor: isOutOfStock ? 'secondary.main' : 'primary.main',
                borderColor: isOutOfStock ? 'divider' : 'primary.main',
                color: isOutOfStock ? 'text.secondary' : 'primary.contrastText',
              },
            }}
          >
            {isOutOfStock ? <RemoveShoppingCart /> : <AddShoppingCart />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;