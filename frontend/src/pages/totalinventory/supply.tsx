import { Helmet } from 'react-helmet-async';

import { InventorySupplyListView } from 'src/sections/totalinventory/supply/view';

// ----------------------------------------------------------------------

export default function SupplyInventoryPage() {
  return (
    <>
      <Helmet>
        <title> Total: Supply</title>
      </Helmet>

      <InventorySupplyListView />
    </>
  );
}
