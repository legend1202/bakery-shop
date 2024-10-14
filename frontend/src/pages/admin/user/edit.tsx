import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { UserEditView } from 'src/sections/admin/users/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Admin: Users</title>
      </Helmet>

      <UserEditView id={`${id}`} />
    </>
  );
}
