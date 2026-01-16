import { YStack, XStack, Text, Card, Progress } from "tamagui";
import {
  Home,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Target,
  Lightbulb,
  Briefcase,
} from "@tamagui/lucide-icons";
import { FinancialGoal, GoalType } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { ParticipantAvatars } from "./ParticipantAvatars";

interface GoalCardProps {
  goal: FinancialGoal;
  index: number;
  total: number;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export const GoalCard = ({
  goal,
  index,
  total,
  onPress,
  onLongPress,
  isSelected = false,
}: GoalCardProps) => {
  const analysis = goal.analysis || {
    type: "UNKNOWN",
    advice: "Procesando análisis...",
  };

  const getTheme = () => {
    switch (goal.type) {
      case GoalType.HOUSING:
        return { bg: "$blue9", iconBg: "$blue5", shadow: "$blue9" };
      case GoalType.INVESTMENT:
        return { bg: "$purple9", iconBg: "$purple5", shadow: "$purple9" };
      case GoalType.RETIREMENT:
        return { bg: "$slate9", iconBg: "$slate5", shadow: "$slate9" };
      case GoalType.CONTROL:
        return { bg: "$orange9", iconBg: "$orange5", shadow: "$orange9" };
      case GoalType.DEBT:
        return { bg: "$red9", iconBg: "$red5", shadow: "$red9" };
      case GoalType.SAVING:
        if (analysis.type === "EMERGENCY_FUND_ANALYSIS") {
          return { bg: "$orange9", iconBg: "$orange5", shadow: "$orange9" };
        }
        return { bg: "$green9", iconBg: "$green5", shadow: "$green9" };
      default:
        return { bg: "$gray9", iconBg: "$gray5", shadow: "$gray9" };
    }
  };

  const theme = getTheme();

  const getIcon = () => {
    const props = { size: 22, color: "white" };
    switch (goal.type) {
      case GoalType.HOUSING:
        return <Home {...props} />;
      case GoalType.RETIREMENT:
        return <Briefcase {...props} />;
      case GoalType.CONTROL:
        return <ShieldCheck {...props} />;
      case GoalType.INVESTMENT:
        return <TrendingUp {...props} />;
      case GoalType.DEBT:
        return <CreditCard {...props} />;
      case GoalType.SAVING:
        return analysis?.type === "EMERGENCY_FUND_ANALYSIS" ? (
          <ShieldCheck {...props} />
        ) : (
          <PiggyBank {...props} />
        );
      default:
        return <Target {...props} />;
    }
  };

  const progressPercent = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );

  const goalCurrency = goal.currency || "CLP";

  return (
    <Card
      animation="quick"
      marginTop={index === 0 ? 0 : -55}
      zIndex={isSelected ? 1000 : index}
      y={isSelected ? -30 : 0}
      scale={isSelected ? 1.02 : 1}
      height={190}
      animateOnly={["transform", "opacity"]}
      backgroundColor={theme.bg}
      borderRadius="$8"
      padding="$4"
      elevation={8}
      shadowColor={theme.shadow}
      shadowRadius={15}
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={0.4}
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={{ top: 0, left: 0, right: 0, bottom: 40 }}
      pressStyle={isSelected ? { opacity: 0.9 } : { scale: 0.98, opacity: 0.9 }}
      borderWidth={0}
    >
      <YStack flex={1} justifyContent="space-between">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <XStack space="$3" flex={1} paddingRight="$2">
            <YStack
              backgroundColor={theme.iconBg}
              width={45}
              height={45}
              borderRadius="$10"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="rgba(255,255,255,0.2)"
            >
              {getIcon()}
            </YStack>

            <YStack justifyContent="center" flex={1}>
              <Text
                color="white"
                fontWeight="900"
                fontSize="$6"
                letterSpacing={0.5}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {goal.name}
              </Text>
              <Text
                color="rgba(255,255,255,0.7)"
                fontSize="$3"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing={1}
              >
                {goal.type} • {goalCurrency}
              </Text>
              <ParticipantAvatars
                participants={goal.participants || []}
                borderColor={theme.bg}
              />
            </YStack>
          </XStack>

          <Text
            color="white"
            fontWeight="900"
            fontSize="$8"
            opacity={0.9}
            textShadowColor="rgba(0,0,0,0.2)"
            textShadowRadius={5}
            flexShrink={0}
            marginLeft="$2"
          >
            {progressPercent.toFixed(0)}%
          </Text>
        </XStack>

        <YStack space="$3">
          <YStack space="$2">
            <XStack justifyContent="space-between">
              <Text
                fontSize="$3"
                color="rgba(255,255,255,0.8)"
                fontWeight="600"
              >
                {formatGoalAmount(goal.currentAmount, goalCurrency)}
              </Text>
              <Text
                fontSize="$3"
                color="rgba(255,255,255,0.8)"
                fontWeight="600"
              >
                {formatGoalAmount(goal.targetAmount, goalCurrency)}
              </Text>
            </XStack>

            <Progress
              value={progressPercent}
              size="$2"
              backgroundColor="rgba(0,0,0,0.2)"
            >
              <Progress.Indicator animation="bouncy" backgroundColor="white" />
            </Progress>
          </YStack>

          <XStack
            backgroundColor="rgba(255,255,255,0.15)"
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius="$4"
            space="$2"
            alignItems="center"
            marginTop="$1"
          >
            <Lightbulb size={14} color="white" />
            <Text
              fontSize="$2"
              color="white"
              flex={1}
              fontWeight="500"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {analysis.advice}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </Card>
  );
};
