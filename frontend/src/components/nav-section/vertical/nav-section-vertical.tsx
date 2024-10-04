import { memo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_REGISTER } from 'src/config-global';

import NavList from './nav-list';
import { NavProps, NavGroupProps } from '../types';
// ----------------------------------------------------------------------

function NavSectionVertical({ data, slotProps, ...other }: NavProps) {
  const [userRole, setUserRole] = useState('');
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user?.role) {
      setUserRole(user?.role);
    } else {
      router.push(PATH_AFTER_REGISTER);
    }
  }, [user, data, router]);

  return (
    userRole && (
      <Stack component="nav" id="nav-section-vertical" {...other}>
        {data.map((group, index) => (
          <Group
            key={group.subheader || index}
            subheader={group.subheader}
            roles={group.roles}
            color={group.color}
            userRole={userRole}
            items={group.items}
            slotProps={slotProps}
          />
        ))}
      </Stack>
    )
  );
}

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

function Group({ subheader, roles, color, userRole, items, slotProps }: NavGroupProps) {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderContent = items.map((list) => (
    <NavList key={list.title} data={list} userRole={userRole} depth={1} slotProps={slotProps} />
  ));

  if (roles && userRole) {
    const isUserRolePresent = roles.includes(userRole);

    if (isUserRolePresent) {
      return (
        <Stack sx={{ px: 2 }}>
          {subheader ? (
            <>
              <ListSubheader
                disableGutters
                disableSticky
                onClick={handleToggle}
                sx={{
                  fontSize: 11,
                  cursor: 'pointer',
                  typography: 'overline',
                  display: 'inline-flex',
                  color,
                  mb: `${slotProps?.gap || 4}px`,
                  p: (theme) => theme.spacing(2, 1, 1, 1.5),
                  transition: (theme) =>
                    theme.transitions.create(['color'], {
                      duration: theme.transitions.duration.shortest,
                    }),
                  '&:hover': {
                    color: 'text.primary',
                  },
                  ...slotProps?.subheader,
                }}
              >
                {subheader}
              </ListSubheader>

              <Collapse in={open}>{renderContent}</Collapse>
            </>
          ) : (
            renderContent
          )}
        </Stack>
      );
    }
  }
}
