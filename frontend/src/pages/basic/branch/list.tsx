import { Helmet } from "react-helmet-async";

import { BranchListView } from "src/sections/basic/branch/view";

// ----------------------------------------------------------------------

export default function BranchListPage() {
  return (
    <>
      <Helmet>
        <title> Basic: Branch</title>
      </Helmet>

      <BranchListView />
    </>
  );
}
