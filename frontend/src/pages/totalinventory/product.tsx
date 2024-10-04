import { Helmet } from 'react-helmet-async';

import { InventoryProductListView } from 'src/sections/totalinventory/product/view';

// ----------------------------------------------------------------------

export default function ProductInventoryPage() {
  return (
    <>
      <Helmet>
        <title> Total: Product</title>
      </Helmet>

      <InventoryProductListView />
    </>
  );
}
