"use client"
import { useState } from 'react';
import { 
  Box, Typography, Button, Stack, IconButton, Avatar, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Alert, CircularProgress 
} from '@mui/material';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { adminsApi } from '@/services/api';

// تعريف الواجهة حسب الـ Backend Model
interface Admin {
  id: number;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  created_at: string;
}

interface AdminsClientProps {
  initialAdmins: Admin[];
}

const roleTranslations : any = {
  'SUPER_ADMIN': 'مدير عام (Super Admin)',
  'ADMIN': 'مسؤول (Admin)',
};

export default function AdminsClient({ initialAdmins }: AdminsClientProps) {
  const [admins, setAdmins] = useState<any[]>(initialAdmins);
  
  // States for Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'ADMIN' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States for Delete Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

  // --- Handlers ---

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const created = await adminsApi.create(newAdmin);
      setAdmins([...admins, created]); // تحديث القائمة فوراً
      setIsAddOpen(false);
      setNewAdmin({ username: '', password: '', role: 'ADMIN' }); // تصفير الفورم
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setAdminToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    setLoading(true);
    setError(''); // استخدام نفس ستيت الإيرور للمودال أو ممكن عمل واحد منفصل
    
    try {
      await adminsApi.delete(adminToDelete);
      setAdmins(admins.filter(a => a.id !== adminToDelete));
      setIsDeleteOpen(false);
      setAdminToDelete(null);
    } catch (err: any) {
      // هنا سيتم التقاط خطأ 403 لو حاول يمسح نفسه
      const msg = err.response?.data?.message || 'حدث خطأ أثناء الحذف';
      alert(msg); // عرض رسالة تنبيه للمستخدم
      setIsDeleteOpen(false); // إغلاق المودال حتى لو فشل
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1A1611' }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Mobile Header */}
        <Box sx={{ height: 64, bgcolor: '#1A1611', borderBottom: '1px solid rgba(212, 165, 116, 0.15)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>المديرين</Typography>
          <Box sx={{ width: 24 }} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
            
            {/* Header */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2} sx={{ pb: 2, borderBottom: '1px solid rgba(212, 165, 116, 0.15)' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>إدارة المديرين</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>إدارة صلاحيات المستخدمين والمسؤولين</Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => setIsAddOpen(true)}
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                إضافة مدير
              </Button>
            </Stack>

            {/* Admins Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
              {admins.map((admin) => (
                <Box key={admin.id} sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', p: 3, transition: 'all 0.2s', '&:hover': { borderColor: 'rgba(212, 165, 116, 0.4)' } }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(212, 165, 116, 0.2)', color: 'primary.main' }}>
                      <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>{admin.username}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: #{admin.id}</Typography>
                    </Box>
                  </Stack>
                  
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>الصلاحية:</Typography>
                      <Typography variant="body2" sx={{ color: admin.role === 'SUPER_ADMIN' ? 'primary.main' : 'text.primary', fontWeight: 'bold' }}>
                        {roleTranslations[admin.role] || admin.role}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>تاريخ التسجيل:</Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {new Date(admin.created_at).toLocaleDateString('ar-EG')}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ pt: 2, borderTop: '1px solid rgba(212, 165, 116, 0.15)' }}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      onClick={() => confirmDelete(admin.id)}
                      startIcon={<DeleteIcon />}
                      sx={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'error.main', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: 'error.main' } }}
                    >
                      حذف
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>

        {/* ============ Add Modal ============ */}
        <Dialog 
          open={isAddOpen} 
          onClose={() => !loading && setIsAddOpen(false)}
          PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(212, 165, 116, 0.3)', minWidth: 400 } }}
        >
          <DialogTitle sx={{ color: 'primary.main' }}>إضافة مسؤول جديد</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              
              <TextField 
                label="اسم المستخدم" 
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                fullWidth 
                sx={{ input: { color: 'white' }, label: { color: 'gray' }, fieldset: { borderColor: 'rgba(212,165,116,0.3)' } }}
              />
              <TextField 
                label="كلمة المرور" 
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                fullWidth 
                sx={{ input: { color: 'white' }, label: { color: 'gray' }, fieldset: { borderColor: 'rgba(212,165,116,0.3)' } }}
              />
              <TextField 
                select
                label="الصلاحية" 
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                fullWidth 
                sx={{ 
                    '& .MuiSelect-select': { color: 'white' }, 
                    label: { color: 'gray' }, 
                    fieldset: { borderColor: 'rgba(212,165,116,0.3)' },
                    svg: { color: 'white' }
                }}
              >
                <MenuItem value="ADMIN">مسؤول (Admin)</MenuItem>
                <MenuItem value="SUPER_ADMIN">مدير عام (Super Admin)</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsAddOpen(false)} disabled={loading} sx={{ color: 'text.secondary' }}>إلغاء</Button>
            <Button onClick={handleCreate} disabled={loading} variant="contained" sx={{ bgcolor: 'primary.main' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'حفظ'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ============ Delete Confirmation Modal ============ */}
        <Dialog
          open={isDeleteOpen}
          onClose={() => !loading && setIsDeleteOpen(false)}
          PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(239, 68, 68, 0.3)' } }}
        >
          <DialogTitle sx={{ color: 'error.main' }}>تأكيد الحذف</DialogTitle>
          <DialogContent>
            <Typography>هل أنت متأكد من رغبتك في حذف هذا المسؤول؟</Typography>
            <Typography variant="caption" color="error">لا يمكن التراجع عن هذا الإجراء.</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsDeleteOpen(false)} disabled={loading} sx={{ color: 'text.secondary' }}>إلغاء</Button>
            <Button onClick={handleDelete} disabled={loading} variant="contained" color="error">
              {loading ? <CircularProgress size={24} color="inherit" /> : 'حذف نهائي'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}