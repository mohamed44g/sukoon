"use client"
import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Avatar, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  CircularProgress,
  Tooltip as MuiTooltip, 
  LinearProgress
} from '@mui/material';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import StatCard from '@/components/dashboard/StatCard';
import MenuIcon from '@mui/icons-material/Menu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { DashboardData } from '@/types'; 
import { API_URL } from '@/lib/api'; 
import { analyticsApi } from '@/services/api'; 

const formatCurrency = (amount: string | number) => {
  return `${Number(amount).toLocaleString()} ج`;
};

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

// 👇 تعديل Tooltip لعرض عدد الطلبات
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // الوصول للبيانات الأصلية
    return (
      <Box sx={{ 
        bgcolor: '#1A1611', 
        border: '1px solid rgba(212, 165, 116, 0.3)', 
        p: 1.5, 
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        textAlign: 'right'
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#cf7317', fontWeight: 'bold' }}>
          {formatCurrency(data.value)}
        </Typography>
        {/* عرض عدد الطلبات */}
        <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: 0.5 }}>
          {data.ordersCount} طلبات
        </Typography>
      </Box>
    );
  }
  return null;
};

const DashboardClient = ({ initialData }: { initialData: DashboardData | null }) => {
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData>(initialData || {
    period: '',
    summary: { total_orders: '0', total_revenue: '0', low_stock_alert_count: 0 },
    charts: { last_7_days_revenue: [] },
    tables: { top_selling: [], top_viewed: [], top_customers: [] }
  });

  const fetchDashboardData = async (date: string) => {
    setLoading(true);
    try {
      const newData = await analyticsApi.getDashboard({ params: { date } });
      setData(newData);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
        fetchDashboardData(selectedDate);
    }
  }, [selectedDate]);

  const maxSales = Math.max(...data.tables.top_selling.map(i => Number(i.total_sold)), 1);
  const maxSpent = Math.max(...data.tables.top_customers.map(c => Number(c.total_spent)), 1);

  // 👇 تمرير orders_count للبيانات
  const chartData = useMemo(() => {
    const rawData = data.charts.last_7_days_revenue || [];
    
    return rawData.map((d: any) => ({
      date: d.date, 
      displayDate: d.date.slice(5), 
      value: Number(d.daily_revenue || 0),
      ordersCount: Number(d.orders_count || 0) // إضافة العدد هنا
    }));
  }, [data.charts.last_7_days_revenue]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1A1611' }}>
      <DashboardSidebar />

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        <Box sx={{ height: 64, bgcolor: '#1A1611', borderBottom: '1px solid rgba(212, 165, 116, 0.15)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>المتجر الذهبي</Typography>
          <Avatar src="/placeholder-avatar.jpg" sx={{ width: 32, height: 32 }} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 4, animation: 'fadeInUp 0.6s ease-out' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mb: 0.5 }}>لوحة القيادة</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>نظرة عامة على أداء متجرك - {data.period}</Typography>
              </Box>
              <TextField
                  type="month"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  size="small"
                  sx={{
                      bgcolor: 'background.paper', borderRadius: 1, width: 180,
                      '& input': { color: 'text.primary', fontFamily: 'inherit', fontSize: '0.9rem' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 165, 116, 0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                      colorScheme: 'dark' 
                  }}
              />
            </Stack>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress sx={{ color: 'primary.main' }} />
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 4, animation: 'fadeInUp 0.8s ease-out' }}>
                      <StatCard title="الإيرادات" value={formatCurrency(data.summary.total_revenue)} icon="payments" trend={{ value: 'محدث', positive: true }} color="primary" />
                      <StatCard title="عدد الطلبات" value={data.summary.total_orders} icon="shopping_bag" trend={{ value: 'محدث', positive: true }} color="blue" />
                      <StatCard title="مشاهدات (أعلى المنتجات)" value={data.tables.top_viewed.reduce((acc, curr) => acc + Number(curr.views_this_month), 0).toString()} icon="visibility" trend={{ value: 'الشهر المحدد', positive: true }} color="purple" />
                      <StatCard title="تنبيهات المخزون" value={`${data.summary.low_stock_alert_count || 0} منتجات`} icon="warning" color="red" />
                    </Box>

                    <Box sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', p: 3, mb: 4, animation: 'fadeInUp 1s ease-out' }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} gap={2} sx={{ mb: 3 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 0.5 }}>تحليل الإيرادات</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>أداء المبيعات خلال {data.period}</Typography>
                        </Box>
                        <Box sx={{ textAlign: { xs: 'right', md: 'left' } }}>
                          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>{formatCurrency(data.summary.total_revenue)}</Typography>
                          <Stack direction="row" alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={0.5} sx={{ color: 'success.main' }}>
                            <TrendingUpIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>إجمالي الفترة المحددة</Typography>
                          </Stack>
                        </Box>
                      </Stack>
                      
                      <Box sx={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cf7317" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#cf7317" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            
                            <XAxis 
                              dataKey="displayDate" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#888', fontSize: 12 }}
                              dy={10}
                            />

                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#888', fontSize: 12 }}
                              tickFormatter={(val) => `${val}`}
                              width={40}
                            />
                            
                            <RechartsTooltip 
                              content={<CustomChartTooltip />} 
                              cursor={{ stroke: '#cf7317', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#cf7317" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorRevenue)" 
                              animationDuration={1500}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        
                        {chartData.length === 0 && (
                           <Typography align="center" sx={{ mt: -20, color: 'text.secondary' }}>لا توجد بيانات كافية للرسم</Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' }, gap: 3 }}>
                      
                      <Stack gap={3}>
                        
                        <Box sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', p: 3, animation: 'fadeInUp 1.4s ease-out' }}>
                          <Stack direction="row" alignItems="center" gap={1} mb={3}>
                            <LocalMallIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>الأكثر مبيعاً</Typography>
                          </Stack>
                          
                          {data.tables.top_selling.length > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 200, gap: 1 }}>
                              {data.tables.top_selling.slice(0, 5).map((item, index) => {
                                const heightPercent = (Number(item.total_sold) / maxSales) * 100;
                                return (
                                  <Stack key={index} alignItems="center" spacing={1} sx={{ height: '100%', justifyContent: 'flex-end', flex: 1 }}>
                                    <MuiTooltip title={`${item.total_sold} قطعة`}>
                                      <Box 
                                        sx={{ 
                                          width: '100%', 
                                          maxWidth: 40,
                                          height: `${heightPercent}%`, 
                                          minHeight: '10%',
                                          bgcolor: 'primary.main',
                                          borderRadius: '8px 8px 0 0',
                                          opacity: 0.8,
                                          transition: 'all 0.3s',
                                          '&:hover': { opacity: 1, transform: 'scaleY(1.05)' }
                                        }} 
                                      />
                                    </MuiTooltip>
                                    <Avatar 
                                      src={getImageUrl(item.main_image)} 
                                      sx={{ width: 32, height: 32, border: '1px solid rgba(212, 165, 116, 0.3)' }}
                                    />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 60 }}>
                                      {item.name.split(' ').slice(0, 2).join(' ')}
                                    </Typography>
                                  </Stack>
                                );
                              })}
                            </Box>
                          ) : (
                            <Typography color="text.secondary" align="center" py={4}>لا توجد مبيعات</Typography>
                          )}
                        </Box>

                        <Box sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', p: 3, animation: 'fadeInUp 1.6s ease-out' }}>
                          <Stack direction="row" alignItems="center" gap={1} mb={3}>
                            <StarIcon sx={{ color: '#CD7F32' }} />
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>كبار العملاء</Typography>
                          </Stack>

                          {data.tables.top_customers.length > 0 ? (
                            <Stack spacing={3}>
                              {data.tables.top_customers.map((customer, index) => {
                                const widthPercent = (Number(customer.total_spent) / maxSpent) * 100;
                                return (
                                  <Box key={index}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                      <Stack direction="row" alignItems="center" gap={1.5}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.dark', fontSize: '0.9rem' }}>
                                          {customer.customer_name[0]}
                                        </Avatar>
                                        <Box>
                                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, lineHeight: 1.2 }}>
                                            {customer.customer_name}
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                             {customer.orders_count} طلب
                                          </Typography>
                                        </Box>
                                      </Stack>
                                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                        {formatCurrency(customer.total_spent)}
                                      </Typography>
                                    </Stack>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={widthPercent} 
                                      sx={{ 
                                        height: 6, 
                                        borderRadius: 4, 
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        '& .MuiLinearProgress-bar': { 
                                          bgcolor: index === 0 ? '#CD7F32' : (index === 1 ? '#C0C0C0' : '#CD7F32'),
                                          borderRadius: 4 
                                        } 
                                      }} 
                                    />
                                  </Box>
                                );
                              })}
                            </Stack>
                          ) : (
                            <Typography color="text.secondary" align="center" py={4}>لا يوجد عملاء</Typography>
                          )}
                        </Box>
                      </Stack>

                      <Box sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', p: 3, animation: 'fadeInUp 1.2s ease-out' }}>
                          <Stack direction="row" alignItems="center" gap={1} mb={2}>
                            <VisibilityIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>المنتجات الأكثر مشاهدة</Typography>
                          </Stack>
                          <TableContainer>
                            <Table size="small">
                                <TableHead><TableRow><TableCell align='right' sx={{ color: 'text.secondary', border: 0 }}>المنتج</TableCell><TableCell align="left" sx={{ color: 'text.secondary', border: 0 }}>المشاهدات</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {data.tables.top_viewed.map((product) => (
                                        <TableRow key={product.id} sx={{ '&:last-child td': { border: 0 }, '& td': { borderColor: 'rgba(212, 165, 116, 0.1)' } }}>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" gap={2}>
                                                    <Avatar src={getImageUrl(product.main_image)} variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'rgba(212, 165, 116, 0.1)' }}>{product.name.charAt(0)}</Avatar>
                                                    <Typography variant="body2">{product.name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="left" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{product.views_this_month}</TableCell>
                                        </TableRow>
                                    ))}
                                    {data.tables.top_viewed.length === 0 && <TableRow><TableCell colSpan={2} align="center" sx={{ border: 0, color: 'text.secondary', py: 3 }}>لا توجد مشاهدات</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                          </TableContainer>
                      </Box>
                    </Box>
                </>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardClient;