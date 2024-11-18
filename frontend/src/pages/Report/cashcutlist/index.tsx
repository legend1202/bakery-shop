import { Helmet } from 'react-helmet-async';

import { ReportCashCutListView } from 'src/sections/report/cashcutlist/view';
// ----------------------------------------------------------------------

export default function ReportCashCutListPage() {
  return (
    <>
      <Helmet>
        <title> Report: CashcutList</title>
      </Helmet>

      <ReportCashCutListView />
    </>
  );
}
