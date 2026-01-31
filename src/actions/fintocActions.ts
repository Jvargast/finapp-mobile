import { FintocService } from "../services/fintoc.service";
import { useFintocStore } from "../stores/useFintocStore";
import { useToastStore } from "../stores/useToastStore";
import { AccountActions } from "./accountActions";
import { TransactionActions } from "./transactionActions";

export const FintocActions = {
  loadLinks: async () => {
    const store = useFintocStore.getState();
    store.setLoading(true);
    try {
      const links = await FintocService.getAll();
      store.setLinks(links);
    } catch (error) {
      console.error("Error cargando bancos conectados", error);
    } finally {
      store.setLoading(false);
    }
  },

  createLink: async (publicToken: string) => {
    const store = useFintocStore.getState();

    try {
      const newLink = await FintocService.createLink({ publicToken });

      store.addLink(newLink);

      await Promise.all([
        AccountActions.loadAccounts(),
        TransactionActions.loadTransactions(),
      ]);

      useToastStore
        .getState()
        .showToast("Banco conectado exitosamente", "success");
      return newLink;
    } catch (error) {
      console.error("Error vinculando banco", error);
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
      const result = await FintocService.sync(linkId);

      if (result.movementsSynced > 0) {
        await Promise.all([
          AccountActions.loadAccounts(),
          TransactionActions.loadTransactions(),
        ]);
        useToastStore
          .getState()
          .showToast(
            `Sincronizados ${result.movementsSynced} movimientos`,
            "success"
          );
      } else {
        useToastStore.getState().showToast("Tus cuentas están al día", "info");
      }
    } catch (error) {
      console.error("Error sincronizando", error);
      useToastStore.getState().showToast("Error al sincronizar", "error");
    } finally {
      store.setLoading(false);
    }
  },

  deleteLink: async (linkId: string) => {
    const store = useFintocStore.getState();
    store.setLoading(true);
    try {
      await FintocService.delete(linkId);

      store.removeLink(linkId);

      await AccountActions.loadAccounts();
      await TransactionActions.loadTransactions();

      useToastStore.getState().showToast("Conexión eliminada", "success");
    } catch (error) {
      console.error("Error eliminando banco", error);
      useToastStore.getState().showToast("No se pudo desconectar", "error");
    } finally {
      store.setLoading(false);
    }
  },
};
