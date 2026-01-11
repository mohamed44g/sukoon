import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import { CartProvider } from '@/contexts/CartContext';
import './index.css';
import NextTopLoader from 'nextjs-toploader';

// 1. إعداد الـ Viewport (منفصل في Next.js 14+)
export const viewport: Viewport = {
  themeColor: '#cf7317', // لون المتصفح في الموبايل (نفس لون البراند)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. إعداد الـ Metadata الشامل
export const metadata: Metadata = {
  // الرابط الأساسي للموقع (مهم جداً للصور)
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  
  title: {
    default: 'سكون - للعطور الفاخرة',
    template: '%s | سكون', // سيتحول لـ "اسم المنتج | سكون" في الصفحات الداخلية
  },
  
  description: 'اكتشف أرقى العطور المستوحاة من الطبيعة. متجر سكون يقدم تشكيلة حصرية من العطور الفرنسية والشرقية، دهن العود، والبخور بأفضل الأسعار.',
  
  keywords: ['عطور', 'سكون', 'عود', 'بخور', 'عطور نسائية', 'عطور رجالية', 'هدايا', 'مسك', 'تسوق اونلاين'],
  
  authors: [{ name: 'Sukoon Team' }],
  creator: 'Sukoon',
  publisher: 'Sukoon',

  // إعدادات المشاركة على السوشيال ميديا (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'سكون - للعطور الفاخرة',
    description: 'تجربة عطرية لا تُنسى. تسوق الآن أفضل العطور الرجالية والنسائية.',
    url: '/',
    siteName: 'متجر سكون',
    images: [
      {
        url: '/og-image.jpg', // 👈 يجب وضع صورة باسم og-image.jpg في مجلد public
        width: 1200,
        height: 630,
        alt: 'Sukoon Perfumes',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },

  // إعدادات تويتر
  twitter: {
    card: 'summary_large_image',
    title: 'سكون - للعطور الفاخرة',
    description: 'اكتشف عالم العطور الفاخرة مع سكون.',
    images: ['/twitter-image.jpg'], // نفس الصورة أو مختلفة
    creator: '@sukoon_perfumes', // حساب تويتر لو وجد
  },

  // الأيقونات
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },

  // تعليمات عناكب البحث
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" style={{ backgroundColor: '#1a120b' }}>
      <body style={{ backgroundColor: '#1a120b' }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CartProvider>
              <NextTopLoader 
                color="#cf7317" // لون البراند بتاعك
                showSpinner={false}
              />
             {children}
          </CartProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}