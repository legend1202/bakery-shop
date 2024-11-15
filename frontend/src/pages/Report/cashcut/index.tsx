import { Helmet } from 'react-helmet-async';

import { ReportCashCutView } from 'src/sections/report/cashcut/view';

// ----------------------------------------------------------------------

export default function ReportCashCutPage() {
  return (
    <>
      <Helmet>
        <title> Report: Cashcut</title>
      </Helmet>

      <ReportCashCutView />
    </>
  );
}
