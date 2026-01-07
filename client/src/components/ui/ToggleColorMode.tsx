import { Button } from "@chakra-ui/react";
import { useColorMode } from "../ui/color-mode";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

export function ToggleColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      _active={{
        transform: "scale(.97)",
      }}
    >
      {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
    </Button>
  );
}
