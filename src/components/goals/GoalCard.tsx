import { YStack, XStack, Text, Card, Progress } from "tamagui";
import {
  Home,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Target,
  Lightbulb,
} from "@tamagui/lucide-icons";
import { FinancialGoal, GoalType } from "../../types/goal.types";

interface GoalCardProps {
  goal: FinancialGoal;
  index: number; 
  onPress?: () => void;
}

export const GoalCard = ({ goal, index, onPress }: GoalCardProps) => {
  const { analysis } = goal;

  const getTheme = () => {
    switch (goal.type) {
      case GoalType.PURCHASE:
        return { bg: "$blue9", iconBg: "$blue5", shadow: "$blue9" }; // Azul Casa
      case GoalType.INVESTMENT:
        return { bg: "$purple9", iconBg: "$purple5", shadow: "$purple9" }; // Morado Inversión
      case GoalType.DEBT:
        return { bg: "$red9", iconBg: "$red5", shadow: "$red9" }; // Rojo Deuda
      case GoalType.SAVING:
        if (analysis.type === "EMERGENCY_FUND_ANALYSIS") {
          return { bg: "$orange9", iconBg: "$orange5", shadow: "$orange9" }; // Naranja Emergencia
        }
        return { bg: "$green9", iconBg: "$green5", shadow: "$green9" }; // Verde Ahorro
      default:
        return { bg: "$gray9", iconBg: "$gray5", shadow: "$gray9" };
    }
  };

  const theme = getTheme();

  const getIcon = () => {
    const props = { size: 22, color: "white" };
    switch (goal.type) {
      case GoalType.PURCHASE:
        return <Home {...props} />;
      case GoalType.INVESTMENT:
        return <TrendingUp {...props} />;
      case GoalType.DEBT:
        return <CreditCard {...props} />;
      case GoalType.SAVING:
        return analysis.type === "EMERGENCY_FUND_ANALYSIS" ? (
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

  return (
    <Card
      marginTop={index === 0 ? 0 : -55}
      zIndex={index}
      height={190}
      backgroundColor={theme.bg}
      borderRadius="$8"
      padding="$4"
      elevation={8}
      shadowColor={theme.shadow}
      shadowRadius={15}
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={0.4}
      onPress={onPress}
      animation="bouncy"
      pressStyle={{
        scale: 1.02,
        y: -30,
        zIndex: 100,
        shadowRadius: 30,
      }}
      borderWidth={0}
    >
      <YStack flex={1} justifyContent="space-between">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <XStack space="$3">
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

            <YStack justifyContent="center">
              <Text
                color="white"
                fontWeight="900"
                fontSize="$6"
                letterSpacing={0.5}
                numberOfLines={1}
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
                {goal.type === "SAVING" &&
                analysis.type === "EMERGENCY_FUND_ANALYSIS"
                  ? "Seguridad"
                  : goal.type}
              </Text>
            </YStack>
          </XStack>

          <Text
            color="white"
            fontWeight="900"
            fontSize="$8"
            opacity={0.9}
            textShadowColor="rgba(0,0,0,0.2)"
            textShadowRadius={5}
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
                ${goal.currentAmount.toLocaleString("es-CL")}
              </Text>
              <Text
                fontSize="$3"
                color="rgba(255,255,255,0.8)"
                fontWeight="600"
              >
                ${goal.targetAmount.toLocaleString("es-CL")}
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
