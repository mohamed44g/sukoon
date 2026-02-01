"use client"
import { useState, useEffect, ChangeEvent } from 'react';
import {
  Box, Typography, Button, Stack, TextField, InputAdornment,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, CircularProgress, Alert, MenuItem, Select,
  InputLabel, FormControl, OutlinedInput, SelectChangeEvent, Pagination
} from '@mui/material';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { ProductRow } from './productRow';

import { productsApi, categoriesApi } from '@/services/api';
import { Product, Category } from '@/types';
import { API_URL } from '@/lib/api';

// --- Interfaces ---
interface ProductFormData {
  name: string;
  description: string;
  categoryIds: number[];
  variants: { size: string; price: string; discount_price: string }[];
}

// ✅ التعديل هنا: إضافة الأحجام الجديدة (10ml, 5ml, 3ml) للقائمة الافتراضية
const defaultVariants = [
  { size: '100ml', price: '', discount_price: '' },
  { size: '50ml', price: '', discount_price: '' },
  { size: '30ml', price: '', discount_price: '' },
  { size: '10ml', price: '', discount_price: '' },
  { size: '5ml', price: '', discount_price: '' },
  { size: '3ml', price: '', discount_price: '' }
];

const initialFormState: ProductFormData = {
  name: '',
  description: '',
  categoryIds: [],
  variants: defaultVariants
};

const DashboardProducts = () => {
  // --- States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Data
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);

  // --- Image Handling States ---
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // --- Fetch Data ---

  // 1. جلب الأقسام
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesApi.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. جلب المنتجات
  const fetchProducts = async (currentPage: number) => {
    try {
      setLoading(true);
      const productsData = await productsApi.getAll(currentPage);
      setProducts(productsData);

      if (productsData.length < 8) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Pagination Handlers
  const handleNextPage = () => {
    if (hasMore) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  // --- Handlers: Open/Close ---

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormState); // ستقوم بتحميل الأحجام الافتراضية الجديدة هنا
    setExistingImages([]);
    setNewFiles([]);
    setError(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description || '',
      categoryIds: product.categoryIds || [],
      variants: product.variants.map(v => ({
        size: v.size,
        price: v.price.toString(),
        discount_price: v.discount_price ? v.discount_price.toString() : '',
      })),
    });

    if (product.images && product.images.length > 0) {
      setExistingImages(product.images);
    } else {
      setExistingImages([]);
    }

    setNewFiles([]);
    setError(null);
    setOpenDialog(true);
  };

  // --- Image Logic ---
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewFile = (indexToRemove: number) => {
    setNewFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- Variant Logic ---
  const handleVariantChange = (index: number, field: string, value: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', price: '', discount_price: '' }]
    }));
  };

  const removeVariant = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  // --- Other Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    const newCategoryIds = typeof value === 'string' ? value.split(',').map(Number) : value;
    setFormData(prev => ({ ...prev, categoryIds: newCategoryIds as number[] }));
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await productsApi.delete(productToDelete);
        fetchProducts(page);
        setDeleteConfirmOpen(false);
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  // --- Submit Logic ---
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('categoryIds', JSON.stringify(formData.categoryIds));

      // تصفية الأحجام الفارغة قبل الإرسال (اختياري، لكنه مفيد)
      const validVariants = formData.variants.filter(v => v.price && v.size);

      const formattedVariants = validVariants.map(v => ({
        size: v.size,
        price: Number(v.price),
        discount_price: v.discount_price ? Number(v.discount_price) : null,
      }));
      data.append('variants', JSON.stringify(formattedVariants));

      if (editingProduct) {
        data.append('existingImages', JSON.stringify(existingImages));
      }

      newFiles.forEach(file => {
        data.append('files', file);
      });

      if (editingProduct) {
        await productsApi.update(editingProduct.id, data);
      } else {
        await productsApi.create(data);
      }

      await fetchProducts(page);
      setOpenDialog(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.includes(searchTerm)
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#1A1611' }}>
      <DashboardSidebar />

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile Header */}
        <Box sx={{ height: 64, bgcolor: '#1A1611', borderBottom: '1px solid rgba(212, 165, 116, 0.15)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <IconButton sx={{ color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>المنتجات</Typography>
          <Box sx={{ width: 24 }} />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
          <Stack spacing={4} sx={{ maxWidth: 1400, mx: 'auto' }}>

            {/* Page Header */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700 }}>إدارة المنتجات</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>تتبع مخزونك، حدث الأسعار، وراقب أداء المنتجات</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                إضافة منتج جديد
              </Button>
            </Stack>

            {/* Filter */}
            <TextField
              fullWidth
              placeholder="بحث باسم المنتج (في الصفحة الحالية)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                style: { color: 'white' }
              }}
              sx={{ bgcolor: '#252019', borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 165, 116, 0.3)' } }}
            />

            {/* Table */}
            <TableContainer sx={{ bgcolor: '#252019', borderRadius: 3, border: '1px solid rgba(212, 165, 116, 0.15)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1A1611' }}>
                    <TableCell align='right' sx={{ color: 'text.secondary' }}>المنتج</TableCell>
                    <TableCell align='center' sx={{ color: 'text.secondary' }}>السعر</TableCell>
                    <TableCell align='center' sx={{ color: 'text.secondary' }}>الأحجام</TableCell>
                    <TableCell align='center' sx={{ color: 'text.secondary' }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}><CircularProgress color="primary" /></TableCell></TableRow>
                  ) : filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      handleOpenEdit={handleOpenEdit}
                      handleDeleteClick={handleDeleteClick}
                    />
                  ))}
                  {!loading && filteredProducts.length === 0 && (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>لا توجد منتجات</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ============ Pagination Controls ============ */}
            <Stack direction="row" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowForwardIosIcon sx={{ fontSize: '12px !important' }} />}
                onClick={handlePrevPage}
                disabled={page === 1 || loading}
                sx={{ color: 'primary.main', borderColor: 'rgba(212, 165, 116, 0.3)' }}
              >
                السابق
              </Button>

              <Typography sx={{ color: 'white' }}>
                الصفحة {page}
              </Typography>

              <Button
                variant="outlined"
                endIcon={<ArrowBackIosIcon sx={{ fontSize: '12px !important' }} />}
                onClick={handleNextPage}
                disabled={!hasMore || loading}
                sx={{ color: 'primary.main', borderColor: 'rgba(212, 165, 116, 0.3)' }}
              >
                التالي
              </Button>
            </Stack>

          </Stack>
        </Box>

        {/* Dialog (Edit / Add) */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(212, 165, 116, 0.3)' } }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(212, 165, 116, 0.1)', color: 'primary.main' }}>
            {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    autoFocus
                    label="اسم المنتج"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' } },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>الأقسام</InputLabel>
                    <Select
                      multiple
                      value={formData.categoryIds}
                      onChange={handleCategoryChange}
                      input={<OutlinedInput label="الأقسام" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const cat = categories.find(c => c.id === value);
                            return <Chip key={value} label={cat ? cat.name : value} size="small" sx={{ bgcolor: 'primary.dark', color: 'white' }} />;
                          })}
                        </Box>
                      )}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 165, 116, 0.3)' },
                        '& svg': { color: 'white' }
                      }}
                      MenuProps={{ PaperProps: { sx: { bgcolor: '#252019', color: 'white' } } }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                label="الوصف"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(212, 165, 116, 0.3)' } },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />

              {/* Variants Section */}
              <Box sx={{ p: 2, border: '1px dashed rgba(212, 165, 116, 0.3)', borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>الأحجام والأسعار</Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addVariant} sx={{ color: 'white' }}>إضافة حجم</Button>
                </Stack>

                {formData.variants.map((variant, index) => (
                  <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="الحجم"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        size="small" fullWidth
                        sx={{ input: { color: 'white' }, '& label': { color: '#aaa' }, '& fieldset': { borderColor: '#444' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        label="السعر"
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        size="small" fullWidth
                        sx={{ input: { color: 'white' }, '& label': { color: '#aaa' }, '& fieldset': { borderColor: '#444' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                      <TextField
                        label="بعد الخصم"
                        type="number"
                        value={variant.discount_price}
                        onChange={(e) => handleVariantChange(index, 'discount_price', e.target.value)}
                        size="small" fullWidth
                        sx={{ input: { color: 'white' }, '& label': { color: '#aaa' }, '& fieldset': { borderColor: '#444' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 1 }}>
                      <IconButton onClick={() => removeVariant(index)} color="error">
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Box>

              {/* ============ Image Upload & Preview Section ============ */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2 }}>صور المنتج</Typography>

                <Grid container spacing={2}>
                  {existingImages.map((url, index) => (
                    <Grid key={`existing-${index}`}>
                      <Box sx={{ position: 'relative', width: 100, height: 100, borderRadius: 2, overflow: 'hidden', border: '1px solid #D4A574' }}>
                        <img
                          src={url.startsWith('http') ? url : `${API_URL}${url}`}
                          alt="existing"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeExistingImage(index)}
                          sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#ff4444', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'rgba(212, 165, 116, 0.8)', color: 'black', fontSize: '10px', textAlign: 'center' }}>
                          مسجلة
                        </Box>
                      </Box>
                    </Grid>
                  ))}

                  {newFiles.map((file, index) => (
                    <Grid key={`new-${index}`}>
                      <Box sx={{ position: 'relative', width: 100, height: 100, borderRadius: 2, overflow: 'hidden', border: '2px dashed #4caf50' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="new"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeNewFile(index)}
                          sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: '#ff4444', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: '#4caf50', color: 'white', fontSize: '10px', textAlign: 'center' }}>
                          جديدة
                        </Box>
                      </Box>
                    </Grid>
                  ))}

                  <Grid>
                    <Button
                      component="label"
                      sx={{
                        width: 100, height: 100, borderRadius: 2,
                        border: '1px dashed #D4A574',
                        display: 'flex', flexDirection: 'column',
                        color: '#D4A574',
                        '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.1)' }
                      }}
                    >
                      <AddPhotoAlternateIcon sx={{ fontSize: 30, mb: 1 }} />
                      <Typography variant="caption">إضافة</Typography>
                      <input type="file" hidden multiple accept="image/*" onChange={handleFileSelect} />
                    </Button>
                  </Grid>
                </Grid>
              </Box>

            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(212, 165, 116, 0.1)' }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>إلغاء</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : (editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{ sx: { bgcolor: '#252019', color: 'text.primary', border: '1px solid rgba(239, 68, 68, 0.3)' } }}
        >
          <DialogTitle sx={{ color: 'error.main' }}>تأكيد الحذف</DialogTitle>
          <DialogContent>
            <Typography>هل أنت متأكد من حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: 'text.secondary' }}>إلغاء</Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error">حذف</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default DashboardProducts;