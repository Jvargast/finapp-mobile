import finappApi from "../api/finappApi";

export const UserService = {
  setupUser: async (payload: any) => {
    const { data } = await finappApi.patch("/users/setup", payload);
    return data;
  },

  updatePreferences: async (newPrefs: any) => {
    const { data } = await finappApi.patch("/users/me/preferences", newPrefs);
    return data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await finappApi.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return data;
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }) => {
    const { data: response } = await finappApi.patch("/users/me/profile", data);
    return response;
  },

  uploadAvatar: async (formData: FormData) => {
    const { data } = await finappApi.post("/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  requestSensitiveChange: async (
    field: "EMAIL" | "PHONE",
    newValue: string
  ) => {
    const payload =
      field === "PHONE"
        ? { field, newValuePhone: newValue }
        : { field, newValue };

    const { data } = await finappApi.post("/users/me/request-change", payload);
    return data;
  },

  verifySensitiveChange: async (
    field: "EMAIL" | "PHONE",
    newValue: string,
    code: string
  ) => {
    const { data } = await finappApi.patch("/users/me/verify-change", {
      field,
      newValue,
      code,
    });
    return data;
  },

  updatePushToken: async (pushToken: string) => {
    const { data } = await finappApi.patch("/users/push-token", { pushToken });
    return data;
  },

  deleteAccount: async () => {
    const { data } = await finappApi.delete("/users/me");
    return data;
  },
};
