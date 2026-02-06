export interface FintocAccount {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  lastSyncedAt: string;
}

export interface FintocLinkUrlResponse {
  link_url: string;
}

export type CreateFintocLinkResponse = FintocLinkUrlResponse | BankLink;

export type CreateLinkIntentResponse = {
  widget_token: string;
};

export type ExchangeTokenParams = {
  exchangeToken: string;
};

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
  status: "queued" | "already_queued";
  jobId: string;
}

export type SyncAllResponse = {
  status: "queued" | "already_queued" | "cooldown" | "no_links";
  queued: number;
  alreadyQueued: number;
  cooldownLinks: number;
  totalLinks?: number;
  retryAfterSeconds?: number;
  retryAfterMs?: number;
};
