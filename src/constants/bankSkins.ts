export const BANK_SKINS = {
  SANTANDER_RED: {
    id: "SANTANDER_RED",
    name: "Débito Life",
    type: "gradient",
    colors: ["#EC0000", "#AA0000"],
    start: [0, 0],
    end: [1, 1],
    logoAsset: require("../../assets/logos/Santander.png"),
    textColor: "white",
  },

  SANTANDER_SELECT: {
    id: "SANTANDER_SELECT",
    name: "Débito Select",
    type: "gradient",
    colors: ["#374151", "#111827", "#000000"],
    start: [0, 0],
    end: [0, 1],
    logoAsset: require("../../assets/logos/Santander.png"),
    textColor: "#F3F4F6",
  },

  SANTANDER_MASLUCAS: {
    id: "SANTANDER_MASLUCAS",
    name: "Más Lucas",
    type: "gradient",
    colors: ["#1A1A1A", "#D90000"],
    start: [0, 0],
    end: [1, 1],
    logoAsset: require("../../assets/logos/Santander.png"),
    textColor: "white",
  },

  SANTANDER_BLACK: {
    id: "SANTANDER_BLACK",
    name: "World Member",
    type: "gradient",
    colors: ["#2d2d2d", "#000000"],
    start: [0, 0],
    end: [0, 1],
    logoAsset: require("../../assets/logos/Santander.png"),
    textColor: "#E5E7EB",
  },

  BCH_BLUE: {
    id: "BCH_BLUE",
    name: "Banco de Chile",
    type: "gradient",
    colors: ["#002464", "#001030"],
    start: [0, 0],
    end: [1, 1],
    logoAsset: require("../../assets/logos/BancoChile_titulo_2.png"),
    textColor: "white",
  },

  DEFAULT: {
    id: "DEFAULT",
    name: "Cuenta",
    type: "color",
    colors: ["#000000", "#000000"],
    start: [0, 0],
    end: [0, 0],
    logoAsset: null,
    textColor: "white",
  },
};
