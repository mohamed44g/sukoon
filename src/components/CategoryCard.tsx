import Link from 'next/link';
import { Box, Typography, Card, CardActionArea } from '@mui/material';
import { motion } from 'framer-motion';
import type { Category } from '@/types';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LightModeIcon from '@mui/icons-material/LightMode';
import SpaIcon from '@mui/icons-material/Spa';
import { API_URL } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
}

const getIcon = (iconName: string) => {
  const iconStyle = { fontSize: 40, color: '#cf7317' };
  switch (iconName) {
    case 'man':
      return <ManIcon sx={iconStyle} />;
    case 'woman':
      return <WomanIcon sx={iconStyle} />;
    case 'ac_unit':
      return <AcUnitIcon sx={iconStyle} />;
    case 'light_mode':
      return <LightModeIcon sx={iconStyle} />;
    default:
      return <SpaIcon sx={iconStyle} />;
  }
};

const MotionCard = motion(Card);

const CategoryCard = ({ category}: CategoryCardProps) => {
  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: 320,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        transition: 'all 0.5s',
        '&:hover': {
          borderColor: 'rgba(212, 165, 116, 0.5)',
        },
        '&:hover .bg-image': {
          transform: 'scale(1.1)',
        },
        '&:hover .overlay': {
          opacity: 0.7,
        },
        '&:hover .content': {
          transform: 'translateY(-8px)',
        },
        '&:hover .divider': {
          width: 64,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/category/${(category as any).slug || category.id}`}
        sx={{ height: '100%' }}
      >
        {/* Background Image */}
        <Box
          className="bg-image"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${API_URL}${category.image_url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 1s',
          }}
        />

        {/* Overlay */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #1A1611, rgba(26, 22, 17, 0.5), transparent)',
            opacity: 0.9,
            transition: 'opacity 0.5s',
          }}
        />

        {/* Content */}
        <Box
          className="content"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            textAlign: 'center',
            zIndex: 10,
            transition: 'transform 0.5s',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Amiri", serif',
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            {category.name}
          </Typography>
          <Box
            className="divider"
            sx={{
              width: 50,
              height: '1px',
              bgcolor: 'rgba(212, 165, 116, 0.5)',
              transition: 'width 0.5s',
            }}
          />
        </Box>
      </CardActionArea>
    </MotionCard>
  );
};

export default CategoryCard;
