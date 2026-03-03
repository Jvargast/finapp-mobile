import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const THEME_PREFERENCES_KEY = "wou_theme_preferences_v1";
const DEFAULT_DARK_START_HOUR = 19;
const DEFAULT_DARK_END_HOUR = 7;

type ThemeSchedulePicker = "start" | "end";

interface PersistedThemePreferences {
  autoDarkMode: boolean;
  darkStartHour: number;
  darkEndHour: number;
}

interface ThemePreferencesState extends PersistedThemePreferences {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setAutoDarkMode: (value: boolean) => Promise<void>;
  setScheduleHour: (picker: ThemeSchedulePicker, hour: number) => Promise<void>;
}

const clampHour = (value: number, fallback: number) => {
  if (!Number.isFinite(value)) return fallback;
  const normalized = Math.trunc(value);
  if (normalized < 0 || normalized > 23) return fallback;
  return normalized;
};

const normalizePersistedThemePreferences = (
  value?: Partial<PersistedThemePreferences> | null
): PersistedThemePreferences => ({
  autoDarkMode: Boolean(value?.autoDarkMode ?? false),
  darkStartHour: clampHour(
    Number(value?.darkStartHour),
    DEFAULT_DARK_START_HOUR
  ),
  darkEndHour: clampHour(Number(value?.darkEndHour), DEFAULT_DARK_END_HOUR),
});

const serialize = (state: ThemePreferencesState): PersistedThemePreferences => ({
  autoDarkMode: state.autoDarkMode,
  darkStartHour: state.darkStartHour,
  darkEndHour: state.darkEndHour,
});

const persist = async (state: ThemePreferencesState) => {
  try {
    await SecureStore.setItemAsync(
      THEME_PREFERENCES_KEY,
      JSON.stringify(serialize(state))
    );
  } catch (error) {
    console.warn("No se pudo persistir preferencias de tema", error);
  }
};

export const useThemePreferencesStore = create<ThemePreferencesState>(
  (set, get) => ({
    hydrated: false,
    autoDarkMode: false,
    darkStartHour: DEFAULT_DARK_START_HOUR,
    darkEndHour: DEFAULT_DARK_END_HOUR,

    hydrate: async () => {
      if (get().hydrated) return;

      try {
        const raw = await SecureStore.getItemAsync(THEME_PREFERENCES_KEY);

        if (!raw) {
          set({ hydrated: true });
          return;
        }

        const parsed = JSON.parse(raw);
        const normalized = normalizePersistedThemePreferences(parsed);
        set({ ...normalized, hydrated: true });
      } catch (error) {
        console.warn("No se pudo hidratar preferencias de tema", error);
        set({ hydrated: true });
      }
    },

    setAutoDarkMode: async (value) => {
      set({ autoDarkMode: value });
      await persist(get());
    },

    setScheduleHour: async (picker, hour) => {
      if (picker === "start") {
        set({
          darkStartHour: clampHour(hour, get().darkStartHour),
        });
      } else {
        set({
          darkEndHour: clampHour(hour, get().darkEndHour),
        });
      }

      await persist(get());
    },
  })
);
