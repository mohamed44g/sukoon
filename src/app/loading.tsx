// src/app/products/[productId]/loading.tsx
import { Box, Skeleton, Container, Grid } from '@mui/material';

export default function Loading() {
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid size = {{xs: 12, md: 6}} >
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
        </Grid>
        <Grid size = {{xs: 12, md: 6}}>
          <Skeleton variant="text" height={60} width="80%" />
          <Skeleton variant="text" height={30} width="40%" />
          <Skeleton variant="rectangular" height={100} sx={{ mt: 4 }} />
        </Grid>
      </Grid>
    </Container>
  );
}