import React, { useEffect, useMemo, useState } from "react";
import { YStack, XStack, Text, Button, useThemeName } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";
import AllTransactionsScreen from "./AllTransactionsScreen";
import PendingMovementsScreen from "../banking/PendingMovementsScreen";

type MovementsTab = "HISTORY" | "PENDING";

const getPalette = (isDark: boolean) => ({
  page: isDark ? "#0B0F1A" : "#FBF8F4",
  surface: isDark ? "#111827" : "#FFFFFF",
  border: isDark ? "rgba(148, 163, 184, 0.2)" : "#E6DFD6",
  muted: isDark ? "#94A3B8" : "#6B7280",
  ink: isDark ? "#F8FAFC" : "#1F2937",
  accentSoft: isDark ? "rgba(99, 102, 241, 0.18)" : "#EEF3FF",
});

const parseTab = (value?: string | null): MovementsTab =>
  value === "PENDING" ? "PENDING" : "HISTORY";

export default function MovementsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const themeName = useThemeName();
  const pastel = getPalette(themeName.startsWith("dark"));
  const initialTab = useMemo(() => parseTab(route.params?.tab), [route.params?.tab]);
  const [activeTab, setActiveTab] = useState<MovementsTab>(initialTab);

  const candidateId = route.params?.candidateId as string | undefined;
  const accountId = route.params?.accountId as string | undefined;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <MainLayout noPadding>
      <YStack
        flex={1}
        backgroundColor={pastel.page}
        paddingTop={insets.top + 10}
        paddingBottom={insets.bottom + 10}
        space="$4"
      >
        <YStack paddingHorizontal="$4" space="$3">
          <XStack alignItems="center" space="$3">
            <GoBackButton
              onPress={() => navigation.goBack()}
              backgroundColor={pastel.surface}
              borderColor={pastel.border}
              iconColor={pastel.ink}
            />
            <YStack>
              <Text fontSize="$6" fontWeight="900" color={pastel.ink}>
                Movimientos
              </Text>
              <Text fontSize="$3" color={pastel.muted}>
                Historial y pendientes en un solo lugar.
              </Text>
            </YStack>
          </XStack>

          <XStack
            backgroundColor={pastel.accentSoft}
            padding="$1"
            borderRadius="$10"
            borderWidth={1}
            borderColor={pastel.border}
          >
            {(["HISTORY", "PENDING"] as MovementsTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === "HISTORY" ? "Historial" : "Pendientes";
              return (
                <Button
                  key={tab}
                  flex={1}
                  height={36}
                  borderRadius="$8"
                  backgroundColor={isActive ? pastel.surface : "transparent"}
                  borderWidth={0}
                  pressStyle={{ opacity: 0.9 }}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    fontSize={12}
                    fontWeight="800"
                    letterSpacing={0.6}
                    color={isActive ? pastel.ink : pastel.muted}
                  >
                    {label.toUpperCase()}
                  </Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>

        <YStack flex={1} paddingTop="$1">
          {activeTab === "HISTORY" ? (
            <AllTransactionsScreen
              embedded
              backgroundColor={pastel.page}
              accountId={accountId ?? null}
            />
          ) : (
            <PendingMovementsScreen
              embedded
              initialCandidateId={candidateId ?? null}
            />
          )}
        </YStack>
      </YStack>
    </MainLayout>
  );
}
