"use client"
import { Box, Container, Typography, Grid, Button, Stack, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';

const MotionBox = motion.create(Box);



// Women category special quote
const womenQuote = ` العطر زينة، ولكل زينة موضعها، وقد جاء في السنة النبوية توجيهٌ كريم في ذلك: أنه لا يجوز للمرأه ان تضع العطر خارج منزلها `;

// Category configurations
const categoryConfig: Record<string, any> = {
  1: {
    title: 'عطور رجالية',
    subtitle: 'عطور النخبة',
    heroTitle: 'الفخامة الرجالية',
    heroSubtitle: 'روح الشرق الأصيل',
    quote: ' قال رسول الله ﷺ: حُبِّبَ إليَّ من دنياكم الطيبُ فـإستحضر أخي النيه تؤجر ان شاء الله ',
    quoteSource: 'حديث شريف',
    bgImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&q=80',
  },
  2: {
    title: 'عطور نسائية',
    subtitle: 'أناقة الروح',
    heroTitle: 'الأنوثة الساحرة',
    heroSubtitle: 'عبير الورد والياسمين',
    quote: womenQuote,
    quoteSource: 'حكم شرعى',
    bgImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80',
  },
  3: {
    title: 'عطور شتوية',
    subtitle: 'دفء الشتاء',
    heroTitle: 'نفحات الشتاء',
    heroSubtitle: 'دفء العود والعنبر',
    quote: ' قال رسول الله ﷺ: حُبِّبَ إليَّ من دنياكم الطيبُ فـإستحضر أخي النيه تؤجر ان شاء الله ',
    quoteSource: 'حديث شريف',
    bgImage: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1200&q=80',
  },
  4: {
    title: 'عطور صيفية',
    subtitle: 'انتعاش الصيف',
    heroTitle: 'نسمات الصيف',
    heroSubtitle: 'خفة الحمضيات والزهور',
    quote: ' قال رسول الله ﷺ: حُبِّبَ إليَّ من دنياكم الطيبُ فـإستحضر أخي النيه تؤجر ان شاء الله ',
    quoteSource: 'حديث شريف',
    bgImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80',
  },
};


const CategoryPage = ({products, categoryId} : {products : Product[], categoryId : number}) => {

  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const config = categoryConfig[categoryId];

  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    addToCart(product, variant, quantity);
    setSnackbar({ open: true, message: `تمت إضافة ${product.name} (${variant.size}) × ${quantity} للسلة` });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      {/* Quote Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden' }}>
        <Box className="pattern-ornament" sx={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', py: 4, px: { xs: 2, md: 6 }, borderTop: '2px solid', borderBottom: '2px solid', borderColor: 'rgba(207, 115, 23, 0.2)', bgcolor: 'rgba(207, 115, 23, 0.05)', borderRadius: 4 }}>
            <Typography sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', color: 'primary.main', fontSize: '1.5rem', bgcolor: 'background.paper', px: 1 }}>۞</Typography>
            <Typography variant="h4" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, lineHeight: 2, whiteSpace: 'pre-line' }}>
              <Box component="span" sx={{ color: 'primary.main', opacity: 0.8 }}>"</Box>
              {config.quote}
              <Box component="span" sx={{ color: 'primary.main', opacity: 0.8 }}>"</Box>
            </Typography>
            <Typography sx={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', color: 'primary.main', fontSize: '1.5rem', bgcolor: 'background.paper', px: 1 }}>۞</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary', mt: 4, fontFamily: '"Amiri", serif', fontSize: '1.1rem' }}>- {config.quoteSource} -</Typography>
        </Container>
      </Box>

      {/* Products Section */}
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative' }}>
        <Stack alignItems="center" spacing={2} sx={{ mb: 8 }}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h2" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, textAlign: 'center', pb: 3 }}>
             مجموعة العطور
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
              <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', transform: 'rotate(45deg)' }} />
              <Box sx={{ width: 250, height: 2, bgcolor: 'primary.main' }} />
              <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', transform: 'rotate(45deg)' }} />
            </Stack>
          </Box>
          <Typography sx={{ color: 'text.secondary', fontFamily: '"Amiri", serif', fontSize: '1.1rem', fontStyle: 'italic', textAlign: 'center', maxWidth: 600, mt: 2 }}>
           {+categoryId === 2 ? " ننتقي لكِ أطيب الطيب، لتنعمي به في مملكتك الخاصة" :  "عطور صنعت من أندر المكونات لتناسب ذائقتك الرفيعة"}
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {products.map((product, index) => (
            <Grid size = {{xs:12, sm: 6, lg: 3}} key={product.id}>
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        <Stack alignItems="center" sx={{ mt: 8 }}>
          {
            products.length != 0 ?
            <Button variant="outlined" size="large" startIcon={<ExpandMoreIcon />} sx={{ px: 5, py: 1.5, borderRadius: 50, fontSize: '1.1rem', fontFamily: '"Amiri", serif' }}>
            عرض المزيد
          </Button> : <Typography sx={{fontWeight: 700}}>لا يوجد منتجات لعرضها.</Typography>
          }
        </Stack>
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryPage;
