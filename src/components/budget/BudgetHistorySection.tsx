import React, { useState, useMemo } from "react";
import { YStack, XStack, Text, Avatar, Button } from "tamagui";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Crown,
  Receipt,
  Trophy,
} from "@tamagui/lucide-icons";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Budget } from "../../types/budget.types";

interface Props {
  budget: Budget;
}

const PREVIEW_LIMIT = 5;

export const BudgetHistorySection = ({ budget }: Props) => {
  const [tab, setTab] = useState<"HISTORY" | "RANKING">("HISTORY");
  const [isExpanded, setIsExpanded] = useState(false);

  const transactions = budget?.transactions || [];
  const currency = budget.currency;

  const ranking = useMemo(() => {
    const totals: Record<string, number> = {};
    const userMap: Record<string, any> = {};

    transactions.forEach((tx: any) => {
      const amount = Number(tx.amount);
      const userId = tx.account?.user?.id;
      const userProfile = tx.account?.user;

      if (userId) {
        if (!totals[userId]) {
          totals[userId] = 0;
          userMap[userId] = userProfile;
        }
        totals[userId] += amount;
      }
    });

    return Object.entries(totals)
      .map(([userId, total]) => ({
        userId,
        total,
        user: userMap[userId],
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  const currentList = tab === "HISTORY" ? transactions : ranking;
  const visibleItems = isExpanded
    ? currentList
    : currentList.slice(0, PREVIEW_LIMIT);
  const hasHiddenItems = currentList.length > PREVIEW_LIMIT;

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency }).format(val);

  return (
    <YStack space="$4" marginTop="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" space="$2">
          <Activity size={18} color="$brand" />
          <Text fontSize="$5" fontWeight="800" color="$gray11">
            Actividad
          </Text>
        </XStack>
        <Text fontSize="$3" color="$gray10" fontWeight="600">
          {transactions.length} mov.
        </Text>
      </XStack>

      <XStack
        backgroundColor="$gray4"
        padding="$1.5"
        borderRadius="$9"
        height={45}
        marginBottom="$4"
      >
        <Button
          flex={1}
          size="$3"
          chromeless={tab !== "HISTORY"}
          backgroundColor={tab === "HISTORY" ? "$background" : "transparent"}
          color={tab === "HISTORY" ? "$purple10" : "$gray10"}
          fontWeight={tab === "HISTORY" ? "800" : "600"}
          shadowColor={tab === "HISTORY" ? "$shadowColor" : "transparent"}
          shadowRadius={3}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          onPress={() => setTab("HISTORY")}
          borderRadius="$8"
          icon={<Receipt size={16} opacity={tab === "HISTORY" ? 1 : 0.5} />}
        >
          Historial
        </Button>

        <Button
          flex={1}
          size="$3"
          chromeless={tab !== "RANKING"}
          backgroundColor={tab === "RANKING" ? "$background" : "transparent"}
          color={tab === "RANKING" ? "$purple10" : "$gray10"}
          fontWeight={tab === "RANKING" ? "800" : "600"}
          shadowColor={tab === "RANKING" ? "$shadowColor" : "transparent"}
          shadowRadius={3}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          onPress={() => setTab("RANKING")}
          borderRadius="$8"
          icon={<Trophy size={16} opacity={tab === "RANKING" ? 1 : 0.5} />}
        >
          Ranking
        </Button>
      </XStack>
      <YStack minHeight={100}>
        {transactions.length === 0 ? (
          <YStack
            padding="$5"
            alignItems="center"
            justifyContent="center"
            backgroundColor="$gray2"
            borderRadius="$4"
            borderStyle="dashed"
            borderWidth={1}
            borderColor="$gray6"
          >
            <Text color="$gray9" fontSize="$3">
              Aún no hay gastos registrados.
            </Text>
          </YStack>
        ) : (
          <YStack space="$3">
            {visibleItems.map((item: any, index) => {
              const tx = item;
              const user = tx.account?.user;
              if (tab === "HISTORY") {
                const tx = item;
                return (
                  <XStack
                    key={tx.id || index}
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical="$2"
                  >
                    <XStack alignItems="center" space="$3">
                      <Avatar circular size="$3">
                        <Avatar.Image src={tx.user?.profile?.avatarUrl} />
                        <Avatar.Fallback backgroundColor="$gray5" />
                      </Avatar>

                      <YStack>
                        <Text fontWeight="700" fontSize="$3" color="$color">
                          {tx.description || tx.category?.name || "Gasto"}
                        </Text>
                        <XStack space="$2" alignItems="center">
                          <Text fontSize={11} color="$gray9">
                            {user?.profile?.firstName || "Usuario"}
                          </Text>
                          <Text fontSize={10} color="$gray8">
                            •
                          </Text>
                          <Text fontSize={11} color="$gray9">
                            {formatDistanceToNow(
                              new Date(tx.date || Date.now()),
                              {
                                addSuffix: true,
                                locale: es,
                              }
                            )}
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>

                    <Text fontWeight="700" color="$color" fontSize="$4">
                      {formatMoney(Number(tx.amount))}
                    </Text>
                  </XStack>
                );
              } else {
                const rankUser = item;
                const isFirst = index === 0;
                const spentTotal = budget.progress?.spent || 1;
                const percentage = (rankUser.total / spentTotal) * 100 || 0;

                return (
                  <XStack
                    key={rankUser.userId}
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor={
                      isFirst ? "rgba(245, 158, 11, 0.1)" : "transparent"
                    } 
                    padding="$3"
                    borderRadius="$6"
                    borderWidth={isFirst ? 1 : 0}
                    borderColor={isFirst ? "#F59E0B" : "transparent"}
                  >
                    <XStack alignItems="center" space="$3">
                      <Text
                        fontWeight="900"
                        color={isFirst ? "#F59E0B" : "$gray8"}
                        width={20}
                        fontSize="$5"
                      >
                        #{index + 1}
                      </Text>

                      <Avatar
                        circular
                        size="$4"
                        borderWidth={1}
                        borderColor="$gray4"
                      >
                        <Avatar.Image src={rankUser.user?.profile?.avatarUrl} />
                        <Avatar.Fallback backgroundColor="$gray5" />
                      </Avatar>

                      <YStack>
                        <XStack alignItems="center" space="$2">
                          <Text fontWeight="700" fontSize="$4" color="$color">
                            {rankUser.user?.profile?.firstName}
                          </Text>
                          {isFirst && (
                            <Crown size={14} color="#D97706" fill="#FCD34D" />
                          )}
                        </XStack>
                        <Text fontSize={11} color="$gray9">
                          {percentage.toFixed(1)}% del total gastado
                        </Text>
                      </YStack>
                    </XStack>

                    <Text fontWeight="800" color="$color" fontSize="$4">
                      {formatMoney(rankUser.total)}
                    </Text>
                  </XStack>
                );
              }
            })}
          </YStack>
        )}

        {hasHiddenItems && (
          <Button
            chromeless
            size="$3"
            marginTop="$3"
            color="$purple10"
            fontWeight="600"
            iconAfter={
              isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded
              ? "Ver menos"
              : `Ver ${currentList.length - PREVIEW_LIMIT} más`}
          </Button>
        )}
      </YStack>
    </YStack>
  );
};
