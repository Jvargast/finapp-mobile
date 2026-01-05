import { useCallback, useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Avatar,
  ScrollView,
  Separator,
  View,
  Spinner,
} from "tamagui";
import {
  User,
  Mail,
  Phone,
  Camera,
  CreditCard,
  AtSign,
  Crown,
  Calendar,
  Settings,
} from "@tamagui/lucide-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, RefreshControl } from "react-native";
import { useUserStore } from "../../stores/useUserStore";
import { UserActions } from "../../actions/userActions";
import { useNavigation } from "@react-navigation/native";
import { InfoGroup } from "../../components/profile/InfoGroup";
import { InfoRow } from "../../components/profile/InfoRow";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await UserActions.refreshProfile();
    setRefreshing(false);
  }, []);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const initials = user?.firstName?.[0]?.toUpperCase() || "N";
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "Usuario Nova";
  const isPro = user?.plan === "PRO" || user?.plan === "PREMIUM";
  const planName = user?.plan || "FREE";

  const avatarSource = user?.avatar || user?.avatarUrl;

  const goToEdit = () => navigation.navigate("EditProfile");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
          />
        }
      >
        <YStack alignItems="center" marginTop="$2" marginBottom="$6">
          <YStack position="relative" marginBottom="$4">
            <View
              padding={4}
              borderRadius={100}
              borderWidth={1}
              borderColor={isPro ? "#F59E0B" : "#E2E8F0"}
              borderStyle={isPro ? "solid" : "dashed"}
            >
              <Avatar circular size="$10">
                <Avatar.Image source={{ uri: avatarSource }} />
                <Avatar.Fallback
                  backgroundColor={isPro ? "#1E293B" : "#4F46E5"}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    fontSize={32}
                    fontWeight="bold"
                    color={isPro ? "#F59E0B" : "white"}
                  >
                    {initials}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
            </View>

            <Button
              position="absolute"
              bottom={0}
              right={-5}
              size="$3"
              circular
              backgroundColor="white"
              borderWidth={1}
              borderColor="#E2E8F0"
              icon={
                uploading ? (
                  <Spinner size="small" color="#4F46E5" />
                ) : (
                  <Camera size={16} color="#1E293B" />
                )
              }
              onPress={uploading ? undefined : handlePickImage}
              elevation={2}
              disabled={uploading}
            />
          </YStack>

          <Text
            fontSize={24}
            fontWeight="800"
            color="#1E293B"
            textAlign="center"
          >
            {fullName}
          </Text>

          <XStack alignItems="center" space="$2" marginTop="$1">
            <Text fontSize={14} color="#64748B" fontWeight="500">
              @{user?.username || "usuario"}
            </Text>
            <View
              backgroundColor={isPro ? "#FFFBEB" : "#F1F5F9"}
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={6}
              borderWidth={1}
              borderColor={isPro ? "#FCD34D" : "#E2E8F0"}
            >
              <XStack alignItems="center" space="$1">
                {isPro && <Crown size={10} color="#D97706" />}
                <Text
                  fontSize={10}
                  fontWeight="800"
                  color={isPro ? "#D97706" : "#64748B"}
                >
                  {planName}
                </Text>
              </XStack>
            </View>
          </XStack>
          <Button
            marginTop="$4"
            size="$3"
            backgroundColor="white"
            borderWidth={1}
            borderColor="#E2E8F0"
            icon={<Settings size={16} />}
            onPress={goToEdit}
          >
            Editar Perfil Completo
          </Button>
        </YStack>

        <InfoGroup title="Identidad">
          <InfoRow icon={User} label="Nombre Legal" value={fullName} />
          <InfoRow
            icon={AtSign}
            label="Nombre de Usuario"
            value={`@${user?.username || "sin_usuario"}`}
          />
          <InfoRow
            icon={CreditCard}
            label="RUT / ID Nacional"
            value={user?.rut || "No verificado"}
            onEdit={() => Alert.alert("Verificar Identidad")}
            isLast
          />
        </InfoGroup>

        <InfoGroup title="Contacto">
          <InfoRow icon={Mail} label="Correo Electrónico" value={user?.email} />
          <InfoRow
            icon={Phone}
            label="Teléfono Móvil"
            value={user?.phone || "No registrado"}
            isLast
          />
        </InfoGroup>

        <InfoGroup>
          <InfoRow
            icon={Calendar}
            label="Miembro Desde"
            value="Octubre 2025"
            isLast
          />
        </InfoGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
