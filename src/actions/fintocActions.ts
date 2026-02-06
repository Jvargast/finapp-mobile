import { FintocService } from "../services/fintoc.service";
import { useFintocStore } from "../stores/useFintocStore";
import { useToastStore } from "../stores/useToastStore";
import { AccountActions } from "./accountActions";
import { TransactionActions } from "./transactionActions";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function refreshAfterSyncBackground() {
  const delays = [2000, 5000, 10000, 15000];

  for (const d of delays) {
    await sleep(d);
    await Promise.all([
      AccountActions.loadAccounts(),
      TransactionActions.loadTransactions(),
    ]);
  }
}
const isDoneState = (s?: string) =>
  s === "idle" || s === "completed" || s === "not_found" || s === "success";

async function waitForLinksSyncDone(linkIds: string[], timeoutMs = 60_000) {
  if (linkIds.length === 0) return { ok: true, states: [] as string[] };
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const states = await Promise.all(
      linkIds.map(async (id) => {
        try {
          const st = await FintocService.syncStatus(id);
          return st?.state ?? "unknown";
        } catch {
          return "unknown";
        }
      }),
    );

    const allDone = states.every(isDoneState);
    const anyFailed = states.some((s) => s === "failed");

    if (anyFailed) return { ok: false, reason: "failed", states };
    if (allDone) return { ok: true, states };

    await sleep(2000);
  }

  return { ok: false, reason: "timeout" as const };
}

export const FintocActions = {
  loadLinks: async (status: "active" | "disconnected" | "all" = "active") => {
    const store = useFintocStore.getState();
    store.setLoading(true);
    try {
      const links = await FintocService.getAll(status);
      store.setLinks(links);
      return links;
    } catch (error) {
      console.error("Error cargando bancos conectados", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  startLinking: async () => {
    try {
      const { widget_token } = await FintocService.createLinkIntent();
      return widget_token;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("No se pudo iniciar la conexión", "error");
      throw error;
    }
  },

  finishLinking: async (exchangeToken: string) => {
    const store = useFintocStore.getState();
    try {
      const newLink = await FintocService.exchangeToken({ exchangeToken });

      store.upsertLink(newLink);
      console.log("🔄 Sync recién conectado. bankLinkId:", newLink.id);
      FintocService.sync(newLink.id)
        .then((syncRes) => console.log("✅ Sync result:", syncRes))
        .catch((e) => console.log("⚠️ Sync failed (will retry later):", e));

      void refreshAfterSyncBackground();

      useToastStore
        .getState()
        .showToast(
          "Banco conectado. Sincronizando en segundo plano…",
          "success",
        );

      return newLink;
    } catch (error) {
      console.error("Error finalizando vinculación", error);
      useToastStore
        .getState()
        .showToast("Error al conectar con el banco", "error");
      throw error;
    }
  },

  syncLink: async (linkId: string) => {
    const store = useFintocStore.getState();
    store.setLoading(true);

    try {
      const res = await FintocService.sync(linkId);

      useToastStore
        .getState()
        .showToast(
          res.status === "already_queued"
            ? "Ya había una sincronización en cola…"
            : "Sincronización en cola…",
          "info",
        );

      void (async () => {
        await Promise.all([
          AccountActions.loadAccounts(),
          TransactionActions.loadTransactions(),
        ]);

        const delays = [2000, 5000, 10000, 15000];
        for (const d of delays) {
          await new Promise((r) => setTimeout(r, d));
          await Promise.all([
            AccountActions.loadAccounts(),
            TransactionActions.loadTransactions(),
          ]);
        }

        useToastStore
          .getState()
          .showToast("Sincronización finalizada", "success");
      })();

      return res;
    } catch (error) {
      console.error("Error sincronizando", error);
      useToastStore.getState().showToast("Error al sincronizar", "error");
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  syncAll: async () => {
    const store = useFintocStore.getState();
    store.setLoading(true);

    try {
      const res = await FintocService.syncAll();

      if (res.status === "cooldown") {
        const FIFTEEN_MIN = 15 * 60 * 1000;
        useFintocStore
          .getState()
          .setSyncAllCooldownUntilMs(Date.now() + FIFTEEN_MIN);

        useToastStore
          .getState()
          .showToast(
            `Disponible en ${Math.ceil((res.retryAfterSeconds ?? 0) / 60)} min`,
            "info",
          );
        return res;
      }

      if (res.status === "no_links") {
        useToastStore
          .getState()
          .showToast("No tienes bancos conectados", "info");
        return res;
      }

      useToastStore.getState().showToast("Sincronización en cola…", "info");

      const links = await FintocService.getAll("active");
      const linkIds = links.map((l) => l.id);

      const done = await waitForLinksSyncDone(linkIds, 60_000);

      await Promise.all([
        AccountActions.loadAccounts(),
        TransactionActions.loadTransactions(),
      ]);

      if (done.ok) {
        useToastStore
          .getState()
          .showToast("Sincronización finalizada", "success");
      } else if (done.reason === "failed") {
        useToastStore.getState().showToast("Falló la sincronización", "error");
      } else {
        useToastStore
          .getState()
          .showToast(
            "Sincronización en curso… se actualizará en segundo plano",
            "info",
          );
        void refreshAfterSyncBackground();
      }

      return res;
    } catch (error) {
      console.error("Error syncAll", error);
      useToastStore.getState().showToast("Error al sincronizar", "error");
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  disconnectLink: async (linkId: string, deleteAccounts = false) => {
    const store = useFintocStore.getState();
    store.setLoading(true);

    try {
      const res = await FintocService.disconnect(linkId, deleteAccounts);

      await FintocActions.loadLinks("active");

      await Promise.all([
        AccountActions.loadAccounts(),
        TransactionActions.loadTransactions(),
      ]);

      useToastStore
        .getState()
        .showToast(
          deleteAccounts
            ? `Banco desconectado y cuentas eliminadas (${res.deletedAccounts})`
            : "Banco desconectado",
          "success",
        );

      return res;
    } catch (error) {
      console.error("Error desconectando banco", error);
      useToastStore.getState().showToast("No se pudo desconectar", "error");
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  backfillColors: async () => {
    const store = useFintocStore.getState();
    store.setLoading(true);
    try {
      const res = await FintocService.backfillColors();

      await AccountActions.loadAccounts();

      useToastStore
        .getState()
        .showToast(`Colores actualizados: ${res.updated}`, "success");

      return res;
    } catch (error) {
      console.error("Error backfill colors", error);
      useToastStore.getState().showToast("Falló backfill de colores", "error");
      throw error;
    } finally {
      store.setLoading(false);
    }
  },
};
