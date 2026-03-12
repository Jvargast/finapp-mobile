export const SUBSCRIPTION_PRODUCTS = {
  INDIVIDUAL: {
    title: "Individual",
    description: "Para tu crecimiento personal.",
    MONTHLY: {
      id: "wou_plus_monthly",
      price: "$2.990",
      period: "/ mes",
      label: null,
    },
    YEARLY: {
      id: "wou_plus_yearly",
      price: "$29.990",
      period: "/ año",
      label: "AHORRA 17%",
    },
  },
  FAMILY: {
    title: "Familiar",
    description: "Para ti y hasta 5 personas más.",
    MONTHLY: {
      id: "wou_family_monthly",
      price: "$4.990",
      period: "/ mes",
      label: null,
    },
    YEARLY: {
      id: "wou_family_yearly",
      price: "$49.990",
      period: "/ año",
      label: "AHORRA 17%",
    },
  },
};

export const COMPARISON_DATA = [
  {
    category: "Cuentas & Automatización",
    features: [
      {
        name: "Cuentas Sincronizadas",
        free: "Máx 3",
        pro: "Ilimitadas",
      },
      {
        name: "Setup Automático de Cuentas",
        free: "❌",
        pro: "✅",
      },
      {
        name: "Sincronización por Período",
        free: "❌",
        pro: "✅ Hasta 90 días",
      },
      {
        name: "Reglas Bancarias",
        free: "❌",
        pro: "✅",
      },
    ],
  },
  {
    category: "Colaboración",
    features: [
      {
        name: "Presupuestos Compartidos",
        free: "Limitado",
        pro: "✅",
      },
      {
        name: "Plan Pareja / Familiar",
        free: "❌",
        pro: "dynamic_collaboration",
      },
    ],
  },
  {
    category: "Control Premium",
    features: [
      {
        name: "Editar Cuentas en Efectivo",
        free: "❌",
        pro: "✅",
      },
    ],
  },
];
