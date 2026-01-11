'use client';
import { useRef, useEffect, useState, ReactNode, ElementType } from 'react';

interface FadeInUpProps {
  children: ReactNode;
  delay?: number; // التأخير بالثواني
  duration?: number; // المدة بالثواني (اختياري، لأننا حددناها في CSS)
  className?: string;
  tag?: ElementType;
  sx?: any // نوع العنصر (div, section, li, etc.)
}

export default function FadeInUp({ 
  children, 
  delay = 0, 
  className = '',
  tag: Component = 'div',
  sx// الافتراضي div
}: FadeInUpProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // توقف عن المراقبة بعد الظهور (Once: true)
        }
      },
      {
        threshold: 0.1, // يظهر عندما يبان 10% منه
        rootMargin: '50px', // يبدأ التحميل قبل ما يدخل الشاشة بشوية
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <Component
      ref={ref}
      className={`fade-up-element ${isInView ? 'in-view' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        ...sx // تطبيق التأخير
      }}
    >
      {children}
    </Component>
  );
}