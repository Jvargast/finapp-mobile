import { useState } from "react";
import {
  YStack,
  Text,
  Button,
  ScrollView,
  XStack,
  Spinner,
  Separator,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  Mail,
  Phone,
  Check,
  ChevronLeft,
  AtSign,
} from "@tamagui/lucide-icons";
import { useUserStore } from "../../stores/useUserStore";
import { UserActions } from "../../actions/userActions";
import { useToastStore } from "../../stores/useToastStore";
import { SensitiveChangeModal } from "../../components/profile/SensitiveChangeModal";
import { SensitiveRow } from "../../components/profile/SensitiveRow";
import { ReadOnlyRow } from "../../components/profile/ReadOnlyRow";
import { EditInputRow } from "../../components/profile/EditInputRow";
import { PrimaryButton } from "../../components/ui/PrimaryButton";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <XStack
        padding="$4"
        alignItems="center"
        space="$3"
        backgroundColor="white"
        borderBottomWidth={1}
        borderColor="#E2E8F0"
      >
        <Button unstyled onPress={() => navigation.goBack()} padding="$2">
          <ChevronLeft color="#1E293B" />
        </Button>
        <Text fontSize={18} fontWeight="700" color="#1E293B">
          Editar Perfil
        </Text>
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <YStack space="$2" marginBottom="$6">
          <Text
            fontSize={13}
            fontWeight="700"
            color="#64748B"
            textTransform="uppercase"
            marginBottom="$2"
            letterSpacing={0.5}
          >
            Información Básica
          </Text>

          <EditInputRow
            label="Nombre"
            icon={User}
            value={formData.firstName}
            onChangeText={(t) => {
              setFormData({ ...formData, firstName: t });
              if (errors.firstName) setErrors({ ...errors, firstName: "" });
            }}
            placeholder="Tu nombre"
            error={errors.firstName}
          />

          <EditInputRow
            label="Apellido"
            icon={User}
            value={formData.lastName}
            onChangeText={(t) => {
              setFormData({ ...formData, lastName: t });
              if (errors.lastName) setErrors({ ...errors, lastName: "" });
            }}
            placeholder="Tu apellido"
            error={errors.lastName}
          />

          <EditInputRow
            label="Usuario (@)"
            icon={AtSign}
            value={formData.username}
            onChangeText={(t) => {
              setFormData({ ...formData, username: t });
              if (errors.username) setErrors({ ...errors, username: "" });
            }}
            autoCapitalize="none"
            placeholder="nombre_usuario"
            error={errors.username}
            helperText="Mínimo 3 caracteres. Solo letras, números, puntos (.) y guiones bajos (_)."
          />
        </YStack>

        <Separator borderColor="#E2E8F0" marginBottom="$6" />

        <YStack space="$2" marginBottom="$6">
          <Text
            fontSize={13}
            fontWeight="700"
            color="#64748B"
            textTransform="uppercase"
            marginBottom="$2"
            letterSpacing={0.5}
          >
            Datos de Contacto
          </Text>

          <SensitiveRow
            icon={Mail}
            label="Correo Electrónico"
            value={user?.email}
            onEdit={() => setModalType("EMAIL")}
          />

          <SensitiveRow
            icon={Phone}
            label="Teléfono Móvil"
            value={user?.phone}
            onEdit={() => setModalType("PHONE")}
          />

          <ReadOnlyRow
            label="RUT / ID (No editable)"
            value={user?.rut || "No verificado"}
          />
        </YStack>

        <PrimaryButton
          label="Guardar Cambios"
          loadingText="Guardando..."
          isLoading={saving}
          onPress={handleSaveSimpleData}
          showIcon={false}
          marginTop="$6"
        />
      </ScrollView>

      {modalType && (
        <SensitiveChangeModal
          isVisible={!!modalType}
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </SafeAreaView>
  );
}
