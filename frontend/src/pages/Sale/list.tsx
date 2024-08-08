import { Helmet } from 'react-helmet-async';

import { SaleMngView } from 'src/sections/sale/view';

// ----------------------------------------------------------------------

export default function SaleMngPage() {
  return (
    <>
      <Helmet>
        <title> Management: Sales</title>
      </Helmet>

      <SaleMngView />
    </>
  );
}
