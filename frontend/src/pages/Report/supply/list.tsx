import { Helmet } from 'react-helmet-async';

import { ReportSupplyView } from 'src/sections/report/supply/view';

// ----------------------------------------------------------------------

export default function SupplyListPage() {
  return (
    <>
      <Helmet>
        <title> Report: Product</title>
      </Helmet>

      <ReportSupplyView />
    </>
  );
}
