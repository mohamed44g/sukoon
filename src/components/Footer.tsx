import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Spa as SpaIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import React from 'react';
import SocialMediaLinks from './SocialMediaLinks';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(26, 22, 17, 0.98)',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 8,
        pb: 4,
        mt: 20
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Brand Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: 'rgba(212, 165, 116, 0.3)',
                    borderRadius: '50%',
                    bgcolor: 'rgba(212, 165, 116, 0.05)',
                  }}
                >
                  <SpaIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontFamily: '"Amiri", serif', fontWeight: 700 }}
                >
                  سُكُون
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontFamily: '"Amiri", serif',
                  fontSize: '1.1rem',
                  lineHeight: 2,
                }}
              >
                هنا لا تُعرض روائح… هنا يُفتح أثر. خطوة واحدة، وتغادر صخب العالم إلى مساحة أبطأ.
              </Typography>
              <Stack direction="row" spacing={1}>
                <SocialMediaLinks />
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Amiri", serif',
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>❖</Box>
              روابط سريعة
            </Typography>
            <Stack spacing={1.5}>
              {[
                { label: 'الرئيسية', href: '/' },
                { label: 'العطور', href: '/products' },
                { label: 'العروض', href: '/offers' },
                { label: 'قصتنا', href: '/about' },
              ].map((item) => (
                <Link href={item.href} key={item.label} style={{ textDecoration: 'none' }}>
                  <Typography
                    key={item.label}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontFamily: '"Amiri", serif',
                      transition: 'color 0.3s',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Categories */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Amiri", serif',
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>❖</Box>
              الأقسام
            </Typography>
            <Stack spacing={1.5}>
              {[
                { label: 'عطور رجالية', href: '/category/1' },
                { label: 'عطور نسائية', href: '/category/2' },
                { label: 'عطور شتوية', href: '/category/3' },
                { label: 'عطور صيفية', href: '/category/4' },
              ].map((item) => (
                <React.Fragment key={item.label}>
                  <Link href={item.href} style={{ textDecoration: 'none' }}>
                    <Typography
                      key={item.label}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontFamily: '"Amiri", serif',
                        transition: 'color 0.3s',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                </React.Fragment>
              ))}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Amiri", serif',
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>❖</Box>
              تواصل معنا
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography sx={{ color: 'text.secondary', fontFamily: '"Amiri", serif' }}>
                  مصر- كفر الشيخ
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography sx={{ color: 'text.secondary', direction: 'ltr' }}>
                  +20 10 60055166
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: 'divider' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              fontFamily: '"Amiri", serif',
              fontSize: '0.9rem',
            }}
          >
            جميع الحقوق محفوظة سكون © 2026
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
