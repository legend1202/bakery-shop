import { Helmet } from 'react-helmet-async';

import { CustomProductListView } from 'src/sections/report/customproduct/view';

// ----------------------------------------------------------------------

export default function CustomProductListPage() {
  return (
    <>
      <Helmet>
        <title> Report: Custom Product</title>
      </Helmet>

      <CustomProductListView />
    </>
  );
}
