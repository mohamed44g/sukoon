"use client"
import { useState } from 'react';
import { 
  Typography, Stack, 
  IconButton, Avatar, TableCell, 
  TableRow, Chip
  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '@/lib/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';

export const ProductRow = ({ product, handleOpenEdit, handleDeleteClick }: any) => {
  // الحالة لتخزين الحجم المختار (افتراضياً أول حجم)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || {});

  // التحقق من وجود خصم
  const hasDiscount = selectedVariant.discount_price && selectedVariant.discount_price < selectedVariant.price;

  return (
    <TableRow sx={{ '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.05)' } }}>
      {/* 1. المنتج (صورة واسم فقط - تم حذف الوصف) */}
      <TableCell>
        <Stack direction="row" alignItems="center" gap={2}>
          <Avatar 
            src={product.images?.[0] ? `${API_URL}${product.images[0]}` : ''} 
            variant="rounded" 
            sx={{ width: 48, height: 48 }} 
          />
          <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
            {product.name}
          </Typography>
        </Stack>
      </TableCell>

      {/* 2. السعر (يتغير حسب الحجم المختار) */}
      <TableCell align="center">
        {hasDiscount ? (
          <Stack alignItems="center">
            <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.8rem' }}>
              {selectedVariant.price} ج
            </Typography>
            <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>
              {selectedVariant.discount_price} ج
            </Typography>
          </Stack>
        ) : (
          <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
            {selectedVariant.price} ج
          </Typography>
        )}
      </TableCell>

      {/* 3. الأحجام (قابلة للضغط) */}
      <TableCell align="center">
        <Stack direction="row" gap={0.5} justifyContent="center">
          {product.variants?.map((v: any) => (
            <Chip 
              key={v.size} 
              label={v.size} 
              size="small" 
              onClick={() => setSelectedVariant(v)} // 👈 تحديث السعر عند الضغط
              variant={selectedVariant.size === v.size ? "filled" : "outlined"}
              color={selectedVariant.size === v.size ? "primary" : "default"}
              sx={{ 
                cursor: 'pointer',
                borderColor: 'rgba(212, 165, 116, 0.3)',
                bgcolor: selectedVariant.size === v.size ? 'primary.main' : 'transparent'
              }} 
            />
          ))}
        </Stack>
      </TableCell>

      {/* 4. الإجراءات (تم إضافة زر المعاينة) */}
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" gap={1}>
            {/* زر المعاينة */}
            <Link href={`/products/${product.id}`} target="_blank">
                <IconButton size="small" sx={{ color: 'info.main' }} title="عرض المنتج">
                    <VisibilityIcon />
                </IconButton>
            </Link>
            
            <IconButton size="small" onClick={() => handleOpenEdit(product)} sx={{ color: 'primary.main' }} title="تعديل">
                <EditIcon />
            </IconButton>
            
            <IconButton size="small" onClick={() => handleDeleteClick(product.id)} sx={{ color: 'error.main' }} title="حذف">
                <DeleteIcon />
            </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};