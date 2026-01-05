import { XStack, YStack, Text, Button, Avatar } from "tamagui";
import { Bell, Menu } from "@tamagui/lucide-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Pressable } from "react-native";
import { useUserStore } from "../../stores/useUserStore";

export const HomeHeader = () => {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigation<any>();

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const firstName = user?.firstName;
  const initials = firstName ? firstName[0].toUpperCase() : "N";
  const mainTitle = firstName || "Nova";
  const subTitle = firstName ? "Hola de nuevo," : "¡Bienvenido a";

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      marginBottom="$4"
      paddingTop="$2"
    >
      <XStack space="$3" alignItems="center">
        <Button
          size="$3.5"
          circular
          backgroundColor="white"
          icon={<Menu size={24} color="#1E293B" />}
          onPress={openDrawer}
          shadowColor="#64748B"
          shadowRadius={5}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.05}
          borderWidth={1}
          borderColor="#F1F5F9"
        />

        <YStack justifyContent="center">
          <Text fontSize={13} color="#64748B" fontWeight="500" lineHeight={18}>
            {subTitle}
          </Text>
          <Text
            fontSize={20}
            fontWeight="800"
            color="#1E293B"
            lineHeight={24}
            textTransform="capitalize"
          >
            {mainTitle}
          </Text>
        </YStack>
      </XStack>

      <XStack space="$2.5" alignItems="center">
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          icon={<Bell size={22} color="#1E293B" />}
          pressStyle={{ opacity: 0.5 }}
        />
        <Pressable onPress={goToProfile}>
          <Avatar circular size="$4.5">
            <Avatar.Image
              src={user?.avatar || user?.avatarUrl}
              width="100%"
              height="100%"
            />
            <Avatar.Fallback
              backgroundColor="#4F46E5"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={16} fontWeight="bold" color="white">
                {initials}
              </Text>
            </Avatar.Fallback>
          </Avatar>
        </Pressable>
      </XStack>
    </XStack>
  );
};
