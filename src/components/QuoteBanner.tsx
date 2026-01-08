import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SpaIcon from '@mui/icons-material/Spa';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const QuoteBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        py: 10,
        mt: 20,
        textAlign: 'center',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#221a11',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Top Decorative */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 0.5,
          opacity: 0.2,
        }}
      >
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>◆</Typography>
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>◆</Typography>
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>◆</Typography>
      </Box>

      {/* Bottom Decorative */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 0.5,
          opacity: 0.2,
        }}
      >
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>◆</Typography>
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>◆</Typography>
        <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>◆</Typography>
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
        {/* Spa Icon */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 0.8, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}
        >
          <SpaIcon sx={{ color: 'primary.main', fontSize: 60, animation: 'pulse 2s infinite' }} />
        </MotionBox>

        {/* Quote Text */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{ position: 'relative', display: 'inline-block', px: 6 }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: '3rem',
              color: 'rgba(207, 115, 23, 0.2)',
              fontFamily: 'serif',
            }}
          >
            ❝
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Amiri", serif',
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              color: '#d4b89e',
              lineHeight: 2,
            }}
          >
            هذا المكان لا يزدحم. كل شيء فيه يُقال على مهل، حتى الرائحة… تدخل قلبك أولًا، ثم تُعرّف نفسها لاحقًا.
          </Typography>

          <Typography
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              fontSize: '3rem',
              color: 'rgba(207, 115, 23, 0.2)',
              fontFamily: 'serif',
              transform: 'rotate(180deg)',
            }}
          >
            ❝
          </Typography>
        </MotionBox>

        {/* Bottom Decorative */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, color: 'rgba(207, 115, 23, 0.4)' }}
        >
          <Typography sx={{ fontSize: '1.5rem' }}>~ ❊ ~</Typography>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default QuoteBanner;
