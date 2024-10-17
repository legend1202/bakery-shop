import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { useGetProductListsByUser } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';

import CartIcon from '../cart-icon';
import ProductList from '../product-list';
import { useCheckoutContext } from '../context';

// ----------------------------------------------------------------------

export default function PurchaseView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const { products, productsLoading } = useGetProductListsByUser();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.totalItems} />

      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Productos
      </Typography>

      <ProductList products={products} loading={productsLoading} />
    </Container>
  );
}
