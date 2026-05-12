import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import type {
  Product,
  Category,
  Order,
  CreateOrderRequest,
  LoginRequest,
  AuthResponse,
  DashboardData,
  Admin,
} from '@/types';

// API Base URL
const API_BASE_URL = 'http://localhost:3000';


// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Cookie Name
const AUTH_COOKIE_NAME = 'auth_token';

// Token management
export const setAuthToken = (token: string | null): void => {
  if (token) {
    // تخزين التوكن في الكوكيز لمدة 7 أيام
    Cookies.set(AUTH_COOKIE_NAME, token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production', // تفعيل الـ Secure في الإنتاج
      sameSite: 'strict'
    });
  } else {
    Cookies.remove(AUTH_COOKIE_NAME);
  }
};

// هذه الدالة تعمل فقط في الـ Client Side
export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_COOKIE_NAME);
};

// Request interceptor to add auth token (Client Side mainly)
apiClient.interceptors.request.use(
  (config) => {
    // نتأكد أننا في المتصفح قبل استخدام js-cookie
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response, // لو الاستجابة سليمة رجعها زي ما هي
  (error) => {
    // لو فيه خطأ، شيك على الكود
    if (error.response) {
      const { status } = error.response;

      // === هنا اللوجيك بتاع الـ 401 ===
      if (status === 401) {
        // ممكن تمسح التوكن هنا لو مخزنه
        // localStorage.removeItem('token'); 

        // توجيه لصفحة الخطأ مع كود 401
        // window.location.href = '/error?code=401'; 

        // أو لو عاوز توديه للوجين علطول:
        // window.location.href = '/login';

        // بس عشان طلبك (صفحة خطأ عامة بتبعت غير مصرح):
        window.location.href = '/error?code=401';
      }

      // لو 403 (ممنوع الصلاحية)
      if (status === 403) {
        window.location.href = '/error?code=403';
      }

      // لو 500 (خطأ سيرفر)
      if (status >= 500) {
        // اختياري: مش لازم تحول الصفحة ممكن تظهر Alert بس
        // window.location.href = '/error?code=500';
      }
    }
    return Promise.reject(error);
  }
);
// Generic request handler
// قمنا بتعديلها لتقبل دمج الـ Configs
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient(config);
  return response.data;
}

// ============ Auth API ============
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await request<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
    setAuthToken(response.access_token);
    return response;
  },

  logout: (): void => {
    setAuthToken(null);
  },
};

// ============ Products API ============
// قمت بإضافة config?: AxiosRequestConfig لكل الدوال
// هذا يسمح لك بتمرير الـ Headers من الـ Server Components
export const productsApi = {
  getAll: async (config?: AxiosRequestConfig): Promise<Product[]> => {
    return request<Product[]>({
      method: 'GET',
      url: '/products',
      ...config, // دمج الإعدادات الإضافية
    });
  },

  getLatest: async (config?: AxiosRequestConfig): Promise<Product[]> => {
    return request<Product[]>({
      method: 'GET',
      url: '/products/latest',
      ...config,
    });
  },

  getById: async (id: number, config?: AxiosRequestConfig): Promise<Product> => {
    console.log("id", id)
    return request<Product>({
      method: 'GET',
      url: `/products/${id}`,
      ...config,
    });
  },

  search: async (query: string, config?: AxiosRequestConfig): Promise<Product[]> => {
    return request<Product[]>({
      method: 'GET',
      url: '/products/search',
      params: { q: query },
      ...config,
    });
  },

  getOffers: async (config?: AxiosRequestConfig): Promise<Product[]> => {
    return request<Product[]>({
      method: 'GET',
      url: '/offers',
      ...config,
    });
  },

  getLatestOffers: async (config?: AxiosRequestConfig): Promise<Product[]> => {
    return request<Product[]>({
      method: 'GET',
      url: '/offers/latest',
      ...config,
    });
  },

  create: async (formData: FormData, config?: AxiosRequestConfig): Promise<Product> => {
    return request<Product>({
      method: 'POST',
      url: '/products',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  },

  update: async (id: number, formData: FormData, config?: AxiosRequestConfig): Promise<Product> => {
    return request<Product>({
      method: 'PATCH',
      url: `/products/${id}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  },

  delete: async (id: number, config?: AxiosRequestConfig): Promise<void> => {
    return request<void>({
      method: 'DELETE',
      url: `/products/${id}`,
      ...config,
    });
  },

  getProductsByCategory: async (id: number, config?: AxiosRequestConfig): Promise<void> => {
    return request<void>({
      method: 'GET',
      url: `/products/category/${id}`,
      ...config,
    });
  },
};

// ============ Categories API ============
export const categoriesApi = {
  getAll: async (config?: AxiosRequestConfig): Promise<Category[]> => {
    return request<Category[]>({
      method: 'GET',
      url: '/categories',
      ...config,
    });
  },

  create: async (formData: FormData, config?: AxiosRequestConfig): Promise<Category> => {
    return request<Category>({
      method: 'POST',
      url: '/categories',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  },

  delete: async (id: number, config?: AxiosRequestConfig): Promise<void> => {
    return request<void>({
      method: 'DELETE',
      url: `/categories/${id}`,
      ...config,
    });
  },
};

// ============ Orders API ============
export const ordersApi = {
  create: async (order: any, config?: AxiosRequestConfig): Promise<Order> => {
    return request<Order>({
      method: 'POST',
      url: '/orders',
      data: order,
      ...config,
    });
  },

  trackByPhone: async (phone: string): Promise<Order[]> => {
    return request<Order[]>({
      method: 'GET',
      url: '/orders/track',
      params: { phone }, // هتبعتها كـ ?phone=01xxxx
    });
  },

  getAll: async (month?: string, config?: AxiosRequestConfig): Promise<Order[]> => {
    return request<Order[]>({
      method: 'GET',
      url: '/orders',
      params: { month }, // سيتم إرساله كـ ?month=2024-01
      ...config,
    });
  },

  getById: async (id: number, config?: AxiosRequestConfig): Promise<Order> => {
    return request<Order>({
      method: 'GET',
      url: `/orders/${id}`,
      ...config,
    });
  },

  updateStatus: async (id: number, status: string, config?: AxiosRequestConfig): Promise<Order> => {
    return request<Order>({
      method: 'PATCH',
      url: `/orders/${id}/status`,
      data: { status },
      ...config,
    });
  },
};

// ============ Analytics API ============
export const analyticsApi = {
  getDashboard: async (config?: AxiosRequestConfig): Promise<DashboardData> => {
    return request<DashboardData>({
      method: 'GET',
      url: '/analytics/dashboard',
      ...config, // هذا السطر مهم جداً لأنه يدمج الـ params
    });
  },

  getCustomers: async (date?: string, config?: AxiosRequestConfig) => {
    return request({
      method: 'GET',
      url: '/analytics/customers',
      params: { date },
      ...config
    });
  },
};

// ============ Admins API ============
// داخل ملف api.ts
export const adminsApi = {
  getAll: async (config?: AxiosRequestConfig) => {
    return request({
      method: 'GET',
      url: '/admins',
      ...config,
    });
  },

  create: async (data: any) => {
    return request({
      method: 'POST',
      url: '/admins',
      data,
    });
  },

  delete: async (id: number) => {
    return request({
      method: 'DELETE',
      url: `/admins/${id}`,
    });
  },
};

export default apiClient;