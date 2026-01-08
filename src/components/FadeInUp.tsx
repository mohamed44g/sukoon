// src/components/FadeInUp.tsx
'use client';
import { Box, BoxProps } from '@mui/material';

interface FadeInUpProps extends BoxProps {
  delay?: string;
}

export default function FadeInUp({ children, delay = '0s', sx, ...props }: FadeInUpProps) {
  return (
    <Box
      sx={{
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        animationDelay: delay,
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}