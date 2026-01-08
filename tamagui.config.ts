import { createTamagui } from "tamagui";
import { config as configBase } from "@tamagui/config/v3";

const tokens = {
  ...configBase.tokens,
  color: {
    ...configBase.tokens.color,
    brand: "#4F46E5", 
    white: "#FFFFFF", 
  },
};

const config = createTamagui({
  ...configBase,
  tokens,
});

export type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
