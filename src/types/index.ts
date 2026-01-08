// Product Variant (Size with pricing)
export interface ProductVariant {
  size: string;
  price: number;
  discount_price: number | null;
}

// Product
export interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  categoryIds?: number[];
  relatedProducts? : Product[]
}

// Category
export interface Category {
  id: number;
  name: string;
  image_url: string;
}

// Order Item
export interface OrderItem {
  productId: number;
  size: string;
  quantity: number;
  price: number;
}

// Order
export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  createdAt?: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Create Order Request
export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
}

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

// Admin
export interface Admin {
  id: number;
  email: string;
  name: string;
}

// Analytics Dashboard
export interface DashboardSummary {
  total_orders: number;
  total_revenue: number;
  low_stock_alert_count: number;
}

export interface DailyRevenue {
  date: string;
  daily_revenue: number;
}

export interface TopSellingProduct {
  id: number;
  name: string;
  total_sold: number;
}

export interface TopViewedProduct {
  id: number;
  name: string;
  views_this_month: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
}

export interface TopCustomer {
  customer_name: string;
  customer_phone: string;
  orders_count: number;
  total_spent: number;
}


// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Cart Item
export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (
  originalPrice: number,
  discountPrice: number | null
): number | null => {
  if (!discountPrice || discountPrice >= originalPrice) return null;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

// Helper to get display price
export const getDisplayPrice = (variant: ProductVariant): number => {
  return variant.discount_price ?? variant.price;
};


export interface DashboardData {
  period: string;
  summary: {
    total_orders: string;
    total_revenue: string;
    low_stock_alert_count?: number; // اختياري لو مش موجود في الريسبونس
  };
  charts: {
    last_7_days_revenue: {
      date: string;
      daily_revenue: string;
    }[];
  };
  tables: {
    top_selling: {
      id: number;
      name: string;
      main_image: string;
      total_sold: string;
    }[];
    top_viewed: {
      id: number;
      name: string;
      main_image: string;
      views_this_month: string;
    }[];
    top_customers: {
      customer_name: string;
      customer_phone: string;
      orders_count: string;
      total_spent: string;
    }[];
  };
}