import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  Circle,
  Stack,
  Spinner,
  Sheet,
  Separator,
  useThemeName,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Search,
  X,
} from "@tamagui/lucide-icons";
import { PieChart } from "react-native-gifted-charts";
import Svg, { Defs, Pattern, Rect, Mask, Circle as SvgCircle, Line } from "react-native-svg";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { TransactionActions } from "../../actions/transactionActions";
import { CategoryActions } from "../../actions/categoryActions";
import { useTransactionStore } from "../../stores/useTransactionStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { Transaction } from "../../types/transaction.types";
import { getIcon } from "../../utils/iconMap";

type ViewMode = "EXPENSE" | "INCOME";
type MinPercentFilter = 0 | 3 | 5 | 10;
type MaxCategoriesFilter = 5 | 8 | 12;

type LabelPosition = {
  id: string;
  name: string;
  total: number;
  color: string;
  icon?: string;
  category?: Transaction["category"];
  percent: number;
  softColor: string;
  angle: number;
  x: number;
  y: number;
  isTiny: boolean;
  percentLabel: string;
  anchorX: number;
  anchorY: number;
};

type LabelCluster = {
  id: string;
  items: LabelPosition[];
  anchorX: number;
  anchorY: number;
  baseX: number;
  baseY: number;
  percentTotal: number;
  angle: number;
  iconSize?: number;
  blockWidth?: number;
  blockHeight?: number;
  gap?: number;
};

const LIGHT_PALETTE = {
  page: "#FBF8F4",
  surface: "#FFFFFF",
  border: "#E6DFD6",
  muted: "#6B7280",
  ink: "#1F2937",
  accent: "#8BA7F2",
  accentSoft: "#EEF3FF",
  peach: "#FFE6D1",
  peachText: "#C2410C",
  mint: "#DCFCE7",
  mintText: "#15803D",
  hatchStrong: "rgba(255,255,255,0.3)",
  hatchSoft: "rgba(255,255,255,0.16)",
  clusterBg: "rgba(255,255,255,0.35)",
  badgeBg: "#1F2937",
  badgeText: "#FFFFFF",
  emptyPie: "#E5E7EB",
  iconBgFallback: "#EEF2FF",
  mixBase: "#FFFFFF",
  mixAlt: "#0F172A",
};

const DARK_PALETTE = {
  page: "#0B1220",
  surface: "#111827",
  border: "#233044",
  muted: "#94A3B8",
  ink: "#F8FAFC",
  accent: "#A5B4FC",
  accentSoft: "rgba(165,180,252,0.18)",
  peach: "#FB923C",
  peachText: "#FDBA74",
  mint: "#34D399",
  mintText: "#6EE7B7",
  hatchStrong: "rgba(255,255,255,0.14)",
  hatchSoft: "rgba(255,255,255,0.08)",
  clusterBg: "rgba(15,23,42,0.7)",
  badgeBg: "#E2E8F0",
  badgeText: "#0F172A",
  emptyPie: "#334155",
  iconBgFallback: "rgba(148,163,184,0.18)",
  mixBase: "#0F172A",
  mixAlt: "#FFFFFF",
};

const LIGHT_PIE_COLORS = [
  "#9DB8F7",
  "#F6C9A6",
  "#9ADBC0",
  "#C7B9F2",
  "#F4B8C4",
  "#B7D4F1",
  "#F2D48A",
];

const DARK_PIE_COLORS = [
  "#8FB4FF",
  "#F7B983",
  "#6AD2A9",
  "#B9A6FF",
  "#F5A0C2",
  "#7FC8E8",
  "#F0D070",
];

type AnalyticsPalette = typeof LIGHT_PALETTE;
type SegmentOption = { id: string; label: string };

const chunkBy = <T,>(items: readonly T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size) as T[]);
  }
  return chunks;
};

const SegmentControl = ({
  options,
  value,
  onChange,
  columns = 2,
  pastel,
  activeColor,
}: {
  options: readonly SegmentOption[];
  value: string;
  onChange: (id: string) => void;
  columns?: number;
  pastel: AnalyticsPalette;
  activeColor: string;
}) => {
  const rows = chunkBy(options, columns);

  return (
    <YStack
      backgroundColor={pastel.page}
      borderRadius="$5"
      padding="$1.5"
      space="$1.5"
    >
      {rows.map((row, rowIndex) => (
        <XStack key={`row-${rowIndex}`} space="$1.5" justifyContent="center">
          {row.map((option) => {
            const active = value === option.id;
            return (
              <Button
                key={option.id}
                flex={1}
                height={44}
                borderRadius="$3"
                paddingHorizontal="$2"
                paddingVertical="$2.5"
                borderWidth={active ? 0 : 1}
                borderColor={active ? "transparent" : pastel.border}
                backgroundColor={active ? activeColor : pastel.surface}
                onPress={() => onChange(option.id)}
                pressStyle={{ opacity: 0.9, scale: 0.985 }}
              >
                <Text
                  fontSize={12}
                  fontWeight={active ? "800" : "600"}
                  color={active ? "white" : pastel.muted}
                  numberOfLines={1}
                  textAlign="center"
                >
                  {option.label}
                </Text>
              </Button>
            );
          })}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, idx) => (
              <Stack key={`spacer-${rowIndex}-${idx}`} flex={1} />
            ))}
        </XStack>
      ))}
    </YStack>
  );
};

const DONUT_SIZE = 260;
const DONUT_RADIUS = 120;
const DONUT_INNER = 70;
const DONUT_CENTER = DONUT_SIZE / 2;
const DONUT_FRAME = DONUT_SIZE + 36;
const DONUT_FRAME_OFFSET = (DONUT_FRAME - DONUT_SIZE) / 2;
const LABEL_RADIUS = 118;
const LABEL_ICON_SIZE = 24;
const ICON_BLOCK_WIDTH = 28;
const ICON_BLOCK_HEIGHT = 30;
const ICON_GAP = 1;
const CLUSTER_COMPACT_SIZE = 22;
const CLUSTER_BLOCK_WIDTH = 26;
const CLUSTER_BLOCK_HEIGHT = 28;
const CLUSTER_GAP = 0;
const TINY_SLICE_PERCENT = 3;
const TINY_LINE_END = DONUT_RADIUS + 16;
const CLUSTER_ANGLE = 0.22;
const CLUSTER_OFFSET = 14;
const CLUSTER_INSET = 0;
const SINGLE_OUTER_OFFSET = 18;
const OVERLAY_PAD = 26;
const PILL_HEIGHT = 16;
const PILL_WIDTH = 44;

const TRANSFER_FILTER_OPTIONS = [
  { id: "include", label: "Con transferencias" },
  { id: "only-expense", label: "Solo gastos" },
] as const;

const MIN_PERCENT_OPTIONS = [
  { id: "0", label: "Todos" },
  { id: "3", label: "Desde 3%" },
  { id: "5", label: "Desde 5%" },
  { id: "10", label: "Desde 10%" },
] as const;

const MAX_CATEGORY_OPTIONS = [
  { id: "5", label: "Top 5" },
  { id: "8", label: "Top 8" },
  { id: "12", label: "Top 12" },
] as const;

const formatPercent = (value: number, detailed = false) => {
  if (!Number.isFinite(value) || value <= 0) return "0%";
  if (value < 0.5) return "<0.5%";
  const oneDecimal = Number(value.toFixed(1));
  if (value < 10) return `${oneDecimal}%`;
  if (detailed) return `${oneDecimal}%`;
  return `${Math.round(value)}%`;
};

const formatCurrency = (value: number, currency = "CLP") =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(value);

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatMonthLabel = (month: number, year: number) => {
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleDateString("es-CL", { month: "long" });
  return `${monthName.toUpperCase()} DE ${year}`;
};

const hashCode = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const mixHex = (
  hex: string,
  targetHex: string,
  amount = 0.82,
  fallback = "#F3F4F6"
) => {
  const clean = hex.replace("#", "");
  const cleanTarget = targetHex.replace("#", "");
  if (clean.length !== 6 || cleanTarget.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const tr = parseInt(cleanTarget.slice(0, 2), 16);
  const tg = parseInt(cleanTarget.slice(2, 4), 16);
  const tb = parseInt(cleanTarget.slice(4, 6), 16);
  const mix = (c: number, t: number) => Math.round(c + (t - c) * amount);
  const rr = mix(r, tr)
    .toString(16)
    .padStart(2, "0");
  const gg = mix(g, tg)
    .toString(16)
    .padStart(2, "0");
  const bb = mix(b, tb)
    .toString(16)
    .padStart(2, "0");
  return `#${rr}${gg}${bb}`;
};

const toRgba = (hex: string, alpha: number, fallback: string) => {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getIconBg = (
  color: string | undefined,
  isDark: boolean,
  fallback: string
) => {
  if (!color) return fallback;
  if (color.startsWith("#")) {
    return toRgba(color, isDark ? 0.22 : 0.16, fallback);
  }
  return fallback;
};

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const [viewMode, setViewMode] = useState<ViewMode>("EXPENSE");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [includeTransfers, setIncludeTransfers] = useState(true);
  const [minPercentFilter, setMinPercentFilter] =
    useState<MinPercentFilter>(0);
  const [maxCategories, setMaxCategories] = useState<MaxCategoriesFilter>(8);
  const [labelSheetOpen, setLabelSheetOpen] = useState(false);
  const [activeCluster, setActiveCluster] = useState<LabelCluster | null>(null);
  const categories = useCategoryStore((state) => state.categories);
  const pastel = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const pieColors = isDark ? DARK_PIE_COLORS : LIGHT_PIE_COLORS;
  const softMixAmount = isDark ? 0.68 : 0.82;
  const gradientMixAmount = isDark ? 0.24 : 0.65;
  const searchNormalized = searchQuery.trim().toLowerCase();

  const {
    transactions,
    isLoading,
    selectedMonth,
    selectedYear,
    totalExpense,
    totalIncome,
  } = useTransactionStore();

  useEffect(() => {
    TransactionActions.loadTransactions();
    CategoryActions.loadCategories();
  }, []);

  const handleMonthShift = (delta: number) => {
    let nextMonth = selectedMonth + delta;
    let nextYear = selectedYear;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    TransactionActions.changeDate(nextMonth, nextYear);
  };

  const { rows, total } = useMemo(() => {
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
    const monthTransactions = transactions.filter((tx) => {
      const date = new Date(tx.date);
      if (
        date.getMonth() + 1 !== selectedMonth ||
        date.getFullYear() !== selectedYear
      ) {
        return false;
      }
      if (viewMode === "INCOME") return tx.type === "INCOME";
      return tx.type === "EXPENSE" || (includeTransfers && tx.type === "TRANSFER");
    });

    const map = new Map<
      string,
      {
        id: string;
        name: string;
        total: number;
        color: string;
        icon?: string;
        category?: Transaction["category"];
      }
    >();

    monthTransactions.forEach((tx) => {
      const amount = Math.abs(Number(tx.amount || 0));
      const category = tx.category || categoryMap.get(tx.categoryId);
      const key = tx.categoryId || category?.id || "unknown";
      const prev = map.get(key);
      const baseColor =
        category?.color ||
        pieColors[hashCode(key) % pieColors.length];
      const name = category?.name || "Sin categoría";
      map.set(key, {
        id: key,
        name,
        total: (prev?.total || 0) + amount,
        color: baseColor,
        icon: category?.icon,
        category,
      });
    });

    let list = Array.from(map.values()).sort((a, b) => b.total - a.total);

    if (searchNormalized) {
      list = list.filter((item) =>
        item.name.toLowerCase().includes(searchNormalized)
      );
    }

    list = list.slice(0, maxCategories);

    const totalBeforeThreshold = list.reduce((acc, item) => acc + item.total, 0);
    let rowsWithPercent = list.map((item) => ({
      ...item,
      percent: totalBeforeThreshold > 0 ? (item.total / totalBeforeThreshold) * 100 : 0,
      softColor: mixHex(
        item.color,
        pastel.mixBase,
        softMixAmount,
        pastel.iconBgFallback
      ),
    }));

    if (minPercentFilter > 0) {
      rowsWithPercent = rowsWithPercent.filter(
        (item) => item.percent >= minPercentFilter
      );

      const thresholdTotal = rowsWithPercent.reduce(
        (acc, item) => acc + item.total,
        0
      );

      rowsWithPercent = rowsWithPercent.map((item) => ({
        ...item,
        percent: thresholdTotal > 0 ? (item.total / thresholdTotal) * 100 : 0,
      }));
    }

    const visibleTotal = rowsWithPercent.reduce((acc, item) => acc + item.total, 0);

    return { rows: rowsWithPercent, total: visibleTotal };
  }, [
    transactions,
    selectedMonth,
    selectedYear,
    viewMode,
    includeTransfers,
    searchNormalized,
    minPercentFilter,
    maxCategories,
    categories,
    pieColors,
    pastel.mixBase,
    pastel.iconBgFallback,
    softMixAmount,
  ]);

  const pieData = useMemo(() => {
    if (rows.length === 0) {
      return [{ value: 1, color: pastel.emptyPie }];
    }
    return rows.map((row) => ({
      value: row.total,
      color: row.color,
      gradientCenterColor: mixHex(
        row.color,
        "#FFFFFF",
        gradientMixAmount,
        row.color
      ),
      percent: row.percent,
      icon: row.icon,
    }));
  }, [rows, pastel.emptyPie, gradientMixAmount]);

  const viewLabel = viewMode === "EXPENSE" ? "Gastos" : "Ingresos";
  const summaryTotal = viewMode === "EXPENSE" ? totalExpense : totalIncome;
  const hasActiveFilters =
    searchNormalized.length > 0 ||
    minPercentFilter > 0 ||
    maxCategories !== 8 ||
    (viewMode === "EXPENSE" && !includeTransfers);
  const filterCount =
    (viewMode === "EXPENSE" && !includeTransfers ? 1 : 0) +
    (minPercentFilter > 0 ? 1 : 0) +
    (maxCategories !== 8 ? 1 : 0);
  const centerTotal = hasActiveFilters ? total : summaryTotal || total;
  const labelPositions: LabelPosition[] = useMemo(() => {
    if (!total || rows.length === 0) return [];
    let acc = 0;
    return rows.slice(0, 8).map((row) => {
      const ratio = row.total / total;
      const mid = acc + ratio / 2;
      acc += ratio;
      const angle = 2 * Math.PI * mid - Math.PI / 2;
      const isTiny = row.percent < TINY_SLICE_PERCENT;
      const labelRadius = isTiny ? TINY_LINE_END + 6 : LABEL_RADIUS;
      const x = DONUT_CENTER + Math.sin(angle) * labelRadius;
      const y = DONUT_CENTER - Math.cos(angle) * labelRadius;
      return {
        ...row,
        angle,
        x,
        y,
        isTiny,
        percentLabel: formatPercent(row.percent, true),
        anchorX: DONUT_CENTER + Math.sin(angle) * (DONUT_RADIUS + 6),
        anchorY: DONUT_CENTER - Math.cos(angle) * (DONUT_RADIUS + 6),
      };
    });
  }, [rows, total]);

  const clusters: LabelCluster[] = useMemo(() => {
    if (labelPositions.length === 0) return [];
    const sorted = [...labelPositions].sort((a, b) => a.angle - b.angle);
    const result: LabelCluster[] = [];

    const buildCluster = (items: LabelPosition[]) => {
      const sin =
        items.reduce((acc, item) => acc + Math.sin(item.angle), 0) / items.length;
      const cos =
        items.reduce((acc, item) => acc + Math.cos(item.angle), 0) / items.length;
      const angle = Math.atan2(sin, cos);
      const anchorX = DONUT_CENTER + Math.sin(angle) * (DONUT_RADIUS + 2);
      const anchorY = DONUT_CENTER - Math.cos(angle) * (DONUT_RADIUS + 2);
      const baseX =
        DONUT_CENTER + Math.sin(angle) * (DONUT_RADIUS + CLUSTER_OFFSET);
      const baseY =
        DONUT_CENTER - Math.cos(angle) * (DONUT_RADIUS + CLUSTER_OFFSET);
      const percentTotal = items.reduce((acc, item) => acc + item.percent, 0);
      return {
        id: `cluster-${items[0]?.id || Math.random().toString(36).slice(2)}`,
        items,
        anchorX,
        anchorY,
        baseX,
        baseY,
        percentTotal,
        angle,
      };
    };

    let current: LabelPosition[] = [];
    sorted.forEach((item) => {
      if (current.length === 0) {
        current = [item];
        return;
      }
      const prev = current[current.length - 1];
      const diff = Math.abs(item.angle - prev.angle);
      if (diff <= CLUSTER_ANGLE) {
        current.push(item);
      } else {
        result.push(buildCluster(current));
        current = [item];
      }
    });
    if (current.length) result.push(buildCluster(current));

    if (result.length > 1) {
      const first = result[0];
      const last = result[result.length - 1];
      const wrapDiff = Math.abs(first.angle + Math.PI * 2 - last.angle);
      if (wrapDiff <= CLUSTER_ANGLE) {
        const merged = buildCluster([...last.items, ...first.items]);
        result.splice(0, 1);
        result.splice(result.length - 1, 1, merged);
      }
    }

    return result;
  }, [labelPositions]);

  const clusterRenders = useMemo(() => {
    return clusters.map((cluster) => {
      const angleDeg = ((cluster.angle * 180) / Math.PI + 360) % 360;
      let layout: "top" | "bottom" | "left" | "right";
      if (angleDeg >= 315 || angleDeg < 45) layout = "top";
      else if (angleDeg >= 45 && angleDeg < 135) layout = "right";
      else if (angleDeg >= 135 && angleDeg < 225) layout = "bottom";
      else layout = "left";

      const isHorizontal = layout === "top" || layout === "bottom";
      const visibleItems = cluster.items.slice(0, 3);
      const isSingle = visibleItems.length === 1;
      const isMulti = visibleItems.length > 1;
      const iconSize = isMulti ? CLUSTER_COMPACT_SIZE : LABEL_ICON_SIZE;
      const blockWidth = isMulti ? CLUSTER_BLOCK_WIDTH : ICON_BLOCK_WIDTH;
      const blockHeight = isMulti ? CLUSTER_BLOCK_HEIGHT : ICON_BLOCK_HEIGHT;
      const gap = isMulti ? CLUSTER_GAP : ICON_GAP;
      const extraOffset = isMulti ? 2 : 0;
      const radialInset = isMulti ? CLUSTER_INSET : 0;
      const singleItem = isSingle ? visibleItems[0] : null;
      const isTinySingle = !!singleItem?.isTiny;
      const baseRadius = isSingle
        ? isTinySingle
          ? TINY_LINE_END + SINGLE_OUTER_OFFSET
          : DONUT_RADIUS + SINGLE_OUTER_OFFSET
        : DONUT_RADIUS + CLUSTER_OFFSET;
      const finalRadius = baseRadius + extraOffset - radialInset;
      const baseX = DONUT_CENTER + Math.sin(cluster.angle) * finalRadius;
      const baseY = DONUT_CENTER - Math.cos(cluster.angle) * finalRadius;
      const groupWidth = isHorizontal
        ? visibleItems.length * blockWidth +
          Math.max(visibleItems.length - 1, 0) * gap
        : blockWidth;
      const groupHeight = isHorizontal
        ? blockHeight
        : visibleItems.length * blockHeight +
          Math.max(visibleItems.length - 1, 0) * gap;

      const singleCenterOffsetX = isSingle ? (blockWidth - iconSize) / 2 : 0;
      const singleCenterOffsetY = isSingle ? (blockHeight - iconSize) / 2 : 0;
      const groupLeft = baseX - groupWidth / 2 + singleCenterOffsetX;
      const groupTop = baseY - groupHeight / 2 + singleCenterOffsetY;

      const clampedLeft = isSingle
        ? groupLeft
        : clampValue(
            groupLeft,
            -OVERLAY_PAD + 4,
            DONUT_SIZE + OVERLAY_PAD - groupWidth - 4
          );
      const clampedTop = isSingle
        ? groupTop
        : clampValue(
            groupTop,
            -OVERLAY_PAD + 4,
            DONUT_SIZE + OVERLAY_PAD - groupHeight - 4
          );

      const iconPositions = visibleItems.map((entry, index) => {
        const offsetX = isHorizontal ? index * (blockWidth + gap) : 0;
        const offsetY = isHorizontal ? 0 : index * (blockHeight + gap);
        const left = clampedLeft + offsetX;
        const top = clampedTop + offsetY;
        return {
          ...entry,
          left,
          top,
          centerX: left + blockWidth / 2,
          centerY: top + iconSize / 2,
          iconSize,
          blockWidth,
          blockHeight,
        };
      });

      let pillLeft = (groupWidth - PILL_WIDTH) / 2;
      let pillTop = groupHeight + 5;
      const overlayBottom = DONUT_SIZE + OVERLAY_PAD - 4;
      if (clampedTop + groupHeight + PILL_HEIGHT + 6 > overlayBottom) {
        pillTop = -PILL_HEIGHT - 6;
      }

      const primaryColor =
        [...cluster.items].sort((a, b) => b.percent - a.percent)[0]?.color ||
        pastel.ink;

      return {
        ...cluster,
        layout,
        visibleItems,
        iconPositions,
        groupLeft: clampedLeft,
        groupTop: clampedTop,
        groupWidth,
        groupHeight,
        pillLeft,
        pillTop,
        ovalLeft: clampedLeft - 6,
        ovalTop: clampedTop - 6,
        ovalWidth: groupWidth + 12,
        ovalHeight: groupHeight + 12,
        primaryColor,
        iconSize,
        blockWidth,
        blockHeight,
        gap,
        baseX,
        baseY,
      };
    });
  }, [
    clusters,
    pastel.ink,
    pastel.border,
    pastel.mixBase,
    pastel.mixAlt,
    pastel.clusterBg,
    pastel.iconBgFallback,
    pastel.badgeBg,
    pastel.badgeText,
    isDark,
  ]);

  const handleClusterPress = (cluster: LabelCluster) => {
    if (cluster.items.length <= 1) return;
    setActiveCluster(cluster);
    setLabelSheetOpen(true);
  };

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery("");
      return;
    }
    setSearchOpen(true);
  };

  const clearFilters = () => {
    setIncludeTransfers(true);
    setMinPercentFilter(0);
    setMaxCategories(8);
  };

  return (
    <MainLayout noPadding>
      <YStack
        flex={1}
        backgroundColor={pastel.page}
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom="$6"
        space="$4"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <GoBackButton
            onPress={() => navigation.goBack()}
            backgroundColor={pastel.surface}
            borderColor={pastel.border}
            iconColor={pastel.ink}
          />
          <XStack alignItems="center" space="$2">
            <Button
              size="$3"
              circular
              backgroundColor={pastel.surface}
              borderWidth={1}
              borderColor={pastel.border}
              onPress={() => handleMonthShift(-1)}
              icon={<ChevronLeft size={16} color={pastel.ink} />}
            />
            <Text
              fontSize="$4"
              fontWeight="800"
              color={pastel.ink}
              letterSpacing={0.6}
            >
              {formatMonthLabel(selectedMonth, selectedYear)}
            </Text>
            <Button
              size="$3"
              circular
              backgroundColor={pastel.surface}
              borderWidth={1}
              borderColor={pastel.border}
              onPress={() => handleMonthShift(1)}
              icon={<ChevronRight size={16} color={pastel.ink} />}
            />
          </XStack>
          <XStack alignItems="center" space="$2">
            <Button
              size="$3"
              circular
              backgroundColor={
                filterSheetOpen || filterCount > 0 ? pastel.accentSoft : pastel.surface
              }
              borderWidth={1}
              borderColor={pastel.border}
              onPress={() => setFilterSheetOpen(true)}
              icon={
                <SlidersHorizontal
                  size={16}
                  color={filterCount > 0 ? pastel.accent : pastel.muted}
                />
              }
            />
            <Button
              size="$3"
              circular
              backgroundColor={
                searchOpen || searchNormalized.length > 0
                  ? pastel.accentSoft
                  : pastel.surface
              }
              borderWidth={1}
              borderColor={pastel.border}
              onPress={toggleSearch}
              icon={
                <Search
                  size={16}
                  color={searchNormalized.length > 0 ? pastel.accent : pastel.muted}
                />
              }
            />
          </XStack>
        </XStack>

        <XStack alignItems="center" space="$2">
          <Button
            height={32}
            borderRadius="$8"
            paddingHorizontal="$3"
            backgroundColor={
              viewMode === "EXPENSE" ? pastel.accentSoft : "transparent"
            }
            borderWidth={0}
            onPress={() => setViewMode("EXPENSE")}
            pressStyle={{ opacity: 0.9 }}
          >
            <XStack alignItems="center" space="$2">
              <Circle size={8} backgroundColor={pastel.peach} />
              <Text
                fontSize={12}
                fontWeight="700"
                color={viewMode === "EXPENSE" ? pastel.ink : pastel.muted}
                letterSpacing={0.6}
              >
                GASTOS
              </Text>
            </XStack>
          </Button>
          <Button
            height={32}
            borderRadius="$8"
            paddingHorizontal="$3"
            backgroundColor={
              viewMode === "INCOME" ? pastel.accentSoft : "transparent"
            }
            borderWidth={0}
            onPress={() => setViewMode("INCOME")}
            pressStyle={{ opacity: 0.9 }}
          >
            <XStack alignItems="center" space="$2">
              <Circle size={8} backgroundColor={pastel.mint} />
              <Text
                fontSize={12}
                fontWeight="700"
                color={viewMode === "INCOME" ? pastel.ink : pastel.muted}
                letterSpacing={0.6}
              >
                INGRESO
              </Text>
            </XStack>
          </Button>
        </XStack>

        {searchOpen && (
          <XStack
            height={40}
            borderRadius="$10"
            borderWidth={1}
            borderColor={pastel.border}
            backgroundColor={pastel.surface}
            alignItems="center"
            paddingHorizontal="$3"
            space="$2"
          >
            <Search size={14} color={pastel.muted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar categoría..."
              placeholderTextColor={pastel.muted}
              autoFocus
              style={{
                flex: 1,
                color: pastel.ink,
                fontSize: 14,
                paddingVertical: 0,
              }}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <X size={14} color={pastel.muted} />
              </Pressable>
            )}
          </XStack>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <YStack space="$4" alignItems="center">
            <YStack
              backgroundColor="transparent"
              borderWidth={0}
              paddingTop="$2"
              paddingBottom="$3"
              width="100%"
              alignItems="center"
              space="$3"
            >
              {isLoading ? (
                <Spinner size="large" color={pastel.accent} />
              ) : (
                <Stack
                  width={DONUT_FRAME}
                  height={DONUT_FRAME}
                  alignItems="center"
                  justifyContent="center"
                  overflow="visible"
                >
                  <PieChart
                    data={pieData}
                    donut
                    radius={DONUT_RADIUS}
                    innerRadius={DONUT_INNER}
                    strokeWidth={10}
                    strokeColor={pastel.page}
                    innerCircleColor={pastel.page}
                    showGradient={true}
                    focusOnPress={false}
                    toggleFocusOnPress={false}
                    showText={false}
                    initialAngle={-Math.PI / 2}
                    centerLabelComponent={() => (
                      <YStack alignItems="center" space="$1">
                        <Text
                          fontSize={12}
                          letterSpacing={1}
                          color={pastel.muted}
                        >
                          {viewLabel.toUpperCase()}
                        </Text>
                        <Text fontSize="$5" fontWeight="800" color={pastel.ink}>
                          {formatCurrency(centerTotal)}
                        </Text>
                      </YStack>
                    )}
                  />
                  <Svg
                    width={DONUT_SIZE}
                    height={DONUT_SIZE}
                    style={{
                      position: "absolute",
                      left: DONUT_FRAME_OFFSET,
                      top: DONUT_FRAME_OFFSET,
                    }}
                  >
                    <Defs>
                      <Pattern
                        id="hatch"
                        patternUnits="userSpaceOnUse"
                        width="8"
                        height="8"
                        patternTransform="rotate(32)"
                      >
                        <Line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="8"
                          stroke={pastel.hatchStrong}
                          strokeWidth="1"
                        />
                        <Line
                          x1="4"
                          y1="0"
                          x2="4"
                          y2="8"
                          stroke={pastel.hatchSoft}
                          strokeWidth="1"
                        />
                      </Pattern>
                      <Mask id="donutMask">
                        <Rect width={DONUT_SIZE} height={DONUT_SIZE} fill="black" />
                        <SvgCircle
                          cx={DONUT_CENTER}
                          cy={DONUT_CENTER}
                          r={DONUT_RADIUS}
                          fill="white"
                        />
                        <SvgCircle
                          cx={DONUT_CENTER}
                          cy={DONUT_CENTER}
                          r={DONUT_INNER}
                          fill="black"
                        />
                      </Mask>
                    </Defs>
                    <Rect
                      width={DONUT_SIZE}
                      height={DONUT_SIZE}
                      fill="url(#hatch)"
                      mask="url(#donutMask)"
                    />
                  </Svg>
                  <Stack
                    position="absolute"
                    width={DONUT_SIZE + OVERLAY_PAD * 2}
                    height={DONUT_SIZE + OVERLAY_PAD * 2}
                    left={DONUT_FRAME_OFFSET - OVERLAY_PAD}
                    top={DONUT_FRAME_OFFSET - OVERLAY_PAD}
                    pointerEvents="box-none"
                  >
                    {clusterRenders.map((cluster) => {
                      const isMulti = cluster.items.length > 1;
                      const percentLabel = formatPercent(cluster.percentTotal, true);
                      return (
                        <Pressable
                          key={cluster.id}
                          onPress={isMulti ? () => handleClusterPress(cluster) : undefined}
                          disabled={!isMulti}
                          hitSlop={isMulti ? 8 : undefined}
                          style={{
                            position: "absolute",
                            left: cluster.groupLeft + OVERLAY_PAD,
                            top: cluster.groupTop + OVERLAY_PAD,
                            width: cluster.groupWidth,
                            alignItems: "center",
                            overflow: "visible",
                          }}
                        >
                          <YStack alignItems="center" space="$1">
                            {isMulti && (
                              <Stack
                                position="absolute"
                                left={cluster.ovalLeft - cluster.groupLeft}
                                top={cluster.ovalTop - cluster.groupTop}
                                width={cluster.ovalWidth}
                                height={cluster.ovalHeight}
                                borderRadius={999}
                                borderWidth={1}
                                borderColor={mixHex(
                                  cluster.primaryColor,
                                  pastel.mixAlt,
                                  isDark ? 0.3 : 0.15,
                                  pastel.border
                                )}
                                backgroundColor={pastel.clusterBg}
                                zIndex={0}
                              />
                            )}
                            <Stack
                              width={cluster.groupWidth}
                              height={cluster.groupHeight}
                              zIndex={1}
                            >
                              {cluster.iconPositions.map((entry) => {
                                const Icon = getIcon(entry.icon || "HelpCircle");
                                return (
                                  <YStack
                                    key={entry.id}
                                    position="absolute"
                                    left={entry.left - cluster.groupLeft}
                                    top={entry.top - cluster.groupTop}
                                    alignItems="center"
                                    width={entry.blockWidth || ICON_BLOCK_WIDTH}
                                  >
                                    <Circle
                                      size={entry.iconSize || LABEL_ICON_SIZE}
                                      backgroundColor={mixHex(
                                        entry.color,
                                        pastel.mixBase,
                                        isDark ? 0.72 : 0.9,
                                        pastel.iconBgFallback
                                      )}
                                      borderWidth={1}
                                      borderColor={entry.color}
                                    >
                                      <Icon
                                        size={12}
                                        color={entry.color}
                                        strokeWidth={2}
                                      />
                                    </Circle>
                                    {!isMulti && (
                                      <Text
                                        fontSize={8}
                                        fontWeight="700"
                                        color={entry.color}
                                        marginTop={2}
                                      >
                                        {entry.percentLabel}
                                      </Text>
                                    )}
                                  </YStack>
                                );
                              })}
                              {cluster.items.length > cluster.visibleItems.length && (
                                <Circle
                                  size={14}
                                  backgroundColor={pastel.badgeBg}
                                  position="absolute"
                                  right={-4}
                                  bottom={-4}
                                >
                                  <Text
                                    fontSize={9}
                                    fontWeight="700"
                                    color={pastel.badgeText}
                                  >
                                    +{cluster.items.length - cluster.visibleItems.length}
                                  </Text>
                                </Circle>
                              )}
                            </Stack>
                            {isMulti && (
                              <Text
                                position="absolute"
                                left={cluster.pillLeft}
                                top={cluster.pillTop}
                                width={PILL_WIDTH}
                                fontSize={8}
                                fontWeight="700"
                                color={cluster.primaryColor}
                                textAlign="center"
                                numberOfLines={1}
                                zIndex={2}
                              >
                                {percentLabel}
                              </Text>
                            )}
                          </YStack>
                        </Pressable>
                      );
                    })}
                  </Stack>
                </Stack>
              )}

              <Text
                fontSize="$5"
                fontWeight="700"
                color={pastel.ink}
                fontStyle="italic"
              >
                {viewLabel}
              </Text>
            </YStack>

            <YStack width="100%" space="$3">
              {rows.length === 0 ? (
                <YStack
                  backgroundColor={pastel.surface}
                  borderRadius="$12"
                  borderWidth={1}
                  borderColor={pastel.border}
                  padding="$4"
                  alignItems="center"
                >
                  <Text color={pastel.muted}>
                    {hasActiveFilters
                      ? "No hay resultados con los filtros actuales."
                      : "Aún no hay movimientos en este mes."}
                  </Text>
                </YStack>
              ) : (
                rows.map((row) => (
                  <YStack
                    key={row.id}
                    backgroundColor={pastel.surface}
                    borderRadius="$14"
                    borderWidth={1}
                    borderColor={pastel.border}
                    padding="$3"
                    space="$2"
                  >
                    <XStack alignItems="center" justifyContent="space-between">
                      <XStack alignItems="center" space="$3">
                        <Circle
                          size={38}
                          backgroundColor={getIconBg(
                            row.color,
                            isDark,
                            pastel.iconBgFallback
                          )}
                        >
                          {(() => {
                            const Icon = getIcon(row.icon || "HelpCircle");
                            return (
                              <Icon size={18} color={row.color} strokeWidth={2} />
                            );
                          })()}
                        </Circle>
                        <YStack space="$1">
                          <Text fontSize="$3" fontWeight="700" color={pastel.ink}>
                            {row.name}
                          </Text>
                          <Text fontSize={11} color={pastel.muted}>
                            {formatPercent(row.percent, true)}
                          </Text>
                        </YStack>
                      </XStack>
                      <Text fontWeight="700" color={pastel.ink}>
                        {formatCurrency(row.total)}
                      </Text>
                    </XStack>
                    <Stack
                      height={6}
                      backgroundColor={row.softColor}
                      borderRadius={999}
                      overflow="hidden"
                    >
                      <Stack
                        height="100%"
                        width={`${Math.min(row.percent, 100)}%`}
                        backgroundColor={row.color}
                        borderRadius={999}
                      />
                    </Stack>
                  </YStack>
                ))
              )}
            </YStack>
          </YStack>
      </ScrollView>

      <Sheet
        modal
        open={filterSheetOpen}
        onOpenChange={(open: boolean) => setFilterSheetOpen(open)}
        snapPoints={[70]}
        dismissOnSnapToBottom
        zIndex={100_200}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor={isDark ? "rgba(2,6,23,0.74)" : "rgba(15,23,42,0.3)"}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame backgroundColor={pastel.surface}>
          <YStack flex={1}>
            <XStack
              paddingHorizontal="$4"
              paddingTop="$4"
              paddingBottom="$3"
              alignItems="center"
              justifyContent="space-between"
            >
              <YStack space="$1">
                <Text fontSize="$6" fontWeight="800" color={pastel.ink}>
                  Filtros de análisis
                </Text>
                <Text fontSize="$3" color={pastel.muted}>
                  Personaliza el gráfico y la lista.
                </Text>
              </YStack>
              <Button
                size="$3"
                circular
                chromeless
                onPress={() => setFilterSheetOpen(false)}
                icon={<X size={16} color={pastel.muted} />}
              />
            </XStack>

            <Separator borderColor={pastel.border} />

            <YStack
              flex={1}
              paddingHorizontal="$4"
              paddingTop="$4"
              justifyContent="space-between"
              space="$4"
            >
              <YStack space="$4.5">
                {viewMode === "EXPENSE" && (
                  <YStack space="$3">
                    <Text
                      fontSize={11}
                      fontWeight="800"
                      color={pastel.muted}
                      letterSpacing={0.45}
                    >
                      MOVIMIENTOS
                    </Text>
                    <SegmentControl
                      options={TRANSFER_FILTER_OPTIONS}
                      value={includeTransfers ? "include" : "only-expense"}
                      onChange={(id) => setIncludeTransfers(id === "include")}
                      columns={2}
                      pastel={pastel}
                      activeColor={pastel.accent}
                    />
                  </YStack>
                )}

                <YStack space="$3">
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={pastel.muted}
                    letterSpacing={0.45}
                  >
                    UMBRAL MÍNIMO
                  </Text>
                  <SegmentControl
                    options={MIN_PERCENT_OPTIONS}
                    value={String(minPercentFilter)}
                    onChange={(id) => setMinPercentFilter(Number(id) as MinPercentFilter)}
                    columns={2}
                    pastel={pastel}
                    activeColor={pastel.accent}
                  />
                </YStack>

                <YStack space="$3">
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={pastel.muted}
                    letterSpacing={0.45}
                  >
                    UMBRAL MÁXIMO DE CATEGORÍAS
                  </Text>
                  <SegmentControl
                    options={MAX_CATEGORY_OPTIONS}
                    value={String(maxCategories)}
                    onChange={(id) => setMaxCategories(Number(id) as MaxCategoriesFilter)}
                    columns={3}
                    pastel={pastel}
                    activeColor={pastel.accent}
                  />
                </YStack>
              </YStack>

              <YStack
                paddingBottom={Math.max(insets.bottom, 12)}
                space="$3"
              >
                <Separator borderColor={pastel.border} />
              <XStack space="$2">
                <Button
                  flex={1}
                  height={44}
                  backgroundColor={pastel.accentSoft}
                  borderWidth={0}
                  borderRadius="$4"
                  onPress={clearFilters}
                >
                  <Text fontSize="$3" fontWeight="700" color={pastel.accent}>
                    Limpiar
                  </Text>
                </Button>
                <Button
                  flex={1}
                  height={44}
                  backgroundColor={pastel.accent}
                  borderWidth={0}
                  borderRadius="$4"
                  onPress={() => setFilterSheetOpen(false)}
                >
                  <Text fontSize="$3" fontWeight="700" color="white">
                    Aplicar
                  </Text>
                </Button>
              </XStack>
            </YStack>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <Sheet
        modal
        open={labelSheetOpen}
        onOpenChange={(open: boolean) => {
          setLabelSheetOpen(open);
          if (!open) setActiveCluster(null);
        }}
        snapPoints={[50, 70]}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor={isDark ? "rgba(2,6,23,0.74)" : "rgba(15,23,42,0.3)"}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" space="$3" backgroundColor={pastel.surface}>
          {activeCluster ? (
            <>
              <YStack space="$1">
                <Text fontSize="$5" fontWeight="800" color={pastel.ink}>
                  {activeCluster.items.length > 1
                    ? "Categorías agrupadas"
                    : activeCluster.items[0]?.name}
                </Text>
                <Text fontSize="$3" color={pastel.muted}>
                  {activeCluster.items.length > 1
                    ? `Total ${formatPercent(activeCluster.percentTotal, true)}`
                    : formatPercent(activeCluster.items[0]?.percent ?? 0, true)}
                </Text>
              </YStack>
              <Sheet.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: 8,
                  paddingBottom: Math.max(insets.bottom, 12),
                }}
              >
                <YStack space="$2">
                  {activeCluster.items
                    .slice()
                    .sort((a, b) => b.percent - a.percent)
                    .map((item) => {
                      const Icon = getIcon(item.icon || "HelpCircle");
                      return (
                        <XStack
                          key={item.id}
                          alignItems="center"
                          justifyContent="space-between"
                          backgroundColor={pastel.page}
                          borderRadius="$10"
                          borderWidth={1}
                          borderColor={pastel.border}
                          padding="$3"
                        >
                          <XStack alignItems="center" space="$3">
                            <Circle
                              size={36}
                              backgroundColor={getIconBg(
                                item.color,
                                isDark,
                                pastel.iconBgFallback
                              )}
                              borderWidth={1}
                              borderColor={item.color}
                            >
                              <Icon size={16} color={item.color} strokeWidth={2} />
                            </Circle>
                            <YStack>
                              <Text fontSize="$3" fontWeight="700" color={pastel.ink}>
                                {item.name}
                              </Text>
                              <Text fontSize={11} color={pastel.muted}>
                                {formatPercent(item.percent, true)}
                              </Text>
                            </YStack>
                          </XStack>
                          <Text fontWeight="700" color={pastel.ink}>
                            {formatCurrency(item.total)}
                          </Text>
                        </XStack>
                      );
                    })}
                </YStack>
              </Sheet.ScrollView>
            </>
          ) : (
            <Text color={pastel.muted}>Selecciona una categoría.</Text>
          )}
        </Sheet.Frame>
      </Sheet>
    </YStack>
  </MainLayout>
);
}
