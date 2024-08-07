import { Helmet } from 'react-helmet-async';

import { UserListView } from 'src/sections/admin/users/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Admin: Users</title>
      </Helmet>

      <UserListView />
    </>
  );
}
