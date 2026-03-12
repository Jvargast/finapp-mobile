import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "@tamagui/linear-gradient";
import {
  AtSign,
  Camera,
  CreditCard,
  Mail,
  PenSquare,
  Phone,
  User,
} from "@tamagui/lucide-icons";
import {
  Avatar,
  Button,
  ScrollView,
  Spinner,
  Stack,
  Text,
  XStack,
  YStack,
  useThemeName,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";

import { UserActions } from "../../actions/userActions";
import { InfoGroup } from "../../components/profile/InfoGroup";
import { InfoRow } from "../../components/profile/InfoRow";
import { ProfileMetaPill } from "../../components/profile/ProfileMetaPill";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { useSubscription } from "../../hooks/useSubscription";
import { useUserStore } from "../../stores/useUserStore";
import { getAnalyticsPalette, withAlpha } from "../../theme/appVisuals";
import { SubscriptionPlan } from "../../types/user.types";
import { formatMemberSince } from "../../utils/profileDisplay";

const ProfilePlanBadge = ({
  isDark,
  isPremiumPlan,
  label,
}: {
  isDark: boolean;
  isPremiumPlan: boolean;
  label: string;
}) => {
  const accentColor = isPremiumPlan ? "#F59E0B" : isDark ? "#E2E8F0" : "#334155";
  const badgeBg = isPremiumPlan
    ? isDark
      ? "rgba(245,158,11,0.12)"
      : "rgba(245,158,11,0.12)"
    : isDark
    ? "rgba(226,232,240,0.08)"
    : "rgba(51,65,85,0.08)";
  const borderColor = isPremiumPlan
    ? "rgba(245,158,11,0.24)"
    : isDark
    ? "rgba(226,232,240,0.12)"
    : "rgba(51,65,85,0.10)";

  return (
    <XStack
      alignSelf="flex-start"
      alignItems="center"
      space="$1.5"
      paddingHorizontal="$2.5"
      paddingVertical="$1.25"
      borderRadius={999}
      borderWidth={1}
      borderColor={borderColor}
      backgroundColor={badgeBg}
    >
      <Stack
        width={7}
        height={7}
        borderRadius={999}
        backgroundColor={accentColor}
      />
      <Text
        fontSize={11}
        fontWeight="800"
        color={accentColor}
        letterSpacing={0.3}
      >
        {label}
      </Text>
    </XStack>
  );
};

export default function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const visuals = getAnalyticsPalette(themeName);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasRequestedSubscriptionSync, setHasRequestedSubscriptionSync] =
    useState(false);
  const {
    backendSubscription,
    plan,
    refresh: refreshSubscription,
    isRefreshing: isRefreshingSubscription,
  } = useSubscription();
  const refreshSubscriptionRef = useRef(refreshSubscription);

  useEffect(() => {
    refreshSubscriptionRef.current = refreshSubscription;
  }, [refreshSubscription]);

  useFocusEffect(
    useCallback(() => {
      setHasRequestedSubscriptionSync(true);
      void refreshSubscriptionRef.current({
        reason: "profile_screen_focus",
        refreshOfferings: false,
        silent: true,
      }).catch(() => undefined);
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await Promise.allSettled([
      UserActions.refreshProfile(),
      refreshSubscription({
        reason: "profile_pull_to_refresh",
        refreshOfferings: false,
        silent: true,
      }),
    ]);

    setRefreshing(false);
  }, [refreshSubscription]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para cambiar tu foto."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        await UserActions.uploadAvatar(result);
        Alert.alert("¡Listo!", "Tu foto de perfil se ha actualizado.");
      } catch (error) {
        Alert.alert("Error", "No pudimos subir la imagen. Intenta nuevamente.");
      } finally {
        setUploading(false);
      }
    }
  };

  const initials =
    user?.firstName?.trim()?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "W";
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Usuario WOU Finance";
  const username = user?.username ? `@${user.username}` : "@usuario";
  const memberSinceValue = formatMemberSince(user?.createdAt) ?? "Pendiente";
  const goToEdit = () => navigation.navigate("EditProfile");

  const displayPlan = backendSubscription?.plan ?? plan;
  const isPremiumPlan = displayPlan !== SubscriptionPlan.FREE;
  const hidePlanChip =
    !hasRequestedSubscriptionSync &&
    !backendSubscription &&
    displayPlan === SubscriptionPlan.FREE;
  const planValueLabel =
    isRefreshingSubscription && !backendSubscription
      ? "..."
      : displayPlan === SubscriptionPlan.FREE
      ? "Free"
      : displayPlan === SubscriptionPlan.FAMILY_ADMIN ||
        displayPlan === SubscriptionPlan.FAMILY_MEMBER
      ? "Family"
      : "WOU+";
  const heroGradient = [visuals.heroStart, visuals.heroEnd];
  const heroInk = visuals.ink;
  const heroMuted = visuals.muted;
  const primaryEditBg = visuals.brand;
  const primaryEditPressedBg = visuals.brandStrong;
  const primaryEditColor = "#FFFFFF";
  const cameraButtonBg = visuals.surface;
  const cameraButtonPressedBg = isDark
    ? withAlpha(visuals.mixAlt, 0.08, visuals.surface)
    : visuals.accentSoft;
  const avatarRingBg = isPremiumPlan ? "#F59E0B" : "transparent";
  const avatarRingBorder = isPremiumPlan ? "#F59E0B" : "$appBorder";

  return (
    <YStack flex={1} backgroundColor="$appPage">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={visuals.brand}
            colors={[visuals.brand]}
          />
        }
      >
        <Stack
          overflow="hidden"
          borderRadius={28}
          marginBottom="$4"
          shadowColor="$shadowColor"
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.06}
        >
          <LinearGradient
            colors={heroGradient}
            start={[0, 0]}
            end={[1, 1]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />

          <YStack
            paddingHorizontal="$4.5"
            paddingTop="$4"
            paddingBottom="$4.5"
            position="relative"
          >
            <XStack
              position="absolute"
              top="$4"
              right="$4.5"
              zIndex={10}
              alignItems="center"
              space="$2"
            >
              {!hidePlanChip ? (
                <ProfilePlanBadge
                  isDark={isDark}
                  isPremiumPlan={isPremiumPlan}
                  label={planValueLabel}
                />
              ) : null}

              <Button
                circular
                size="$3"
                width={38}
                height={38}
                backgroundColor={primaryEditBg}
                color={primaryEditColor}
                borderRadius={999}
                pressStyle={{
                  backgroundColor: primaryEditPressedBg,
                  scale: 0.98,
                  opacity: 1,
                }}
                icon={
                  <PenSquare size={15} color={primaryEditColor} />
                }
                onPress={goToEdit}
              />
            </XStack>

            <XStack alignItems="flex-start" space="$3.5" marginTop="$3">
              <YStack
                width={84}
                alignItems="center"
                justifyContent="flex-start"
              >
                <Stack
                  padding={3}
                  borderRadius={999}
                  backgroundColor={avatarRingBg}
                  borderWidth={isPremiumPlan ? 0 : 1}
                  borderColor={avatarRingBorder}
                  shadowColor={isPremiumPlan ? "#F59E0B" : undefined}
                  shadowRadius={isPremiumPlan ? 8 : 0}
                  shadowOpacity={isPremiumPlan ? 0.4 : 0}
                >
                  <Avatar circular size="$9">
                    <Avatar.Image source={{ uri: user?.avatar || undefined }} />
                    <Avatar.Fallback
                      backgroundColor={visuals.surface}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={30}
                        fontWeight="800"
                        fontFamily="$display"
                        color={visuals.brand}
                      >
                        {initials}
                      </Text>
                    </Avatar.Fallback>
                  </Avatar>

                  <Button
                    position="absolute"
                    right={-2}
                    bottom={-2}
                    size="$3"
                    circular
                    backgroundColor={cameraButtonBg}
                    borderWidth={1}
                    borderColor="$appBorder"
                    pressStyle={{
                      backgroundColor: cameraButtonPressedBg,
                      scale: 0.96,
                      opacity: 1,
                    }}
                    icon={
                      uploading ? (
                        <Spinner size="small" color={visuals.brand} />
                      ) : (
                        <Camera size={15} color={visuals.brand} />
                      )
                    }
                    onPress={uploading ? undefined : handlePickImage}
                    disabled={uploading}
                  />
                </Stack>
              </YStack>

              <YStack
                flex={1}
                minHeight={72}
                justifyContent="space-between"
                paddingTop="$1.5"
                paddingRight="$7"
              >
                <YStack space="$0.5">
                  <DisplayHeading fontSize="$7" color={heroInk} lineHeight={32}>
                    {fullName}
                  </DisplayHeading>

                  <Text fontSize={14} color={heroMuted} fontWeight="700">
                    {username}
                  </Text>
                </YStack>

                <ProfileMetaPill
                  label="Miembro desde"
                  value={memberSinceValue}
                />
              </YStack>
            </XStack>
          </YStack>
        </Stack>

        <InfoGroup title="Identidad">
          <InfoRow
            icon={User}
            label="Nombre legal"
            value={fullName}
          />
          <InfoRow
            icon={AtSign}
            label="Nombre de usuario"
            value={username}
          />
          <InfoRow
            icon={CreditCard}
            label="RUT / ID nacional"
            value={user?.rut || "No verificado"}
            isLast
          />
        </InfoGroup>

        <InfoGroup title="Contacto">
          <InfoRow
            icon={Mail}
            label="Correo electrónico"
            value={user?.email || "No configurado"}
          />
          <InfoRow
            icon={Phone}
            label="Teléfono móvil"
            value={user?.phone || "No registrado"}
            isLast
          />
        </InfoGroup>
      </ScrollView>
    </YStack>
  );
}
