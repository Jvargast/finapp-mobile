import { XStack, YStack, Text, Button, Avatar, View } from "tamagui";
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
  const isPro = user?.plan === "PRO" || user?.plan === "PREMIUM";

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
          backgroundColor="$color2" 
          icon={<Menu size={24} color="$color" />} 
          onPress={openDrawer}
          shadowColor="$shadowColor"
          shadowRadius={5}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.05}
          borderWidth={1}
          borderColor="$borderColor"
        />

        <YStack justifyContent="center">
          <Text fontSize={13} color="$gray11" fontWeight="500" lineHeight={18}>
            {subTitle}
          </Text>
          <Text
            fontSize={20}
            fontWeight="800"
            color="$color"
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
          icon={<Bell size={22} color="$color" />}
          pressStyle={{ opacity: 0.5 }}
          onPress={() => console.log("Notificaciones")} 
        />

        <Pressable onPress={goToProfile}>
          <View
            padding={1}
            borderRadius={100}
            borderWidth={1}
            borderColor={isPro ? "#F59E0B" : "$brand"}
            borderStyle={isPro ? "solid" : "dashed"}
          >
            <Avatar circular size="$4.5">
              <Avatar.Image
                src={user?.avatar || user?.avatarUrl}
                width="100%"
                height="100%"
              />
              <Avatar.Fallback
                backgroundColor="$brand"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={16} fontWeight="bold" color="white">
                  {initials}
                </Text>
              </Avatar.Fallback>
            </Avatar>
          </View>
        </Pressable>
      </XStack>
    </XStack>
  );
};
