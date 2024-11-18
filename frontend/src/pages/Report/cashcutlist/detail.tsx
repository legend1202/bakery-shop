import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { ReportCashCutDetailView } from 'src/sections/report/cashcutlist/view';

// ----------------------------------------------------------------------

export default function ReportCashCutDetailPage() {
  const params = useParams();

  const { saleDate } = params;
  return (
    <>
      <Helmet>
        <title> Report: Cashcut Detail</title>
      </Helmet>

      <ReportCashCutDetailView saleDate={`${saleDate}`} />
    </>
  );
}
