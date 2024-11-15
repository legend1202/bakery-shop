import Container from '@mui/material/Container';

import { useTranslate } from 'src/locales';
import { useGetUserById } from 'src/api/admin';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserEditForm from '../uwer-edit-form';

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { currentUser } = useGetUserById(id);

  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('PERSONAL')}
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserEditForm currentUser={currentUser} />
    </Container>
  );
}
