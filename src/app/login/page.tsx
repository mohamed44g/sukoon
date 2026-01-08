"use client"
import { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Cookies from 'js-cookie'; // مكتبة الكوكيز
import { authApi } from '@/services/api'; // استدعاء الـ API الخاص بك

export default function LoginPage() {
  const router = useRouter();
  
  // States
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. استدعاء الـ API (الذي أرسلته لي)
      const response = await authApi.login({
        username: credentials.username,
        password: credentials.password
      });

      // 2. ⚠️ هام جداً: تخزين التوكن في الكوكيز من أجل الـ Middleware
      // لازم الاسم يكون 'auth_token' زي ما كتبنا في ملف middleware.ts
      Cookies.set('auth_token', response.access_token, { expires: 1 }); // ينتهي بعد يوم

      // 3. التوجيه للداشبورد
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error(err);
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#1A1611', // الخلفية الغامقة
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)'
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={24}
          sx={{ 
            p: 4, 
            bgcolor: '#252019', 
            borderRadius: 4, 
            border: '1px solid rgba(212, 165, 116, 0.3)',
            textAlign: 'center'
          }}
        >
          {/* Logo or Title */}
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                width: 60, height: 60, 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                mx: 'auto', mb: 2,
                boxShadow: '0 0 20px rgba(212, 165, 116, 0.5)'
              }}
            >
              <LockIcon sx={{ fontSize: 30, color: '#000' }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              تسجيل الدخول
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              لوحة تحكم الإدارة
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TextField
              fullWidth
              name="username"
              label="اسم المستخدم"
              variant="outlined"
              margin="normal"
              value={credentials.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#D4A574' }} />
                  </InputAdornment>
                ),
                style: { color: 'white' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' },
                  '&:hover fieldset': { borderColor: '#D4A574' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={credentials.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#D4A574' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: 'white' }
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' },
                  '&:hover fieldset': { borderColor: '#D4A574' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#D4A574',
                color: '#000',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': { bgcolor: '#b88a5c' },
                '&.Mui-disabled': { bgcolor: 'rgba(212, 165, 116, 0.3)' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'دخول'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}