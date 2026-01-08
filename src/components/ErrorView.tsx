import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Link from 'next/link'; // لو شغال Next.js
// import { Link } from 'react-router-dom'; // لو شغال React Router عادي

interface ErrorViewProps {
  statusCode?: number;
  message?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ statusCode = 500, message }) => {
  
  // دالة لتحديد المحتوى بناءً على الكود
  const getErrorContent = (code: number) => {
    switch (code) {
      case 401:
      case 403:
        return {
          icon: <LockPersonIcon sx={{ fontSize: 100, color: '#D4A574' }} />, // لون دهبي
          title: "غير مصرح لك بالدخول",
          description: "عفواً، ليس لديك الصلاحية للوصول إلى هذه الصفحة. يرجى تسجيل الدخول مرة أخرى.",
          buttonText: "تسجيل الدخول",
          buttonLink: "/login"
        };
      case 404:
        return {
          icon: <SentimentVeryDissatisfiedIcon sx={{ fontSize: 100, color: '#D4A574' }} />,
          title: "الصفحة غير موجودة",
          description: "يبدو أنك وصلت إلى رابط خاطئ أو تم حذف الصفحة.",
          buttonText: "العودة للرئيسية",
          buttonLink: "/"
        };
      default:
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main' }} />,
          title: "حدث خطأ غير متوقع",
          description: message || "نواجه مشكلة في معالجة طلبك حالياً. يرجى المحاولة لاحقاً.",
          buttonText: "تحديث الصفحة",
          buttonLink: window.location.pathname // ريفرش لنفس الصفحة
        };
    }
  };

  const content = getErrorContent(statusCode);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#1A1611', // الخلفية الغامقة بتاعتك
        color: '#fff',
        textAlign: 'center',
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center">
          
          {/* الأيقونة داخل دايرة خفيفة */}
          <Box
            sx={{
              bgcolor: 'rgba(212, 165, 116, 0.1)',
              borderRadius: '50%',
              p: 4,
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px dashed rgba(212, 165, 116, 0.3)'
            }}
          >
            {content.icon}
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#fff' }}>
            {statusCode}
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
            {content.title}
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
            {content.description}
          </Typography>

          <Box sx={{ pt: 2 }}>
            {/* زر العودة أو تسجيل الدخول */}
            {statusCode === 500 ? (
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                    sx={{ bgcolor: '#D4A574', '&:hover': { bgcolor: '#b88a5c' }, px: 4, py: 1.5, fontSize: '1rem' }}
                >
                    {content.buttonText}
                </Button>
            ) : (
                <Link href={content.buttonLink} passHref style={{ textDecoration: 'none' }}>
                    <Button 
                        variant="contained" 
                        sx={{ bgcolor: '#D4A574', '&:hover': { bgcolor: '#b88a5c' }, px: 4, py: 1.5, fontSize: '1rem' }}
                    >
                        {content.buttonText}
                    </Button>
                </Link>
            )}
          </Box>

        </Stack>
      </Container>
    </Box>
  );
};

export default ErrorView;