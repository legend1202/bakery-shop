import { Helmet } from "react-helmet-async";

import { ProductListView } from "src/sections/basic/product/view";

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Basic: Product</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
