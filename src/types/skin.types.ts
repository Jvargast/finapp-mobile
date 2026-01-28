export interface BaseSkin {
  id: string;
  name: string;
  logoAsset: any;
  textColor: string;
}

export interface GradientSkin extends BaseSkin {
  type: "gradient";
  colors: string[];
  start: number[];
  end: number[];
}

export interface SolidSkin extends BaseSkin {
  type: "color";
  value: string;
}

export type BankSkin = GradientSkin | SolidSkin;
