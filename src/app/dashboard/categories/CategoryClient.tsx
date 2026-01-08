"use client"
import { useState, ChangeEvent } from 'react';
import { 
  Box, Typography, Button, Stack, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  CircularProgress 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { categoriesApi } from '@/services/api'; // تأكد من المسار
import { Category } from '@/types'; // تأكد من المسار
import { API_URL } from '@/lib/api'; // رابط الباك إند الأساسي (http://localhost:3000)

interface CategoryClientProps {
  initialCategories: Category[];
}

const CategoryClient = ({ initialCategories }: CategoryClientProps) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // States for creating category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle File Selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Create Category
  const handleCreate = async () => {
    if (!newCategoryName || !selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', newCategoryName);
      formData.append('file', selectedFile); // تأكد أن الاسم 'file' يطابق ما يتوقعه الباك إند (Multer)

      const newCategory = await categoriesApi.create(formData);
      
      // تحديث القائمة محلياً
      setCategories([...categories, newCategory]);
      
      // إعادة تعيين النموذج وإغلاق النافذة
      setIsModalOpen(false);
      setNewCategoryName('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to create category", error);
      alert("حدث خطأ أثناء إضافة الفئة");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Category
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    try {
      await categoriesApi.delete(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1A1611' }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Mobile Header */}
        <Box sx={{ height: 64, bgcolor: '#1A1611', borderBottom: '1px solid rgba(212, 165, 116, 0.15)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>الفئات</Typography>
          <Box sx={{ width: 24 }} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Stack gap={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
            
            {/* Page Header */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} gap={2} sx={{ pb: 2, borderBottom: '1px solid rgba(212, 165, 116, 0.15)' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>إدارة الفئات</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>تنظيم وإدارة فئات المنتجات في المتجر</Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => setIsModalOpen(true)} 
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                إضافة فئة جديدة
              </Button>
            </Stack>

            {/* Categories Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
              {categories.map((category) => (
                <Box key={category.id} sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)', overflow: 'hidden', transition: 'all 0.2s', '&:hover': { borderColor: 'rgba(212, 165, 116, 0.4)', '& .actions': { opacity: 1 } } }}>
                  
                  {/* Category Image */}
                  <Box sx={{ 
                    height: 200, 
                    // نقوم بدمج رابط السيرفر مع مسار الصورة القادم من الـ API
                    backgroundImage: `url("${API_URL}${category.image_url}")`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    position: 'relative' 
                  }}>
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1A1611, transparent)' }} />
                    
                    {/* Actions Overlay */}
                    <Stack className="actions" direction="row" gap={1} sx={{ position: 'absolute', top: 12, right: 12, opacity: 0, transition: 'opacity 0.2s' }}>
                      <IconButton size="small" sx={{ bgcolor: 'rgba(26, 22, 17, 0.8)', color: 'text.primary', '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(category.id)}
                        sx={{ bgcolor: 'rgba(26, 22, 17, 0.8)', color: 'text.primary', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Category Details */}
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>{category.name}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {/* الـ API لا يرجع عدد المنتجات حالياً، يمكن إضافتها لاحقاً */}
                        عرض المنتجات
                      </Typography>
                      <Button size="small" endIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />} sx={{ color: 'primary.main' }}>
                        التفاصيل
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Add Category Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => !loading && setIsModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(212, 165, 116, 0.3)' } }}
      >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 700 }}>إضافة فئة جديدة</DialogTitle>
        <DialogContent>
          <Stack gap={3} sx={{ mt: 1 }}>
            <TextField 
              fullWidth 
              label="اسم الفئة" 
              placeholder="مثال: عطور شرقية" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' } },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
            
            {/* Image Upload Area */}
            <Box 
              component="label"
              sx={{ 
                p: 4, border: '2px dashed rgba(212, 165, 116, 0.3)', 
                borderRadius: 2, textAlign: 'center', cursor: 'pointer', 
                '&:hover': { borderColor: 'primary.main' },
                position: 'relative', overflow: 'hidden'
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
              
              {previewUrl ? (
                <Box 
                    component="img" 
                    src={previewUrl} 
                    sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 1 }} 
                />
              ) : (
                <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography sx={{ color: 'text.secondary' }}>اضغط لرفع صورة</Typography>
                </>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: 'text.secondary' }} disabled={loading}>إلغاء</Button>
          <Button 
            variant="contained" 
            onClick={handleCreate}
            disabled={loading || !newCategoryName || !selectedFile}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'حفظ الفئة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryClient;