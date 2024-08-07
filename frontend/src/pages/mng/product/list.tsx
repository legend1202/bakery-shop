import { Helmet } from 'react-helmet-async';

import { MngProductListView } from 'src/sections/mng/product/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Management: Product</title>
      </Helmet>

      <MngProductListView />
    </>
  );
}
