'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'; // 1. استيراد Suspense
import ErrorView from '@/components/ErrorView';

// 2. فصلنا المنطق في مكون فرعي
const ErrorContent = () => {
  const searchParams = useSearchParams();
  
  const code = searchParams.get('code') ? parseInt(searchParams.get('code')!) : 500;
  const msg = searchParams.get('msg') || undefined;

  return <ErrorView statusCode={code} message={msg} />;
};

// 3. المكون الرئيسي يقوم بتغليف المكون الفرعي بـ Suspense
const ErrorPage = () => {
  return (
    // الـ fallback يظهر لحظياً حتى يتم تحميل الرابط وقراءة الباراميترز
    <Suspense fallback={<div>Loading error details...</div>}>
      <ErrorContent />
    </Suspense>
  );
};

export default ErrorPage;