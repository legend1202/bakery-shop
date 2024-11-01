import { Helmet } from 'react-helmet-async';

import { ShiftStartView } from 'src/sections/attendence/view';

// ----------------------------------------------------------------------

export default function StartShiftPage() {
  return (
    <>
      <Helmet>
        <title> Shift: Start</title>
      </Helmet>

      <ShiftStartView />
    </>
  );
}
