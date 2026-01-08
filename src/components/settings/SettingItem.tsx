import { Button, Circle, Text, XStack, Switch } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";

interface SettingItemProps {
  icon: any;
  color: string;
  label: string;
  value?: string | null;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
}

export const SettingItem = ({
  icon: Icon,
  color,
  label,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  isDestructive,
}: SettingItemProps) => {
  return (
    <Button
      unstyled
      onPress={hasSwitch ? undefined : onPress}
      backgroundColor="$background"
      paddingVertical="$4"
      paddingHorizontal="$4"
      flexDirection="row"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      pressStyle={{ backgroundColor: "$backgroundPress" }}
    >
      <Circle size="$2.5" backgroundColor={`${color}15`}>
        <Icon size={18} color={color} />
      </Circle>

      <Text
        fontSize={15}
        color={isDestructive ? "#EF4444" : "$color"}
        fontWeight="500"
        marginLeft="$3"
        flex={1}
      >
        {label}
      </Text>

      <XStack alignItems="center" space="$2">
        {value && (
          <Text fontSize={14} color="$colorQwerty">
            {value}
          </Text>
        )}

        {hasSwitch && (
          <Switch
            size="$3" 
            checked={switchValue}
            onCheckedChange={onSwitchChange}
            backgroundColor={switchValue ? "#10B981" : "$gray6"}
            borderWidth={0}
          >
            <Switch.Thumb animation="bouncy" backgroundColor="white" />
          </Switch>
        )}

        {!hasSwitch && <ChevronRight size={18} color="$color" opacity={0.5} />}
      </XStack>
    </Button>
  );
};
