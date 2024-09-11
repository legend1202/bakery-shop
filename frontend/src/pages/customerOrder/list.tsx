import { Helmet } from 'react-helmet-async';

import { CustomerOrderListView } from 'src/sections/customerOrder/view';

// ----------------------------------------------------------------------

export default function CustomerOrderListPage() {
  return (
    <>
      <Helmet>
        <title> Management: Customer Order</title>
      </Helmet>

      <CustomerOrderListView />
    </>
  );
}
