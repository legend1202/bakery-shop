import { Helmet } from 'react-helmet-async';

import { CheckoutView } from 'src/sections/sale/view';

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  return (
    <>
      <Helmet>
        <title> Management: Purchase</title>
      </Helmet>

      <CheckoutView />
    </>
  );
}
