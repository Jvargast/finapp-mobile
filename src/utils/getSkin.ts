import { BANK_SKINS } from "../constants/bankSkins";
import { Account } from "../types/account.types";
import { BankSkin } from "../types/skin.types";

export const getSkin = (acc: Account): BankSkin => {
  if (acc.skinId && BANK_SKINS[acc.skinId as keyof typeof BANK_SKINS]) {
    return BANK_SKINS[acc.skinId as keyof typeof BANK_SKINS] as BankSkin;
  }

  if (acc.color && BANK_SKINS[acc.color as keyof typeof BANK_SKINS]) {
    return BANK_SKINS[acc.color as keyof typeof BANK_SKINS] as BankSkin;
  }

  if (acc.color && acc.color.startsWith("#")) {
    return {
      ...BANK_SKINS.DEFAULT,
      type: "color",
      value: acc.color,
      logoAsset: null,
    } as unknown as BankSkin;
  }

  return {
    ...BANK_SKINS.DEFAULT,
    type: "color",
    value: "#1E293B",
    logoAsset: null,
    textColor: "white",
  } as unknown as BankSkin;
};
