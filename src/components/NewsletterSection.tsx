import { Box, Container, Typography, Button, TextField, Stack } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import EmailIcon from '@mui/icons-material/Email';

const MotionBox = motion.create(Box);

const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          sx={{ textAlign: 'center', py: 4 }}
        >
          {/* Icon */}
          <MotionBox
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'rgba(207, 115, 23, 0.1)',
              border: '1px solid',
              borderColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <EmailIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          </MotionBox>

          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Amiri", serif',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: 'text.primary',
              mb: 2,
            }}
          >
            انضم إلى قائمة النخبة
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: '0.95rem',
              maxWidth: 500,
              mx: 'auto',
              mb: 4,
              fontFamily: '"Amiri", serif',
            }}
          >
            كن أول من يعرف عن العروض الحصرية والمنتجات الجديدة
          </Typography>

          {/* Form */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ maxWidth: 450, mx: 'auto' }}
            >
              <TextField
                placeholder="البريد الإلكتروني"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  },
                }}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1,
                    whiteSpace: 'nowrap',
                    minWidth: 100,
                  }}
                >
                  اشتراك
                </Button>
              </motion.div>
            </Stack>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default NewsletterSection;
