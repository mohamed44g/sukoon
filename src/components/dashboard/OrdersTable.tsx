import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import type { OrderStatus } from '@/types';

interface OrdersTableProps {
  orders: Array<{
    id: string;
    customerName: string;
    date: string;
    amount: string;
    status: OrderStatus;
  }>;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'قيد الانتظار', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  PROCESSING: { label: 'قيد المعالجة', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  SHIPPED: { label: 'تم الشحن', color: '#60A5FA', bgColor: 'rgba(96, 165, 250, 0.1)' },
  DELIVERED: { label: 'مكتمل', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.1)' },
  CANCELLED: { label: 'ملغي', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

const OrdersTable = ({ orders }: OrdersTableProps) => {
  return (
    <Box
      sx={{
        bgcolor: '#252019',
        borderRadius: 3,
        border: '1px solid rgba(212, 165, 116, 0.15)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid rgba(212, 165, 116, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
          الطلبات الأخيرة
        </Typography>
        <Button
          sx={{
            color: 'primary.main',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
          }}
        >
          عرض الكل
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1A1611' }}>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>رقم الطلب</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>اسم العميل</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>التاريخ</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>المبلغ</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>الحالة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <TableRow
                  key={order.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.05)' },
                    transition: 'all 0.2s',
                  }}
                >
                  <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>#{order.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'rgba(212, 165, 116, 0.15)',
                          color: 'primary.main',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {order.customerName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {order.customerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{order.date}</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>{order.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: status.bgColor,
                        color: status.color,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        '& .MuiChip-label': { px: 1.5 },
                      }}
                      icon={
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: status.color,
                            mr: 0.5,
                          }}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersTable;
