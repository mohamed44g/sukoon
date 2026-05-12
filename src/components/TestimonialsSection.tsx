import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MotionBox = motion.create(Box);

const testimonials = [
  {
    id: 1,
    name: 'عمار ياسر إبراهيم',
    initial: 'ع',
    text: 'عطر ما شاء الله تبارك الله بصراحة تحفة، ريحته تقيلة ومميزة من أول رشة، وثباته عالي جدًا وبيفضل معاك طول اليوم. أي حد يشمّه لازم يسأل عليه، مناسب للخروج والمناسبات وحتى الشغل. اختيار موفق جدًا ويستاهل كل جنيه اندفع فيه'
  },
  {
    id: 2,
    name: 'محمد محمود',
    initial: 'م',
    text: '* أنا جربت " سموكينج وتوباكو فانيلا وبلاك أفغانو والعود الأبيض " وكلهم على مستوى عالي من الجودة والفوحان اللهم بارك... * بجد شغل معمول بضمير واهتمام بالتفاصيل وبراند يفرض نفسه وسط المنافسين ويستاهل ثقة أي حد بيدور على عطر تقيل يعيش معاه ويعبر عن ذوقه وأخيرًا شكرًا لك يا صديقي على البراند الجميل والخامات الجميلة دي اللهم صلّ وسلم وبارك على نبينا محمد ﷺ♥🌷.'
  },
  {
    id: 3,
    name: 'محمد بدرى',
    initial: 'م',
    text: 'ما شاء الله تبارك الله، عطور براند سكون جامدة وتستاهل التجربة. جربت لومال إكسير و سايد إيفيكت، خامات فخمة وريحة مميزة. وبالنسبة لـ سايد إيفيكت فهو فعلاً اسم على مسمى، تأثيره قوي جداً وفوحانه وثباته عاليين جداً. اختيار موفق وأكيد مش آخر تعامل بإذن الله.',
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Box ref={ref} component="section" sx={{ py: 0 }}>
      {/* Section Title */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
          <Box sx={{ position: 'relative' }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Amiri", serif',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', position: 'absolute', right: -32, top: 8 }}>❖</Box>
              آراء عـمـلائـنـا
              <Box component="span" sx={{ color: 'primary.main', fontSize: '1.5rem', position: 'absolute', left: -32, top: 8 }}>❖</Box>
            </Typography>
            <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', top: '100%', zIndex: 0, maxWidth: 300 }} />
          </Box>

          <Typography
            sx={{
              color: 'rgba(200, 173, 147, 0.7)',
              fontFamily: '"Amiri", serif',
              fontSize: '1.1rem',
              maxWidth: 700,
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 2,
              mt: 3,
              px: 2,
            }}
          >
            "العطر عندنا ليس زينة للحظة، بل أثرٌ يشبه المطر الأول، حين تُدرك أن للأرض روحًا، وأن للهدوء رائحة."
          </Typography>
        </Stack>
      </MotionBox>

      {/* Testimonials Grid */}
      <Grid container spacing={4}>
        {testimonials.map((testimonial, index) => (
          <Grid size = {{xs: 12, md: 4}} key={testimonial.id}>
            <MotionBox
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 4,
                p: 4,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                '&:hover .quote-icon': {
                  color: 'rgba(207, 115, 23, 0.1)',
                },
              }}
            >
              {/* Verified Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: 32,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'rgba(207, 115, 23, 0.3)',
                  color: 'primary.main',
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 50,
                  fontFamily: '"Amiri", serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 12 }} />
                مشترٍ موثوق
              </Box>

              {/* Quote Icon */}
              <Typography
                className="quote-icon"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  fontSize: '4rem',
                  color: 'rgba(71, 54, 36, 0.2)',
                  fontFamily: 'serif',
                  transition: 'color 0.3s',
                }}
              >
                ❞
              </Typography>

              {/* Rating */}
              <Stack direction="row" spacing={0.5} sx={{ mb: 3, color: 'primary.main' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} sx={{ fontSize: 16 }} />
                ))}
              </Stack>

              {/* Text */}
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontFamily: '"Amiri", serif',
                  fontSize: '1.1rem',
                  lineHeight: 2,
                  mb: 4,
                  position: 'relative',
                  zIndex: 10,
                  fontWeight: 300,
                }}
              >
                "{testimonial.text}"
              </Typography>

              {/* Divider */}
              <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider', mb: 2 }} />

              {/* Author */}
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(to bottom right, #473624, #261e16)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: 'rgba(207, 115, 23, 0.2)',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                    fontFamily: '"Amiri", serif',
                    fontSize: '1.25rem',
                  }}
                >
                  {testimonial.initial}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, color: 'white', fontSize: '1rem' }}>
                    {testimonial.name}
                  </Typography>
                </Box>
              </Stack>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestimonialsSection;
