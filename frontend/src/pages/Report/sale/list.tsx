import { Helmet } from 'react-helmet-async';

import { ReportSaleView } from 'src/sections/report/sale/view';

// ----------------------------------------------------------------------

export default function SupplyListPage() {
  return (
    <>
      <Helmet>
        <title> Report: Sale</title>
      </Helmet>

      <ReportSaleView />
    </>
  );
}
