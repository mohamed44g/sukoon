import { cookies } from 'next/headers';
import { offersApi } from '@/services/api';
import OffersClient from './OffersClient';

export default async function OffersDashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let initialOffers: any[] = [];

    try {
        // جلب الصفحة الأولى من العروض بشكل أولي
        initialOffers = await offersApi.getAll(1);
    } catch (error) {
        console.error("Failed to fetch initial dashboard offers data", error);
    }

    return <OffersClient initialOffers={initialOffers} />;
}