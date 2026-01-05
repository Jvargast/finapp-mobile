import finappApi from "../api/finappApi";

interface LoginResponse {
  user: any;
  access_token: string;
  refresh_token: string;
}

export const AuthService = {
  login: async (email: string, password: string) => {
    const { data } = await finappApi.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  register: async (userData: any) => {
    const { data } = await finappApi.post<LoginResponse>(
      "/auth/register",
      userData
    );
    return data;
  },

  getMe: async () => {
    const { data } = await finappApi.get("/auth/me");
    return data;
  },

  refreshToken: async (token: string) => {
    const { data } = await finappApi.post("/auth/refresh", {
      refreshToken: token,
    });
    return data;
  },

  logout: async () => {
    await finappApi.post("/auth/logout");
  },
};
