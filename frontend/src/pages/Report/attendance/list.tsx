import { Helmet } from 'react-helmet-async';

import { ReportAttendanceView } from 'src/sections/report/attendance/view';

// ----------------------------------------------------------------------

export default function AttendanceReportPage() {
  return (
    <>
      <Helmet>
        <title> Report: Attendance</title>
      </Helmet>

      <ReportAttendanceView />
    </>
  );
}
