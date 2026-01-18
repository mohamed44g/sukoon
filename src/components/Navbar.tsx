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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  Spa as SpaIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

// 1. تحديث الروابط لإضافة "تتبع طلبك"
const navItems: NavItem[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'العطور', href: '/products' },
  { label: 'العروض', href: '/offers' },
  { label: 'تتبع طلبك', href: '/track-order' },
];

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // State للتحكم في فتح وغلق القائمة الجانبية
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // محتوى القائمة الجانبية (Drawer Content)
  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: 'center',
        height: '100%',
        bgcolor: '#1A1611', // لون خلفية القائمة (نفس هوية الموقع)
        color: 'white'
      }}
    >
      {/* رأس القائمة الجانبية */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', color: 'primary.main' }}>
          سُكُون
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(212, 165, 116, 0.2)' }} />

      {/* شريط البحث داخل القائمة الجانبية */}
      <Box sx={{ p: 2 }}>
        <TextField
          placeholder="ابحث عن عطرك..."
          size="small"
          fullWidth
          onClick={(e) => e.stopPropagation()} // عشان القائمة متقفلش لما تدوس ع البحث
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 50,
              bgcolor: 'rgba(255,255,255,0.05)',
              color: 'white',
              '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
            '& input': { color: 'white' } // لون النص داخل البحث
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* روابط التنقل */}
      <List>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  textAlign: 'center',
                  bgcolor: isActive ? 'rgba(212, 165, 116, 0.1)' : 'transparent',
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: '"Amiri", serif',
                    fontSize: '1.1rem',
                    color: isActive ? 'primary.main' : 'white'
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  );

  return (
    <>
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

            {/* Desktop Navigation Links (تختفي في الموبايل) */}
            <Stack
              direction="row"
              sx={{
                display: { xs: 'none', md: 'flex' },
                position: 'absolute',
                left: 0,
                right: 0,
                margin: 'auto',
                width: 'fit-content',
              }}
              gap={6}
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
                      textDecoration: 'none',
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: 700,
                      transition: 'color 0.3s',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {item.label}
                  </Box>
                );
              })}
            </Stack>

            {/* Actions Side */}
            <Stack direction="row" alignItems="center" gap={2}>
              {/* Desktop Search (يختفي في الموبايل) */}
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

              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: 'primary.main' }}
              >
                <MenuIcon />
              </IconButton>
            </Stack>

            {/* 2. زر القائمة للموبايل (يظهر فقط في الشاشات الصغيرة) */}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 3. Drawer Component for Mobile */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;