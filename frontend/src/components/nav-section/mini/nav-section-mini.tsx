import { memo, useState, useEffect } from "react";

import Stack from "@mui/material/Stack";

import { useRouter } from "src/routes/hooks";

import { useAuthContext } from "src/auth/hooks";
import { PATH_AFTER_REGISTER } from "src/config-global";

import NavList from "./nav-list";
import { NavProps, NavGroupProps } from "../types";

// ----------------------------------------------------------------------

function NavSectionMini({ data, slotProps, ...other }: NavProps) {
  const [userRole, setUserRole] = useState("");
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
    <Stack
      component="nav"
      id="nav-section-mini"
      spacing={`${slotProps?.gap || 4}px`}
      {...other}
    >
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          roles={group.roles}
          userRole={userRole}
          items={group.items}
          slotProps={slotProps}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------

function Group({ items, roles, userRole, slotProps }: NavGroupProps) {
  if (roles && userRole) {
    const isUserRolePresent = roles.includes(userRole);

    if (isUserRolePresent) {
      return (
        <>
          {items.map((list) => (
            <NavList
              key={list.title}
              data={list}
              userRole={userRole}
              depth={1}
              slotProps={slotProps}
            />
          ))}
        </>
      );
    }
  }
}
