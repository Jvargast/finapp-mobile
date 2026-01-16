import { BANK_SKINS } from "./bankSkins";

export const BANK_CATALOG = {
  CL: {
    label: "Chile",
    banks: [
      {
        id: "SANTANDER",
        name: "Banco Santander",
        logo: require("../../assets/logos/santander.jpeg"), 
        products: {
          debit: [
            {
              id: "SANTANDER_RED",
              label: "Débito Life",
              skin: BANK_SKINS.SANTANDER_RED,
            },
            {
              id: "SANTANDER_SELECT",
              label: "Débito Select",
              skin: BANK_SKINS.SANTANDER_SELECT,
            },
            {
              id: "SANTANDER_MASLUCAS",
              label: "Más Lucas",
              skin: BANK_SKINS.SANTANDER_MASLUCAS,
            },
          ],
          credit: [
            {
              id: "SANTANDER_BLACK",
              label: "World Member",
              skin: BANK_SKINS.SANTANDER_BLACK, 
            },
          ],
        },
      },

      {
        id: "BANCO_CHILE",
        name: "Banco de Chile",
        logo: require("../../assets/logos/bancochile.jpeg"),
        products: {
          debit: [
            {
              id: "BCH_BLUE",
              label: "Cuenta Fan / Corriente",
              skin: BANK_SKINS.BCH_BLUE,
            },
          ],
          credit: [], 
        },
      },
    ],
  },
  // AR: { ... } // Argentina
};
