import { Helmet } from 'react-helmet-async';

import { MngSupplyListView } from 'src/sections/mng/supply/view';

// ----------------------------------------------------------------------

export default function SupplyListPage() {
  return (
    <>
      <Helmet>
        <title> Management: Supply</title>
      </Helmet>

      <MngSupplyListView />
    </>
  );
}
