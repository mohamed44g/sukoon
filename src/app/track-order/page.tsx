"use client";
import { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, 
  Container, Paper, Stack, InputAdornment, Alert, CircularProgress 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { ordersApi } from '@/services/api';
import { Order } from '@/types';

// إعدادات ألوان الحالات (نفس اللي عندك)
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'قيد الانتظار', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  PROCESSING: { label: 'قيد المعالجة', color: '#60A5FA', bgColor: 'rgba(96, 165, 250, 0.1)' },
  SHIPPED: { label: 'تم الشحن', color: '#A78BFA', bgColor: 'rgba(167, 139, 250, 0.1)' },
  DELIVERED: { label: 'مكتمل', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.1)' },
  CANCELLED: { label: 'ملغي', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false); // عشان نعرف هو بحث ولا لسه

  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);
    setError('');
    setSearched(true);
    setOrders([]);

    try {
      const data = await ordersApi.trackByPhone(phone);
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء البحث، تأكد من الرقم وحاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1A1611', py: 8 }}>
      <Container maxWidth="md">
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ color: '#D4A574', fontWeight: 'bold', mb: 2 }}>
            تتبع طلباتك
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            أدخل رقم هاتفك المسجل في الطلب لعرض كافة طلباتك السابقة والحالية
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper sx={{ p: 4, bgcolor: '#252019', border: '1px solid rgba(212, 165, 116, 0.2)', borderRadius: 4, mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              placeholder="رقم الهاتف (مثال: 01xxxxxxxxx)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon sx={{ color: '#D4A574' }} />
                  </InputAdornment>
                ),
                style: { color: 'white' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' },
                  '&:hover fieldset': { borderColor: '#D4A574' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                }
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading || !phone}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ 
                bgcolor: '#D4A574', 
                color: '#000',
                fontWeight: 'bold',
                px: 4,
                '&:hover': { bgcolor: '#b88a5c' }
              }}
            >
              بحث
            </Button>
          </Stack>
        </Paper>

        {/* Results Section */}
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {searched && !loading && (
          <Box>
            {orders.length > 0 ? (
              <TableContainer component={Paper} sx={{ bgcolor: '#252019', border: '1px solid rgba(212, 165, 116, 0.15)', borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(212, 165, 116, 0.05)' }}>
                      <TableCell sx={{ color: '#D4A574' }}>رقم الطلب</TableCell>
                      <TableCell sx={{ color: '#D4A574' }}>التاريخ</TableCell>
                      <TableCell sx={{ color: '#D4A574' }}>إجمالي المبلغ</TableCell>
                      <TableCell sx={{ color: '#D4A574' }}>الحالة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => {
                      const status = statusConfig[order.status] || { label: order.status, color: '#fff', bgColor: '#333' };
                      return (
                        <TableRow key={order.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#{order.id}</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                            {parseFloat(order.total_amount).toFixed(2)} ج
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={status.label} 
                              size="small"
                              sx={{ bgcolor: status.bgColor, color: status.color, fontWeight: 'bold' }} 
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, color: 'rgba(255,255,255,0.5)' }}>
                <Typography variant="h6">لا توجد طلبات مسجلة بهذا الرقم</Typography>
              </Box>
            )}
          </Box>
        )}

      </Container>
    </Box>
  );
}