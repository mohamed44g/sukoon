'use client';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Container,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'العطور', href: '/products' },
  { label: 'العروض', href: '/offers' },
];

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(26, 22, 17, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}
    >
      <Container maxWidth="xl">
        {/* جعلنا الـ Toolbar relative عشان الروابط تاخد absolute بالنسبة له */}
        <Toolbar sx={{ py: 1, justifyContent: 'space-between', position: 'relative' }}>
          
          {/* Logo Side */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: 'text.primary',
                cursor: 'pointer'
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: 'rgba(212, 165, 116, 0.3)',
                  borderRadius: '50%',
                  bgcolor: 'rgba(212, 165, 116, 0.05)',
                }}
              >
                <SpaIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Amiri", serif',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                سُكُون
              </Typography>
            </Box>
          </Link>

          {/* Navigation Links - (التعديل هنا) */}
          <Stack
            direction="row"
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              // 👇 هذا الكود السحري للتوسيط الحقيقي
              position: 'absolute', 
              left: 0,
              right: 0,
              margin: 'auto',
              width: 'fit-content',
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                  <Box
                    component={Link}
                    href={item.href}
                    key={item.href}
                    sx={{
                      textAlign: "center",
                      fontFamily: '"Amiri", serif',
                      fontSize: '1.1rem',
                      
                      textDecoration: 'none', // مهم لإلغاء الخط
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: 700,
                      transition: 'color 0.3s',
                      '&:hover': { color: 'primary.main' },
                      mr: 3, 
                      ml: 3
                    }}
                  >
                    {item.label}
                  </Box>
              );
            })}
          </Stack>

          {/* Actions Side */}
          <Stack direction="row" alignItems="center" gap={2}>
            {/* Search */}
            <TextField
              placeholder="ابحث عن عطرك..."
              size="small"
              sx={{
                display: { xs: 'none', lg: 'flex' },
                width: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 50,
                  bgcolor: 'background.paper',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'rgba(212, 165, 116, 0.5)' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Cart Button */}
            <IconButton
              component={Link}
              href="/cart"
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  '& .MuiSvgIcon-root': { color: 'primary.contrastText' },
                },
              }}
            >
              <Badge
                badgeContent={totalItems > 0 ? (totalItems > 9 ? '9+' : totalItems) : 0}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.65rem',
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <ShoppingBagIcon sx={{ fontSize: 20, color: 'text.primary' }} />
              </Badge>
            </IconButton>

            {/* Profile Button */}
            {/* <IconButton
              component={Link}
              href="/login"
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  '& .MuiSvgIcon-root': { color: 'primary.contrastText' },
                },
              }}
            >
              <PersonIcon sx={{ fontSize: 20, color: 'text.primary' }} />
            </IconButton> */}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;