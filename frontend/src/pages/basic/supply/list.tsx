import { Helmet } from "react-helmet-async";

import { SupplyListView } from "src/sections/basic/supply/view";

// ----------------------------------------------------------------------

export default function SupplyListPage() {
  return (
    <>
      <Helmet>
        <title> Basic: Supply</title>
      </Helmet>

      <SupplyListView />
    </>
  );
}
