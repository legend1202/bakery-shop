import { Helmet } from 'react-helmet-async';

import { ProductListView } from 'src/sections/report/product/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Report: Product</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
