"use client"
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Stack, IconButton, Avatar, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, 
  TextField, LinearProgress 
} from '@mui/material';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import { analyticsApi } from '@/services/api';

// تعريف الواجهة للبيانات القادمة من الباك إند
interface CustomerData {
  customer_name: string;
  customer_phone: string;
  orders_count: number;
  total_spent: number;
  tier: string;
}

const tierConfig: Record<string, { color: string; bgColor: string }> = {
  'نخبة': { color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.1)' },
  'مميز': { color: '#D4A574', bgColor: 'rgba(212, 165, 116, 0.1)' },
  'جديد': { color: '#A89F94', bgColor: 'rgba(168, 159, 148, 0.1)' },
};

export default function CustomersClient({ initialData }: { initialData: any[] }) {
  const [customers, setCustomers] = useState<any[]>(initialData);
  const [loading, setLoading] = useState(false);

  // التاريخ المختار (افتراضياً الشهر الحالي)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // جلب البيانات عند تغيير الشهر
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data : any = await analyticsApi.getCustomers(selectedMonth);
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1A1611' }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Mobile Header */}
        <Box sx={{ height: 64, bgcolor: '#1A1611', borderBottom: '1px solid rgba(212, 165, 116, 0.15)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>العملاء</Typography>
          <Box sx={{ width: 24 }} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Stack gap={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
            
            {/* Header & Date Picker */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} gap={2} sx={{ pb: 2, borderBottom: '1px solid rgba(212, 165, 116, 0.15)' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>إدارة العملاء</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>تحليل أداء العملاء حسب الشهر</Typography>
              </Box>
              
              <Stack direction="row" gap={2} alignItems="center">
                <TextField
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    size="small"
                    sx={{
                        bgcolor: '#252019',
                        borderRadius: 1,
                        border: '1px solid rgba(212, 165, 116, 0.3)',
                        '& input': { color: 'white' },
                        '& fieldset': { border: 'none' },
                        colorScheme: 'dark'
                    }}
                />
                <Button variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>تصدير</Button>
              </Stack>
            </Stack>

            {/* Loading Bar */}
            {loading && <LinearProgress sx={{ bgcolor: 'rgba(212, 165, 116, 0.3)', '& .MuiLinearProgress-bar': { bgcolor: '#D4A574' } }} />}

            {/* Table */}
            <TableContainer sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', opacity: loading ? 0.5 : 1, transition: '0.3s' }}>
              <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#1A1611' }}>
                        <TableCell sx={{ color: 'text.secondary' }}>العميل</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>الهاتف</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>الطلبات</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>إجمالي الإنفاق</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>المستوى</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length > 0 ? (
                    customers.map((c, index) => {
                    const tier = tierConfig[c.tier] || tierConfig['جديد'];
                    return (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.05)' } }}>
                        <TableCell>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'rgba(212, 165, 116, 0.15)', color: 'primary.main', fontWeight: 700 }}>
                                    {c.customer_name?.[0] || '?'}
                                </Avatar>
                                <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{c.customer_name}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }} dir="ltr">{c.customer_phone}</TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{c.orders_count} طلب</TableCell>
                        <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>{c.total_spent.toLocaleString()} ر.س</TableCell>
                        <TableCell><Chip size="small" label={c.tier} sx={{ bgcolor: tier.bgColor, color: tier.color }} /></TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            {loading ? 'جاري التحميل...' : `لا يوجد عملاء نشطين في شهر ${selectedMonth}`}
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}