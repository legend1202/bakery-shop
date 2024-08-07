import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/admin/users/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Admin: Users</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
