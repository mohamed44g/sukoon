'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, ProductVariant, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number, type: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sukoon_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // 1. نبدأ بـ Array فارغة لتجنب مشاكل السيرفر
  const [items, setItems] = useState<CartItem[]>([]);
  // 2. متغير حالة للتأكد من أن الكارت تم تحميلها من المتصفح
  const [isInitialized, setIsInitialized] = useState(false);

  // useEffect 1: تحميل البيانات عند فتح الموقع (يعمل مرة واحدة فقط)
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load cart', error);
      } finally {
        // نعلن أن التهيئه انتهت سواء وجدنا داتا أو لا
        setIsInitialized(true);
      }
    };

    loadCart();
  }, []);

  // useEffect 2: حفظ البيانات عند حدوث أي تغيير (يعمل فقط بعد التهيئه)
  useEffect(() => {
    // شرط مهم جداً: لا تحفظ إلا لو تأكدنا إننا حملنا الداتا القديمة الأول
    // عشان ميمسحش الداتا ويحط مكانها مصفوفة فاضية
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number, type: string = "product") => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.size === variant.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, selectedVariant: variant, quantity, type }];
    });
  };

  const removeFromCart = (productId: number, size: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedVariant.size === size))
    );
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    // التغيير هنا هيسمع في الـ useEffect رقم 2 وهيمسح الـ localStorage
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    // التحقق من وجود سعر الخصم واستخدامه، وإلا استخدام السعر الأصلي
    const price = item.selectedVariant.discount_price ?? item.selectedVariant.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};