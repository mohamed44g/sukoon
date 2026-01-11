// src/app/products/[productId]/loading.tsx
import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // ارتفاع مناسب عشان تيجي في نص الشاشة المرئية
        width: '100%',
      }}
    >
      <CircularProgress 
        size={60} // حجم الدائرة
        thickness={4} // سمك الخط
        sx={{ color: 'primary.main' }} // لون البراند (الذهبي)
      />
    </Box>
  );
}