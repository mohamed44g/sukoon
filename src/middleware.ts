import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export const config = {
  // تحديد الصفحات التي ينطبق عليها الميدل وير
  matcher: '/dashboard/:path*',
};

export async function middleware(request: NextRequest) {
  // 1. جلب التوكن (تأكد أن الاسم auth_token يطابق ما يتم تخزينه في الـ Login)
  const token = request.cookies.get('auth_token')?.value;

  // 2. التحقق المبدئي: إذا لم يوجد توكن، حول المستخدم لصفحة الدخول
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secretStr = process.env.JWT_SECRET;
    console.log("Middleware Secret being used:", secretStr); // 👈 ضيف السطر ده وشوف الكونسول

    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token || "", secret, {
      algorithms: ['HS256'],
    });
    
    // 4. التحقق من الصلاحيات (Role)
    const role = payload.role as string;

    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      // توجيه للصفحة الرئيسية إذا لم يكن أدمن
      return NextResponse.redirect(new URL('/error?code=403', request.url));
    }

    // 5. السماح بالدخول
    return NextResponse.next();

  } catch (error) {
    // في حالة أن التوكن منتهي أو غير صالح (مضروب)
    console.log("Token Verification Failed:", error);
    return NextResponse.redirect(new URL('/error?code=401', request.url));
  }
}