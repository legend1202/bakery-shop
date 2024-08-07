import { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import { useAuthContext } from "src/auth/hooks";

import { useSettingsContext } from "src/components/settings";

import Main from "./main";
import Header from "./header";
import NavMini from "./nav-mini";
import NavVertical from "./nav-vertical";
import NavHorizontal from "./nav-horizontal";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const { user } = useAuthContext();
  const settings = useSettingsContext();

  const [isClient, setClient] = useState(false);

  const lgUp = useResponsive("up", "lg");

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === "horizontal";

  const isMini = settings.themeLayout === "mini";

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
    <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
  );

  useEffect(() => {
    if (user?.role === "CLIENT") {
      setClient(true);
    }
  }, [user]);

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {!isClient && lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {!isClient && lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {!isClient && renderNavVertical}

        <Main>{children}</Main>
      </Box>
    </>
  );
}
