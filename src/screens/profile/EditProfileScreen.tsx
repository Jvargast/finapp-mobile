import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "@tamagui/linear-gradient";
import { AtSign, Mail, Phone, User } from "@tamagui/lucide-icons";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  Avatar,
  ScrollView,
  Stack,
  Text,
  XStack,
  YStack,
  useThemeName,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { UserActions } from "../../actions/userActions";
import { EditInputRow } from "../../components/profile/EditInputRow";
import { ProfileMetaPill } from "../../components/profile/ProfileMetaPill";
import { ReadOnlyRow } from "../../components/profile/ReadOnlyRow";
import { SensitiveChangeModal } from "../../components/profile/SensitiveChangeModal";
import { SensitiveRow } from "../../components/profile/SensitiveRow";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { FormGroup } from "../../components/ui/FormGroup";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { useToastStore } from "../../stores/useToastStore";
import { useUserStore } from "../../stores/useUserStore";
import { getAnalyticsPalette } from "../../theme/appVisuals";
import { formatMemberSince } from "../../utils/profileDisplay";

const compactUsername = (value: string) => (value ? `@${value}` : "@usuario");

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const headerHeight = useHeaderHeight();
  const user = useUserStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const visuals = getAnalyticsPalette(themeName);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [modalType, setModalType] = useState<"EMAIL" | "PHONE" | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio.";
      isValid = false;
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Mínimo 2 caracteres.";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio.";
      isValid = false;
    }

    const usernameRaw = formData.username;
    const usernameClean = usernameRaw.trim();
    const usernameRegex = /^[a-zA-Z0-9._]+$/;

    if (!usernameClean) {
      newErrors.username = "El usuario es obligatorio.";
      isValid = false;
    } else if (usernameClean.length < 3) {
      newErrors.username = "Mínimo 3 caracteres.";
      isValid = false;
    } else if (!usernameRegex.test(usernameClean)) {
      newErrors.username = "Sin espacios. Solo letras, números, . y _";
      isValid = false;
    }

    if (usernameRaw.includes(" ")) {
      newErrors.username = "El nombre de usuario no puede tener espacios.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveSimpleData = async () => {
    if (!validateForm()) {
      showToast("Por favor corrige los errores", "error");
      return;
    }

    setSaving(true);
    const cleanData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim(),
    };

    try {
      await UserActions.updateProfile(cleanData);
      showToast("Perfil actualizado", "success");
      navigation.goBack();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      if (Array.isArray(msg)) {
        showToast(msg[0], "error");
      } else {
        showToast("Error al guardar cambios", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    field: "firstName" | "lastName" | "username",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const previewName =
    [formData.firstName.trim(), formData.lastName.trim()]
      .filter(Boolean)
      .join(" ") || "Tu nombre";
  const previewUsername = compactUsername(formData.username.trim());
  const previewInitial =
    formData.firstName.trim().charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "W";
  const memberSinceValue = formatMemberSince(user?.createdAt) ?? "Pendiente";
  const heroGradient = [visuals.heroStart, visuals.heroEnd];
  const heroInk = visuals.ink;
  const heroMuted = visuals.muted;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
    >
      <YStack flex={1} backgroundColor="$appPage">
        <ScrollView
          flex={1}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 10,
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          showsVerticalScrollIndicator={false}
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

            <YStack padding="$4.5" space="$3">
              <Text
                fontSize={11}
                fontWeight="800"
                color={heroMuted}
                textTransform="uppercase"
                letterSpacing={0.9}
              >
                Vista previa
              </Text>

              <XStack alignItems="flex-start" space="$3.5">
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
                      {previewInitial}
                    </Text>
                  </Avatar.Fallback>
                </Avatar>

                <YStack flex={1} minHeight={72} justifyContent="space-between">
                  <YStack space="$0.5">
                    <DisplayHeading fontSize="$7" color={heroInk} lineHeight={32}>
                      {previewName}
                    </DisplayHeading>
                    <Text fontSize={14} fontWeight="700" color={heroMuted}>
                      {previewUsername}
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

          <FormGroup title="Perfil">
            <EditInputRow
              label="Nombre"
              icon={User}
              value={formData.firstName}
              onChangeText={(value) => updateField("firstName", value)}
              placeholder="Nombre"
              error={errors.firstName}
            />

            <EditInputRow
              label="Apellidos"
              icon={User}
              value={formData.lastName}
              onChangeText={(value) => updateField("lastName", value)}
              placeholder="Apellido"
              error={errors.lastName}
            />

            <EditInputRow
              label="Usuario"
              icon={AtSign}
              value={formData.username}
              onChangeText={(value) => updateField("username", value)}
              autoCapitalize="none"
              placeholder="nombre_usuario"
              error={errors.username}
            />
          </FormGroup>

          <FormGroup title="Contacto">
            <SensitiveRow
              icon={Mail}
              label="Correo"
              value={user?.email}
              onEdit={() => setModalType("EMAIL")}
            />

            <SensitiveRow
              icon={Phone}
              label="Móvil"
              value={user?.phone}
              onEdit={() => setModalType("PHONE")}
            />

            <ReadOnlyRow
              label="RUT / ID nacional"
              value={user?.rut || "No verificado"}
            />
          </FormGroup>
        </ScrollView>

        <YStack
          paddingHorizontal="$5"
          paddingTop="$3"
          paddingBottom={insets.bottom + 18}
          backgroundColor="$appPage"
        >
          <PrimaryButton
            label="Guardar cambios"
            loadingText="Guardando..."
            isLoading={saving}
            onPress={handleSaveSimpleData}
            showIcon={false}
          />
        </YStack>

        {modalType ? (
          <SensitiveChangeModal
            isVisible={!!modalType}
            type={modalType}
            onClose={() => setModalType(null)}
          />
        ) : null}
      </YStack>
    </KeyboardAvoidingView>
  );
}
