import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { IconButton, SvgIcon } from '@mui/material';

// أيقونة تيك توك مخصصة (لأنها غير موجودة في MUI Icons)
const TikTokIcon = (props: any) => (
    <SvgIcon {...props}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </SvgIcon>
);

const SocialMediaLinks = () => {
    // 1. تعريف المصفوفة (Array) بالبيانات والروابط
    const socialLinks = [
        {
            name: 'Facebook',
            icon: FacebookIcon,
            url: 'https://www.facebook.com/share/1Qx7zxR9Kb/', // ضع رابط فيسبوك هنا
            color: '#1877F2', // لون اختياري لو حابب تلونهم
        },
        {
            name: 'Instagram',
            icon: InstagramIcon,
            url: 'https://www.instagram.com/sukon_perfumes?igsh=MWRwem5xamkyaHR0MQ==', // ضع رابط انستجرام هنا
            color: '#E4405F',
        },
        {
            name: 'TikTok',
            icon: TikTokIcon,
            url: 'https://www.tiktok.com/@sukoon.perfumes4', // ضع رابط تيك توك هنا
            color: '#000000',
        },
        {
            name: 'WhatsApp',
            icon: WhatsAppIcon,
            url: 'https://wa.me/+201060055166', // ضع رقم الواتساب هنا
            color: '#25D366',
        },
    ];

    return (
        <div>
            {/* 2. عرض المصفوفة */}
            {socialLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                    <IconButton
                        key={index}
                        component="a"        // تحويل الزر لرابط
                        href={item.url}      // الرابط
                        target="_blank"      // فتح في صفحة جديدة
                        rel="noopener noreferrer" // لأمان المتصفح
                        aria-label={item.name}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.secondary',
                            mr: 1, // مسافة بين الايقونات
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                // نستخدم اللون الخاص بكل منصة عند الهافر أو اللون الأساسي
                                bgcolor: item.color,
                                borderColor: item.color,
                                color: 'white',
                                transform: 'translateY(-3px)', // حركة بسيطة للأعلى
                            },
                        }}
                    >
                        <Icon fontSize="small" />
                    </IconButton>
                );
            })}
        </div>
    );
};

export default SocialMediaLinks;