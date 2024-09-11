import { Helmet } from 'react-helmet-async';

import { InventoryProductListView } from 'src/sections/inventory/product/view';

// ----------------------------------------------------------------------

export default function ProductInventoryPage() {
  return (
    <>
      <Helmet>
        <title> Inventory: Product</title>
      </Helmet>

      <InventoryProductListView />
    </>
  );
}
