import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

// import { useMockedUser } from "src/hooks/use-mocked-user";

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  // const { user } = useMockedUser();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: "center",
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: "relative" }}>Marco Campos</Box>
      </Stack>
    </Stack>
  );
}
