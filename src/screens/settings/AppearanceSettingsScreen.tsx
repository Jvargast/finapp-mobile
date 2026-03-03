import { useEffect, useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, ScrollView, Sheet, Text, XStack, YStack } from "tamagui";
import { UserActions } from "../../actions/userActions";
import { SettingItem } from "../../components/settings/SettingItem";
import {
  ThemeAutoIcon,
  ThemeManualIcon,
  ThemeStartIcon,
  ThemeEndIcon,
} from "../../components/settings/ThemeAppIcons";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { useToastStore } from "../../stores/useToastStore";
import { useThemePreferencesStore } from "../../stores/useThemePreferencesStore";
import { useUserStore } from "../../stores/useUserStore";

const hourToDate = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date;
};

const formatHour = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;

export default function AppearanceSettingsScreen() {
  const user = useUserStore((state) => state.user);
  const autoDarkMode = useThemePreferencesStore((state) => state.autoDarkMode);
  const darkStartHour = useThemePreferencesStore((state) => state.darkStartHour);
  const darkEndHour = useThemePreferencesStore((state) => state.darkEndHour);
  const hydrateThemePreferences = useThemePreferencesStore(
    (state) => state.hydrate
  );
  const setThemeAutoDarkMode = useThemePreferencesStore(
    (state) => state.setAutoDarkMode
  );
  const setThemeScheduleHour = useThemePreferencesStore(
    (state) => state.setScheduleHour
  );
  const { showToast } = useToastStore();

  const [darkMode, setDarkMode] = useState(false);
  const [iosPickerTarget, setIosPickerTarget] = useState<"start" | "end" | null>(
    null
  );
  const [iosPickerDate, setIosPickerDate] = useState(() =>
    hourToDate(darkStartHour)
  );
  const [androidPickerTarget, setAndroidPickerTarget] = useState<
    "start" | "end" | null
  >(null);

  useEffect(() => {
    hydrateThemePreferences();
  }, [hydrateThemePreferences]);

  useEffect(() => {
    if (user?.preferences) {
      setDarkMode(user.preferences.darkMode ?? false);
    }
  }, [user]);

  const handleToggleManualDarkMode = async (value: boolean) => {
    setDarkMode(value);

    try {
      await UserActions.updatePreferences({ darkMode: value });
    } catch (error) {
      console.error(error);
      setDarkMode(!value);
      showToast("No se pudo guardar la configuración", "error");
    }
  };

  const handleToggleAutoDarkMode = async (value: boolean) => {
    try {
      await setThemeAutoDarkMode(value);
    } catch (error) {
      console.error(error);
      showToast("No se pudo guardar el modo automático", "error");
    }
  };

  const handleSetScheduleHour = async (
    target: "start" | "end",
    selectedHour: number
  ) => {
    try {
      await setThemeScheduleHour(target, selectedHour);
    } catch (error) {
      console.error(error);
      showToast("No se pudo guardar el horario", "error");
    }
  };

  const openSchedulePicker = (target: "start" | "end") => {
    if (Platform.OS === "ios") {
      const baseHour = target === "start" ? darkStartHour : darkEndHour;
      setIosPickerDate(hourToDate(baseHour));
      setIosPickerTarget(target);
      return;
    }

    setAndroidPickerTarget(target);
  };

  const confirmIosSchedule = async () => {
    if (!iosPickerTarget) return;
    await handleSetScheduleHour(iosPickerTarget, iosPickerDate.getHours());
    setIosPickerTarget(null);
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack paddingBottom="$8">
          <SectionTitle title="Tema de la App" />
          <YStack
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            <SettingItem
              icon={ThemeAutoIcon}
              color="#6366F1"
              label="Modo oscuro automático"
              value={`${formatHour(darkStartHour)} a ${formatHour(darkEndHour)}`}
              hasSwitch
              switchValue={autoDarkMode}
              onSwitchChange={handleToggleAutoDarkMode}
            />
            {!autoDarkMode && (
              <SettingItem
                icon={ThemeManualIcon}
                color="#8B5CF6"
                label="Modo Oscuro"
                hasSwitch
                switchValue={darkMode}
                onSwitchChange={handleToggleManualDarkMode}
              />
            )}
            {autoDarkMode && (
              <>
                <SettingItem
                  icon={ThemeStartIcon}
                  color="#6366F1"
                  label="Inicio modo oscuro"
                  value={formatHour(darkStartHour)}
                  onPress={() => openSchedulePicker("start")}
                />
                <SettingItem
                  icon={ThemeEndIcon}
                  color="#6366F1"
                  label="Fin modo oscuro"
                  value={formatHour(darkEndHour)}
                  onPress={() => openSchedulePicker("end")}
                />
              </>
            )}
          </YStack>

          <YStack paddingHorizontal="$4" paddingTop="$4">
            <Text fontSize={12} color="$gray10" lineHeight={18}>
              Programa un horario para activar el tema oscuro automáticamente y
              mantener una visualización más cómoda en la noche.
            </Text>
          </YStack>
        </YStack>
      </ScrollView>

      {Platform.OS === "ios" && (
        <Sheet
          modal
          open={iosPickerTarget !== null}
          onOpenChange={(open: boolean) => {
            if (!open) setIosPickerTarget(null);
          }}
          snapPoints={[40]}
          dismissOnSnapToBottom
          zIndex={100000}
          animation="medium"
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" space="$3" backgroundColor="$background">
            <YStack space="$1">
              <Text
                fontSize="$5"
                fontWeight="800"
                textAlign="center"
                color="$color"
              >
                {iosPickerTarget === "start"
                  ? "Inicio del modo oscuro"
                  : "Fin del modo oscuro"}
              </Text>
              <Text fontSize={12} color="$gray9" textAlign="center">
                Elige la hora en formato 24h.
              </Text>
            </YStack>

            <YStack backgroundColor="$gray2" borderRadius="$4" padding="$2">
              <DateTimePicker
                value={iosPickerDate}
                mode="time"
                display="spinner"
                is24Hour
                onChange={(_, selectedDate) => {
                  if (selectedDate) setIosPickerDate(selectedDate);
                }}
              />
            </YStack>

            <XStack space="$2">
              <Button
                flex={1}
                variant="outlined"
                borderColor="$gray4"
                onPress={() => setIosPickerTarget(null)}
              >
                Cancelar
              </Button>
              <Button
                flex={1}
                theme="active"
                backgroundColor="$color"
                color="$background"
                onPress={confirmIosSchedule}
              >
                Guardar
              </Button>
            </XStack>
          </Sheet.Frame>
        </Sheet>
      )}

      {Platform.OS === "android" && androidPickerTarget && (
        <DateTimePicker
          value={hourToDate(
            androidPickerTarget === "start" ? darkStartHour : darkEndHour
          )}
          mode="time"
          display="default"
          is24Hour
          onChange={(event, selectedDate) => {
            const target = androidPickerTarget;
            setAndroidPickerTarget(null);
            if (target && event.type === "set" && selectedDate) {
              handleSetScheduleHour(target, selectedDate.getHours());
            }
          }}
        />
      )}
    </YStack>
  );
}
