import { Currency } from "./goal.types";

export enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  FAMILY_ADMIN = "FAMILY_ADMIN",
  FAMILY_MEMBER = "FAMILY_MEMBER",
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  pushToken: string | null;

  provider: AuthProvider;
  socialId: string | null;

  role: Role;
  isActive: boolean;
  isVerified: boolean;

  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;

  firstName: string | null;
  lastName: string | null;
  username: string | null;
  rut: string | null;
  avatar: string | null;

  preferences: {
    currency: Currency;
    mainGoal?: string;
    [key: string]: any;
  };
  plan: SubscriptionPlan;
  subscriptionExpiresAt: string | null;
  familyGroupId: string | null;
}
