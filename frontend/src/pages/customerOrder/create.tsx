import { Helmet } from 'react-helmet-async';

import { CustomerOrderCreateView } from 'src/sections/customerOrder/view';
// ----------------------------------------------------------------------

export default function CustomerOrderCreatePage() {
  return (
    <>
      <Helmet>
        <title> Management: Customer Order</title>
      </Helmet>

      <CustomerOrderCreateView />
    </>
  );
}
