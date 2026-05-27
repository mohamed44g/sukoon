
import Link from 'next/link';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Badge,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'لوحة القيادة', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'المنتجات', href: '/dashboard/products', icon: <Inventory2Icon /> },
  { label: 'العروض', href: '/dashboard/offers', icon: <Inventory2Icon /> },
  { label: 'الفئات', href: '/dashboard/categories', icon: <CategoryIcon /> },
  { label: 'الطلبات', href: '/dashboard/orders', icon: <ShoppingCartIcon /> },
  { label: 'العملاء', href: '/dashboard/customers', icon: <GroupIcon /> },
  { label: 'المديرين', href: '/dashboard/admins', icon: <AdminPanelSettingsIcon /> },
];

const DashboardSidebar = () => {
  const location = usePathname();

  return (
    <Box
      component="aside"
      sx={{
        width: 280,
        bgcolor: '#1A1611',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        borderLeft: '1px solid rgba(212, 165, 116, 0.15)',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Brand */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #D4A574, #B8956A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(212, 165, 116, 0.25)',
          }}
        >
          <StorefrontIcon sx={{ color: '#1A1611' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, lineHeight: 1.2 }}>
            المتجر الذهبي
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            لوحة الإدارة
          </Typography>
        </Box>
      </Box>

      {/* Navigation Links */}
      <Box component="nav" sx={{ flex: 1, px: 2, py: 2, overflowY: 'auto' }}>
        <Stack spacing={1}>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Box
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  bgcolor: isActive ? 'rgba(212, 165, 116, 0.15)' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  border: isActive ? '1px solid rgba(212, 165, 116, 0.2)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(212, 165, 116, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                {item.icon}
                <Typography sx={{ fontWeight: 500, flex: 1 }}>{item.label}</Typography>
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '0.7rem',
                      },
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
