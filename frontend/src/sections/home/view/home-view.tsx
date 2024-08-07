import { useScroll } from "framer-motion";

import Box from "@mui/material/Box";

import ScrollProgress from "src/components/scroll-progress";

import HomeSplash from "../home-splash";

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />
      <HomeSplash />
      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          bgcolor: "background.default",
        }}
      />
    </>
  );
}
