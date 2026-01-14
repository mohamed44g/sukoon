import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FadeInUp from './FadeInUp';

const MotionTypography = motion.create(Typography);

const HeroSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: "100vh",
        backgroundImage: `linear-gradient(to bottom, rgba(26, 18, 11, 0.3), rgba(26, 18, 11, 1)), url("background.jpeg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Pattern Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("https://www.transparenttextures.com/patterns/arabs.png")`,
          opacity: 0.1,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Bottom Gradient */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #1a120b, transparent, transparent)',
        }}
      />

      {/* Decorative Top Diamonds */}
      <FadeInUp
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: 64,
          background: 'linear-gradient(to bottom, #1a120b, transparent)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          pt: 2,
        }}
      >
        <Typography sx={{ color: 'rgba(207, 115, 23, 0.3)', letterSpacing: '1em', fontSize: '0.75rem' }}>
          ❖ ❖ ❖ ❖ ❖ ❖ ❖ ❖ ❖ ❖ ❖ ❖
        </Typography>
      </FadeInUp>

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 20,
        }}
      >
        {/* Subtitle */}
        <FadeInUp
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <Box sx={{ height: '1px', width: 48, bgcolor: 'primary.main' }} />
          <Typography
            sx={{
              color: 'primary.main',
              letterSpacing: '0.3em',
              fontSize: { xs: '0.70rem', md: '1rem' },
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            تشكيلة حصرية
          </Typography>
          <Box sx={{ height: '1px', width: 48, bgcolor: 'primary.main' }} />
        </FadeInUp>

        {/* Main Title */}
        <FadeInUp
            delay = {0.2}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Amiri", serif',
              fontSize: { xs: '2.4rem', md: '4.5rem', lg: '5.5rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              mb: 4,
              color: 'white',
            }}
          >
            <Box component="span" sx={{ display: 'block', fontSize: '1.75rem', mb: 1, color: 'primary.main', fontWeight: 300 }}>
            </Box>
            أغلق ما حولك قليلًا
            <br />
            <Box component="span" sx={{ color: '#d4b89e' }}>وافتح هذا الباب</Box>
            <Box component="span" sx={{ display: 'block', fontSize: '1.75rem', mt: 2, color: 'primary.main', fontWeight: 300 }}>
             
            </Box>
          </Typography>
        </FadeInUp>

        {/* Description */}
        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            fontFamily: '"Amiri", serif',
            fontSize: { xs: '1.20rem', md: '1.5rem' },
            fontWeight: 300,
            lineHeight: 1.8,
            maxWidth: 800,
            mx: 'auto',
            mb: 6,
            color: '#c8ad93',
          }}
        >
          ما ستجده ليس عالمًا آخر، بل نفسك… حين تهدأ.
        </MotionTypography>

        {/* Quote Box */}
        <FadeInUp
          delay= {0.6}
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mb: 5,
            py: 2,
            px: 4,
            borderTop: '1px solid rgba(207, 115, 23, 0.2)',
            borderBottom: '1px solid rgba(207, 115, 23, 0.2)',
            position: 'relative',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Amiri", serif',
              fontSize: { xs: '.85rem', md: '1.1rem' },
              fontStyle: 'italic',
              lineHeight: 2,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            "هنا لا تُعرض روائح… هنا يُفتح أثر. خطوة واحدة، وتغادر صخب العالم إلى مساحة أبطأ، حيث يتكلم الصمت، وتبقى الرائحة."
          </Typography>
        </FadeInUp>

        {/* CTA Button */}
        <FadeInUp
          delay= {0.8}
        >
          <Button
            variant="outlined"
            sx={{
              px: 5,
              py: 2,
              borderRadius: 50,
              fontSize: '1rem',
              fontFamily: '"Amiri", serif',
              borderColor: 'primary.main',
              color: 'primary.main',
              borderWidth: 1,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.5s',
              mt: 2,
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
                boxShadow: '0 0 30px rgba(207, 115, 23, 0.3)',
              },
            }}
            endIcon={<ArrowBackIcon sx={{ fontSize: 14, mr: 1 }} />}
          >
            اكتشف المجموعة الملكية
          </Button>
        </FadeInUp>
      </Container>
    </Box>
  );
};

export default HeroSection;
