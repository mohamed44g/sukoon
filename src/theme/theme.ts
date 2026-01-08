'use client';
import { createTheme } from '@mui/material/styles';
import { Manrope, Noto_Sans_Arabic, Amiri } from 'next/font/google';

// تعريف الخطوط
const manrope = Manrope({ subsets: ['latin'], display: 'swap' });
const notoSans = Noto_Sans_Arabic({ subsets: ['arabic'], display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap' });

// تعريف الألوان المستخرجة من ملفات Tailwind الخاصة بك
const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#cf7317', // اللون البرتقالي الأساسي
      light: '#e68a2e',
      dark: '#a65c12',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a120b', // الخلفية الغامقة جداً
      paper: '#261e16',   // خلفية الكروت (surface-dark)
    },
    text: {
      primary: '#ffffff',
      secondary: '#c8ad93', // اللون البيج للنصوص الثانوية (text-muted)
    },
    divider: '#473624', // لون الحدود
  },
  typography: {
    fontFamily: notoSans.style.fontFamily,
    h1: { fontFamily: amiri.style.fontFamily },
    h2: { fontFamily: amiri.style.fontFamily },
    h3: { fontFamily: amiri.style.fontFamily, fontWeight: 700 },
    h4: { fontFamily: amiri.style.fontFamily },
    h5: { fontFamily: amiri.style.fontFamily },
    h6: { fontFamily: amiri.style.fontFamily },
    button: { fontFamily: manrope.style.fontFamily, fontWeight: 'bold' },
    body1: { fontFamily: notoSans.style.fontFamily },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 24px',
        },
        containedPrimary: {
          backgroundColor: '#cf7317',
          '&:hover': { backgroundColor: '#a65c12' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }, // إلغاء تدرج MUI الافتراضي في الوضع الليلي
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1a120b',
          // إضافة CSS Animation للـ FadeInUp هنا
          '@keyframes fadeInUp': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        },
      },
    },
  },
});

export default theme;