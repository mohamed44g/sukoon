"use client"
import { useState, useMemo, useEffect } from 'react';
import { 
  Box, Typography, Button, Stack, TextField, InputAdornment, 
  IconButton, Avatar, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Menu, MenuItem, CircularProgress, 
  Tooltip, LinearProgress, Dialog, DialogTitle, DialogContent, 
  DialogActions, Grid, Divider
} from '@mui/material';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PaymentsIcon from '@mui/icons-material/Payments';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close'; // أيقونة الإغلاق
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { ordersApi } from '@/services/api';
import { Order, OrderStatus } from '@/types';
import Link from 'next/link';

// تعريف واجهة تفاصيل المنتج داخل الطلب
interface OrderItem {
  id: number;
  product_name: string;
  size: string;
  quantity: number;
  price_at_purchase: number;
}

// دمج واجهة الطلب مع قائمة المنتجات (اختياري حسب الـ types عندك)
// interface OrderWithItems extends Order {
//   items: OrderItem[];
// }

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'قيد الانتظار', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  PROCESSING: { label: 'قيد المعالجة', color: '#60A5FA', bgColor: 'rgba(96, 165, 250, 0.1)' },
  SHIPPED: { label: 'تم الشحن', color: '#A78BFA', bgColor: 'rgba(167, 139, 250, 0.1)' },
  DELIVERED: { label: 'مكتمل', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.1)' },
  CANCELLED: { label: 'ملغي', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

const filters = [
    { key: 'all', label: 'الكل' }, 
    { key: 'PENDING', label: 'قيد الانتظار' }, 
    { key: 'SHIPPED', label: 'تم الشحن' }, 
    { key: 'DELIVERED', label: 'مكتمل' }, 
    { key: 'CANCELLED', label: 'ملغي' }
];

interface OrdersClientProps {
  initialOrders: Order[];
}

const OrdersClient = ({ initialOrders }: OrdersClientProps) => {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // --- States for Status Menu ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  // --- States for Details Modal (الجديد) ---
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ============ Fetching Data ============
  useEffect(() => {
    const fetchOrdersByMonth = async () => {
      setLoading(true);
      try {
        const data = await ordersApi.getAll(selectedMonth);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersByMonth();
  }, [selectedMonth]);

  // ============ Filtering ============
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchTab = activeTab === 'all' || order.status === activeTab;
      const matchSearch = 
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm);
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchTerm]);

  // ============ Stats ============
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0);
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    return [
      { title: 'إجمالي الطلبات', value: orders.length, icon: <ShoppingCartIcon />, color: 'primary.main' },
      { title: 'طلبات قيد الانتظار', value: pendingCount, icon: <HourglassTopIcon />, color: '#F59E0B' },
      { title: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ج`, icon: <PaymentsIcon />, color: '#22C55E' }
    ];
  }, [orders]);

  // ============ Handlers ============
  
  // فتح قائمة تغيير الحالة
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleChangeStatus = async (newStatus: string) => {
    if (!selectedOrderId) return;
    setUpdating(true);
    try {
      await ordersApi.updateStatus(selectedOrderId, newStatus);
      setOrders(prev => prev.map(o => 
        o.id === selectedOrderId ? { ...o, status: newStatus as any } : o
      ));
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("فشل تحديث الحالة");
    } finally {
      setUpdating(false);
    }
  };

  // 👇 دالة فتح مودال التفاصيل
  const handleViewOrder = async (orderId: number) => {
    setDetailsOpen(true);
    setLoadingDetails(true);
    try {
      // جلب التفاصيل الكاملة (شاملة المنتجات) من الباك إند
      const data = await ordersApi.getById(orderId);
      setViewOrder(data as unknown as any); // Type assertion if needed
    } catch (error) {
      console.error("Failed to fetch order details", error);
      alert("تعذر تحميل تفاصيل الطلب");
      setDetailsOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1A1611' }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Mobile Header */}
        <Box sx={{ height: 64, bgcolor: '#1A1611', borderBottom: '1px solid rgba(212, 165, 116, 0.15)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>الطلبات</Typography>
          <Box sx={{ width: 24 }} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Stack gap={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
            
            {/* Header & Stats & Filters (كما هي) */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} gap={2}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>صفحة الطلبات</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>إدارة ومتابعة كافة طلبات المتجر</Typography>
              </Box>
              <Stack direction="row" gap={2} alignItems="center">
                <TextField type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} size="small" sx={{ bgcolor: '#252019', borderRadius: 1, border: '1px solid rgba(212, 165, 116, 0.3)', '& input': { color: 'white' }, '& fieldset': { border: 'none' }, colorScheme: 'dark' }} />
            
              </Stack>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {stats.map((stat, i) => (
                <Box key={i} sx={{ p: 3, bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box><Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{stat.title}</Typography><Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>{stat.value}</Typography></Box>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 2, color: 'success.main' }}>
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">إحصائيات شهر {selectedMonth}</Typography>
                  </Stack>
                </Box>
              ))}
            </Box>

            <Stack direction={{ xs: 'column', lg: 'row' }} gap={2} alignItems="center" sx={{ p: 2, bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)' }}>
              <TextField fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="بحث برقم الطلب أو اسم العميل..." sx={{ maxWidth: { lg: 400 }, '& input': { color: 'white' } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }} />
              <Stack direction="row" gap={1} sx={{ overflowX: 'auto', width: '100%', justifyContent: { lg: 'flex-end' } }}>
                {filters.map((f) => (
                    <Button key={f.key} onClick={() => setActiveTab(f.key)} variant={activeTab === f.key ? 'contained' : 'outlined'} sx={activeTab === f.key ? { bgcolor: 'primary.main', color: 'primary.contrastText' } : { borderColor: 'rgba(212, 165, 116, 0.3)', color: 'text.secondary' }}>{f.label}</Button>
                ))}
              </Stack>
            </Stack>

            {loading && <LinearProgress sx={{ bgcolor: 'rgba(212, 165, 116, 0.3)', '& .MuiLinearProgress-bar': { bgcolor: '#D4A574' } }} />}

            {/* Orders Table */}
            <TableContainer sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              <Table>
                <TableHead><TableRow sx={{ bgcolor: '#1A1611' }}>
                  <TableCell align = 'right' sx={{ color: 'text.secondary' }}>رقم الطلب</TableCell>
                  <TableCell align = 'right' sx={{ color: 'text.secondary' }}>العميل</TableCell>
                  <TableCell dsx={{ color: 'text.secondary' }}>التاريخ</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>الحالة</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>المبلغ</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>إجراءات</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                    const status = statusConfig[order.status] || { label: order.status, color: '#gray', bgColor: '#333' };
                    return (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.05)' } }}>
                        <TableCell align = 'right' sx={{ color: 'text.primary', fontWeight: 500 }}>#{order.id}</TableCell>
                        <TableCell align = 'right'>
                            <Stack direction="row" alignItems="center" gap={1.5}>
                          
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.primary' }}>{order.customer_name}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{order.customer_phone}</Typography>
                                </Box>
                            </Stack>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                            <Tooltip title="اضغط لتغيير الحالة">
                                <Chip size="small" label={status.label} onClick={(e) => handleOpenMenu(e, order.id)} icon={<EditIcon sx={{ fontSize: '14px !important', color: status.color }} />} sx={{ bgcolor: status.bgColor, color: status.color, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} />
                            </Tooltip>
                        </TableCell>
                        <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>{parseFloat(order.total_amount).toFixed(2)} ج</TableCell>
                        <TableCell>
                            {/* 👇 زر المعاينة الجديد */}
                            <IconButton 
                                size="small" 
                                onClick={() => handleViewOrder(order.id)}
                                sx={{ color: 'info.main' }} 
                                title="عرض التفاصيل"
                            >
                                <VisibilityIcon />
                            </IconButton>

                              <Link 
                                href={`https://wa.me/+20${order.customer_phone}?text=`}
                            >
                              <IconButton 
                                size="small"
                                sx={{ color: 'success.main' }} 
                                title="اتصل بالعميل"
                            >
                                <WhatsAppIcon />
                            </IconButton>
                            </Link>
    
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>{loading ? 'جاري التحميل...' : `لا توجد طلبات في هذا الشهر (${selectedMonth})`}</TableCell></TableRow>
                )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Box>

        {/* Status Change Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(212, 165, 116, 0.3)' } }}>
            <MenuItem onClick={() => handleChangeStatus('PENDING')} disabled={updating}>قيد الانتظار</MenuItem>
            <MenuItem onClick={() => handleChangeStatus('PROCESSING')} disabled={updating}>قيد المعالجة</MenuItem>
            <MenuItem onClick={() => handleChangeStatus('SHIPPED')} disabled={updating}>تم الشحن</MenuItem>
            <MenuItem onClick={() => handleChangeStatus('DELIVERED')} disabled={updating}>مكتمل</MenuItem>
            <MenuItem onClick={() => handleChangeStatus('CANCELLED')} disabled={updating} sx={{ color: 'error.main' }}>ملغي</MenuItem>
        </Menu>

        {/* ============ 👇 Order Details Dialog (الجديد) ============ */}
        <Dialog 
            open={detailsOpen} 
            onClose={() => setDetailsOpen(false)} 
            maxWidth="md" 
            fullWidth
            PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(212, 165, 116, 0.3)' } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 165, 116, 0.15)' }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>تفاصيل الطلب #{viewOrder?.id}</Typography>
                <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
                {loadingDetails ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : viewOrder ? (
                    <Stack spacing={4}>
                        {/* 1. معلومات العميل */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>معلومات العميل:</Typography>
                            <Grid container spacing={2}>
                                <Grid size ={{xs: 12, sm: 4}}>
                                    <Typography variant="body2" color="text.secondary">الاسم:</Typography>
                                    <Typography variant="body1">{viewOrder.customer_name}</Typography>
                                </Grid>
                                <Grid size ={{xs: 12, sm: 4}}>
                                    <Typography variant="body2" color="text.secondary">الهاتف:</Typography>
                                    <Typography variant="body1">{viewOrder.customer_phone}</Typography>
                                </Grid>
                                <Grid size ={{xs: 12, sm: 4}}>
                                    <Typography variant="body2" color="text.secondary">العنوان:</Typography>
                                    <Typography variant="body1">{viewOrder.customer_address}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        
                        <Divider sx={{ borderColor: 'rgba(212, 165, 116, 0.15)' }} />

                        {/* 2. جدول المنتجات */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>المنتجات:</Typography>
                            <TableContainer sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                        <TableRow>
                                            <TableCell align= 'right' sx={{ color: 'text.secondary' }}>المنتج</TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>الحجم</TableCell>
                                            <TableCell align="center" sx={{ color: 'text.secondary' }}>الكمية</TableCell>
                                            <TableCell align="center" sx={{ color: 'text.secondary' }}>السعر</TableCell>
                                            <TableCell align="center" sx={{ color: 'text.secondary' }}>الإجمالي</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {viewOrder.items?.map((item : any, index : any) => (
                                            <TableRow key={index}>
                                                <TableCell align= 'right' sx={{ color: 'white' }}>{item.product_name}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{item.size}</TableCell>
                                                <TableCell align="center" sx={{ color: 'white' }}>{item.quantity}</TableCell>
                                                <TableCell align="center" sx={{ color: 'white' }}>{item.price_at_purchase} ج</TableCell>
                                                <TableCell align="center" sx={{ color: 'primary.main' }}>{(item.price_at_purchase * item.quantity).toFixed(2)} ج</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(212, 165, 116, 0.15)' }} />

                        {/* 3. الملخص المالي */}
                        <Stack alignItems="flex-end" spacing={1}>
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                الإجمالي الكلي: {parseFloat(viewOrder.total_amount).toFixed(2)} ج
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                الحالة: {statusConfig[viewOrder.status]?.label || viewOrder.status}
                            </Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <Typography color="error">حدث خطأ في تحميل البيانات</Typography>
                )}
            </DialogContent>
        </Dialog>

      </Box>
    </Box>
  );
};

export default OrdersClient;