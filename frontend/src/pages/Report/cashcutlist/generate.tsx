import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { ReportCashcutGenerateView } from 'src/sections/report/cashcutlist/view';
// ----------------------------------------------------------------------

export default function ReportCashcutGeneratePage() {
  const params = useParams();

  const { saleDate } = params;
  return (
    <>
      <Helmet>
        <title> Report: Cashcut Ggenerate</title>
      </Helmet>

      <ReportCashcutGenerateView saleDate={`${saleDate}`} />
    </>
  );
}
