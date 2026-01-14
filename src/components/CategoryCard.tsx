import Link from 'next/link';
import Image from 'next/image';
import { Box, Typography, Card, CardActionArea } from '@mui/material';
import type { Category } from '@/types';

import { API_URL } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category}: CategoryCardProps) => {
  return (
    <Card
      sx={{
        height: {xs: 320, sm: 320},
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
        sx={{ height: '100%', position: 'relative' }}
      >
        {/* Next.js Image Component */}
        <Image
          src={`${API_URL}${category.image_url}`}
          alt={category.name}
          fill
          className="bg-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 1s',
            zIndex: 0,
          }}
        />

        {/* Overlay */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #1A1611, rgba(26, 22, 17, 0.3), transparent)',
            opacity: 0.9,
            transition: 'opacity 0.5s',
            zIndex: 1, // تأكدنا أن الـ overlay فوق الصورة
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
              fontSize : {xs: '1.7rem', sm: '2rem'}
            }}
          >
            {category.name}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;