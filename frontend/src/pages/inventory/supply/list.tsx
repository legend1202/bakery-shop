import { Helmet } from 'react-helmet-async';

import { InventorySupplyListView } from 'src/sections/inventory/supply/view';

// ----------------------------------------------------------------------

export default function SupplyInventoryPage() {
  return (
    <>
      <Helmet>
        <title> Inventory: Supply</title>
      </Helmet>

      <InventorySupplyListView />
    </>
  );
}
