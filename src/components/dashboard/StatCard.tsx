import { Box, Typography, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: 'primary' | 'blue' | 'purple' | 'red';
}

const colorConfig = {
  primary: {
    bg: 'rgba(212, 165, 116, 0.1)',
    hoverBg: 'rgba(212, 165, 116, 0.2)',
    color: '#cf7317',
  },
  blue: {
    bg: 'rgba(59, 130, 246, 0.1)',
    hoverBg: 'rgba(59, 130, 246, 0.2)',
    color: '#60A5FA',
  },
  purple: {
    bg: 'rgba(168, 85, 247, 0.1)',
    hoverBg: 'rgba(168, 85, 247, 0.2)',
    color: '#A78BFA',
  },
  red: {
    bg: 'rgba(239, 68, 68, 0.1)',
    hoverBg: 'rgba(239, 68, 68, 0.2)',
    color: '#F87171',
  },
};

const iconMap: Record<string, React.ReactNode> = {
  payments: <PaymentsIcon />,
  shopping_bag: <ShoppingBagIcon />,
  visibility: <VisibilityIcon />,
  warning: <WarningIcon />,
};

const StatCard = ({ title, value, icon, trend, color }: StatCardProps) => {
  const colorStyle = colorConfig[color];

  return (
    <Box
      sx={{
        bgcolor: '#252019',
        p: 3,
        borderRadius: 3,
        border: '1px solid rgba(212, 165, 116, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'rgba(212, 165, 116, 0.3)',
        },
      }}
    >
      {/* Glow effect */}
      <Box
        sx={{
          position: 'absolute',
          left: -20,
          top: -20,
          width: 100,
          height: 100,
          bgcolor: colorStyle.bg,
          borderRadius: '50%',
          filter: 'blur(40px)',
          transition: 'all 0.3s',
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            p: 1,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            color: colorStyle.color,
          }}
        >
          {iconMap[icon] || <PaymentsIcon />}
        </Box>
        {trend && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 2,
              bgcolor: trend.positive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: trend.positive ? 'success.main' : 'error.main',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {trend.positive ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
            {trend.value}
          </Box>
        )}
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, position: 'relative', zIndex: 1 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, position: 'relative', zIndex: 1 }}>
        {value}
      </Typography>
    </Box>
  );
};

export default StatCard;
