import { adminsApi } from '@/services/api';
import AdminsClient from './AdminsClient';
import { cookies } from 'next/headers';

export default async function AdminsPage() {
    const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  let admins : any= [];

  try {
    // جلب القائمة من الباك إند
    admins = await adminsApi.getAll({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Failed to fetch admins:", error);
  }

  return <AdminsClient initialAdmins={admins} />;
}