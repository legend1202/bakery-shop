import Box, { BoxProps } from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { IProduct } from 'src/types/product';

import ProductItem from './product-item';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  products: IProduct[];
  loading?: boolean;
};

export default function ProductList({ products, loading, ...other }: Props) {
  const renderList = (
    <>{products && products.map((product) => <ProductItem key={product.id} product={product} />)}</>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {renderList}
      </Box>

      {products && products.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
