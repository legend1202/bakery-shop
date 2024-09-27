import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { useGetProductListsByUser } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';

import ProductList from '../product-list';

// ----------------------------------------------------------------------

export default function PurchaseView() {
  const settings = useSettingsContext();

  const { products, productsLoading } = useGetProductListsByUser();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      {/* <CartIcon totalItems={0} /> */}

      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Shop
      </Typography>

      <ProductList products={products} loading={productsLoading} />
    </Container>
  );
}
