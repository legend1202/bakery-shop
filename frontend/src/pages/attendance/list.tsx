import { Helmet } from 'react-helmet-async';

import { AttendanceListView } from 'src/sections/attendence/view';

// ----------------------------------------------------------------------

export default function AttendanceMngPage() {
  return (
    <>
      <Helmet>
        <title> Management: Attendance</title>
      </Helmet>

      <AttendanceListView />
    </>
  );
}
