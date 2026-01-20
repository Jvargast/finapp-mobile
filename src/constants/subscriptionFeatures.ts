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
    category: "Cuentas & Control",
    features: [
      {
        name: "Cuentas Sincronizadas",
        free: "Máx 2",
        pro: "Ilimitadas",
      },
      {
        name: "Categorías",
        free: "Estándar",
        pro: "Emojis + Custom",
      },
      {
        name: "Exportar Datos (Excel)",
        free: "Resumido",
        pro: "Detalle Total",
      },
    ],
  },
  {
    category: "Inteligencia Artificial",
    features: [
      {
        name: "Wou Score (Salud)",
        free: "Básico",
        pro: "Análisis Profundo",
      },
      {
        name: "Proyección de Saldo",
        free: "❌",
        pro: "✅ Futuro IA",
      },
      {
        name: "Detector de Gastos Hormiga",
        free: "❌",
        pro: "✅ Alerta IA",
      },
      {
        name: "Colaboración",
        free: "❌",
        pro: "Modo Pareja",
      },
      {
        name: "Dashboard Unificado",
        free: "❌",
        pro: "dynamic_dashboard",
      },
    ],
  },
  {
    category: "Superpoderes",
    features: [
      {
        name: "Modo Discreto (Privacidad)",
        free: "❌",
        pro: "✅ Shake-to-Hide",
      },
      {
        name: "Candado de Metas",
        free: "❌",
        pro: "✅ Smart Lock",
      },
      {
        name: "Publicidad",
        free: "Con Anuncios",
        pro: "Sin Interrupciones",
      },
    ],
  },
];
