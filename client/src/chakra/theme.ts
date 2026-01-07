import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    recipes: {},
    slotRecipes: {},
    semanticTokens: {
      colors: {
        mainBg: {
          value: { _light: "{colors.gray.500}", _dark: "{colors.gray.900}" },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: "mainBg",
      color: { _light: "black", _dark: "white" },
    },
  },
});

export default createSystem(defaultConfig, config);
