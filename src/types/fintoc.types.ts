export interface FintocAccount {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  lastSyncedAt: string;
}

export interface BankLink {
  id: string;
  fintocId: string;
  institution: string;
  username: string | null;
  status: "active" | "paused" | "disconnected";
  lastSyncedAt: string;
  accounts: FintocAccount[];
}

export interface CreateLinkParams {
  publicToken: string;
}

export interface SyncResponse {
  message: string;
  movementsSynced: number;
}
