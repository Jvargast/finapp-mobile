import React, { useState, useMemo } from "react";
import {
  YStack,
  XStack,
  Text,
  Avatar,
  Separator,
  Button,
  ScrollView,
} from "tamagui";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Crown,
  Activity,
  ChevronUp,
  ChevronDown,
} from "@tamagui/lucide-icons";
import { FinancialGoal } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface GoalActivitySectionProps {
  goal: FinancialGoal;
}

const PREVIEW_LIMIT = 5;

export const GoalActivitySection = ({ goal }: GoalActivitySectionProps) => {
  const [tab, setTab] = useState<"HISTORY" | "RANKING">("HISTORY");
  const [isExpanded, setIsExpanded] = useState(false);
  const transactions = goal.goalTransactions || [];

  const ranking = useMemo(() => {
    const totals: Record<string, number> = {};
    const userMap: Record<string, any> = {};

    transactions.forEach((tx) => {
      const val = Number(tx.amount) * (tx.type === "WITHDRAW" ? -1 : 1);

      if (!totals[tx.userId]) {
        totals[tx.userId] = 0;
        userMap[tx.userId] = tx.user;
      }
      totals[tx.userId] += val;
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

  return (
    <YStack space="$4" marginTop="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" space="$2">
          <Activity size={16} color="$brand" />
          <Text fontSize="$5" fontWeight="800" color="$gray10">
            Actividad
          </Text>
        </XStack>
        <Text fontSize="$3" color="$gray10" fontWeight="600">
          {transactions.length}{" "}
          {transactions.length === 1 ? "movimiento" : "movimientos"}
        </Text>
      </XStack>
      <XStack
        backgroundColor="$gray3"
        padding="$1"
        borderRadius="$8"
        marginHorizontal="$4"
      >
        <Button
          flex={1}
          size="$3"
          chromeless
          backgroundColor={tab === "HISTORY" ? "$background" : "transparent"}
          onPress={() => setTab("HISTORY")}
          color={tab === "HISTORY" ? "$color" : "$gray10"}
          fontWeight="700"
          borderRadius="$6"
        >
          Historial
        </Button>
        <Button
          flex={1}
          size="$3"
          chromeless
          backgroundColor={tab === "RANKING" ? "$background" : "transparent"}
          onPress={() => setTab("RANKING")}
          color={tab === "RANKING" ? "$color" : "$gray10"}
          fontWeight="700"
          borderRadius="$6"
        >
          Ranking
        </Button>
      </XStack>

      <YStack paddingHorizontal="$4" minHeight={200}>
        {transactions.length === 0 ? (
          <Text textAlign="center" color="$gray9" marginTop="$4">
            Aún no hay movimientos. ¡Sé el primero!
          </Text>
        ) : tab === "HISTORY" ? (
          <YStack space="$3">
            {visibleItems.map((item: any, index) => {
              if (tab === "HISTORY") {
                const tx = item;
                const isDeposit = tx.type === "DEPOSIT";
                return (
                  <XStack
                    key={tx.id}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <XStack alignItems="center" space="$3">
                      <YStack
                        backgroundColor={isDeposit ? "$green3" : "$red3"}
                        padding="$2"
                        borderRadius="$10"
                      >
                        {isDeposit ? (
                          <ArrowDownLeft size={16} color="$green10" />
                        ) : (
                          <ArrowUpRight size={16} color="$red10" />
                        )}
                      </YStack>
                      <YStack>
                        <Text fontWeight="700" fontSize="$3">
                          {tx.user.profile?.firstName}
                        </Text>
                        <Text fontSize={11} color="$gray9">
                          {formatDistanceToNow(new Date(tx.date), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </Text>
                      </YStack>
                    </XStack>
                    <Text
                      fontWeight="700"
                      color={isDeposit ? "$green10" : "$red10"}
                    >
                      {isDeposit ? "+" : "-"}
                      {formatGoalAmount(Number(tx.amount), goal.currency)}
                    </Text>
                  </XStack>
                );
              } else {
                const rankUser = item;
                const isFirst = index === 0;
                return (
                  <XStack
                    key={rankUser.userId}
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor={isFirst ? "$yellow2" : "transparent"}
                    padding="$3"
                    borderRadius="$4"
                    borderWidth={isFirst ? 1 : 0}
                    borderColor="$yellow5"
                  >
                    <XStack alignItems="center" space="$3">
                      <Text
                        fontWeight="900"
                        color={isFirst ? "$yellow10" : "$gray8"}
                        width={20}
                      >
                        #{index + 1}
                      </Text>
                      <Avatar circular size="$3">
                        <Avatar.Image src={rankUser.user.profile?.avatarUrl} />
                        <Avatar.Fallback backgroundColor="$gray5" />
                      </Avatar>
                      <YStack>
                        <XStack alignItems="center" space="$2">
                          <Text fontWeight="700">
                            {rankUser.user.profile?.firstName}
                          </Text>
                          {isFirst && (
                            <Crown size={14} color="#D97706" fill="#FCD34D" />
                          )}
                        </XStack>
                        <Text fontSize={11} color="$gray9">
                          {(
                            (rankUser.total / Number(goal.currentAmount)) *
                            100
                          ).toFixed(1)}
                          % del total
                        </Text>
                      </YStack>
                    </XStack>
                    <Text fontWeight="800" color="$gray11">
                      {formatGoalAmount(rankUser.total, goal.currency)}
                    </Text>
                  </XStack>
                );
              }
            })}
          </YStack>
        ) : (
          <YStack space="$3">
            {ranking.map((item, index) => {
              const isFirst = index === 0;
              return (
                <XStack
                  key={item.userId}
                  alignItems="center"
                  justifyContent="space-between"
                  backgroundColor={isFirst ? "$yellow2" : "transparent"}
                  padding="$3"
                  borderRadius="$4"
                  borderWidth={isFirst ? 1 : 0}
                  borderColor="$yellow5"
                >
                  <XStack alignItems="center" space="$3">
                    <Text
                      fontWeight="900"
                      color={isFirst ? "$yellow10" : "$gray8"}
                      width={20}
                    >
                      #{index + 1}
                    </Text>
                    <Avatar circular size="$3">
                      <Avatar.Image src={item.user.profile?.avatarUrl} />
                      <Avatar.Fallback backgroundColor="$gray5" />
                    </Avatar>
                    <YStack>
                      <XStack alignItems="center" space="$2">
                        <Text fontWeight="700">
                          {item.user.profile?.firstName}
                        </Text>
                        {isFirst && (
                          <Crown size={14} color="#D97706" fill="#FCD34D" />
                        )}
                      </XStack>
                      <Text fontSize={11} color="$gray9">
                        {(
                          (item.total / Number(goal.currentAmount)) *
                          100
                        ).toFixed(1)}
                        % del total
                      </Text>
                    </YStack>
                  </XStack>
                  <Text fontWeight="800" color="$gray11">
                    {formatGoalAmount(item.total, goal.currency)}
                  </Text>
                </XStack>
              );
            })}
          </YStack>
        )}
        {hasHiddenItems && (
          <Button
            chromeless
            size="$3"
            marginTop="$2"
            color="$blue10"
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
