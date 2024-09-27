import { Helmet } from 'react-helmet-async';

import { PurchaseView } from 'src/sections/sale/view';

// ----------------------------------------------------------------------

export default function SaleMngPage() {
  return (
    <>
      <Helmet>
        <title> Management: Purchase</title>
      </Helmet>

      <PurchaseView />
    </>
  );
}
