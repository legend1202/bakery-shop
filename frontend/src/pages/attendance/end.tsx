import { Helmet } from 'react-helmet-async';

import { ShiftEndView } from 'src/sections/attendence/view';

// ----------------------------------------------------------------------

export default function EndShiftPage() {
  return (
    <>
      <Helmet>
        <title> Shift: End</title>
      </Helmet>

      <ShiftEndView />
    </>
  );
}
