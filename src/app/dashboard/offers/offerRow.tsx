"use client"
import { useState } from 'react';
import { Typography, Stack, IconButton, Avatar, TableCell, TableRow, Chip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '@/lib/api';

export const OfferRow = ({ offer, handleOpenEdit, handleDeleteClick }: any) => {
    // تخرين الحجم المختار (افتراضياً أول حجم)
    const [selectedVariant, setSelectedVariant] = useState(offer.variants?.[0] || {});

    // التحقق من وجود خصم
    const hasDiscount = selectedVariant.discount_price && selectedVariant.discount_price < selectedVariant.price;

    return (
        <TableRow sx={{ '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.05)' } }}>
            {/* 1. العرض */}
            <TableCell>
                <Stack direction="row" alignItems="center" gap={2}>
                    <Avatar
                        src={offer.main_image ? `${API_URL}${offer.main_image}` : ''}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                        <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                            {offer.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {offer.description}
                        </Typography>
                    </Box>
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
                        {selectedVariant.price || 0} ج
                    </Typography>
                )}
            </TableCell>

            {/* 3. الأحجام المتاحة */}
            <TableCell align="center">
                <Stack direction="row" gap={0.5} justifyContent="center" flexWrap="wrap">
                    {offer.variants?.map((v: any) => (
                        <Chip
                            key={v.id || v.size}
                            label={v.size}
                            size="small"
                            onClick={() => setSelectedVariant(v)}
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

            {/* 4. الإجراءات */}
            <TableCell align="right">
                <Stack direction="row" justifyContent="flex-end" gap={1}>
                    <IconButton size="small" onClick={() => handleOpenEdit(offer)} sx={{ color: 'primary.main' }} title="تعديل">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(offer.id)} sx={{ color: 'error.main' }} title="حذف">
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </TableCell>
        </TableRow>
    );
};