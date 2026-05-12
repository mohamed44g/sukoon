'use client';
import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeInUp from '@/components/FadeInUp';
import Image from 'next/image';

export default function AboutPageClient() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
                {/* خلفية زخرفية هادئة */}
                <Box className="pattern-ornament" sx={{ position: 'absolute', inset: 0, opacity: 0.03 }} />
                <Box sx={{ position: 'absolute', top: '10%', right: -100, width: 400, height: 400, bgcolor: 'primary.main', opacity: 0.03, borderRadius: '50%', filter: 'blur(80px)' }} />
                <Box sx={{ position: 'absolute', bottom: '10%', left: -100, width: 300, height: 300, bgcolor: 'primary.main', opacity: 0.03, borderRadius: '50%', filter: 'blur(80px)' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={8} alignItems="center">

                        {/* قسم النص */}
                        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
                            <FadeInUp>
                                <Box sx={{ position: 'relative', pl: { md: 4 } }}>
                                    {/* العنوان */}
                                    <Typography variant="h2" sx={{ fontFamily: '"Amiri", serif', fontWeight: 700, mb: 3, color: 'primary.main' }}>
                                        قصة سكون
                                    </Typography>

                                    {/* فاصل جمالي */}
                                    <Box sx={{ width: 60, height: 3, bgcolor: 'primary.main', mb: 5, borderRadius: 2 }} />

                                    {/* المحتوى النصي */}
                                    <Stack spacing={4}>
                                        <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', lineHeight: 2.2, color: 'text.secondary', fontSize: '1.25rem', textAlign: 'justify' }}>
                                            في عالمٍ يزدحم بالضجيج ويمضي بلا توقّف، وُلدت <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>سكون</Box> لتصنع فرقًا… لا لتتكرر.
                                        </Typography>

                                        <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', lineHeight: 2.2, color: 'text.secondary', fontSize: '1.25rem', textAlign: 'justify' }}>
                                            بدأناها إيمانًا بأن الجمال لا يكتمل إلا بالإتقان، وأن الصدق يظهر في التفاصيل.
                                        </Typography>

                                        <Typography variant="h6" sx={{ fontFamily: '"Amiri", serif', lineHeight: 2.2, color: 'text.secondary', fontSize: '1.25rem', textAlign: 'justify' }}>
                                            نُتقن عملنا ونتقي الله فيه، لأننا نؤمن أن الشغل الحقيقي يثبت نفسه بنفسه.
                                        </Typography>

                                        {/* الاقتباس الختامي */}
                                        <Box sx={{ borderRight: '4px solid', borderColor: 'primary.main', pr: 3, mt: 2 }}>
                                            <Typography variant="h5" sx={{ fontFamily: '"Amiri", serif', lineHeight: 1.6, color: 'text.primary', fontWeight: 700 }}>
                                                سكون ليست اسمًا… بل حالة تأخذك من صخب الحياة إلى هدوءٍ يليق بك.
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </FadeInUp>
                        </Grid>

                        {/* قسم الصورة */}
                        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
                            <FadeInUp delay={0.2}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 400, md: 600 },
                                        width: '100%',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', // ظل قوي للعمق
                                        border: '1px solid rgba(212, 165, 116, 0.2)'
                                    }}
                                >
                                    <Image
                                        // صورة تعبر عن الفخامة والهدوء (يمكنك تغيير الرابط بصورة خاصة بك)
                                        src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200"
                                        alt="فلسفة سكون"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    {/* تدرج لوني فوق الصورة لزيادة وضوح النص لو كان فوقها، ولإعطاء طابع سينمائي */}
                                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26, 22, 17, 0.4), transparent)' }} />
                                </Box>

                                {/* إطار زخرفي خلف الصورة */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 30,
                                        right: 30,
                                        bottom: -30,
                                        left: -30,
                                        border: '2px solid rgba(212, 165, 116, 0.1)',
                                        borderRadius: 8,
                                        zIndex: -1,
                                        display: { xs: 'none', md: 'block' }
                                    }}
                                />
                            </FadeInUp>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}