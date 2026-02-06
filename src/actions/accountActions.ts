import { AccountService } from "../services/accountService";
import { useAccountStore } from "../stores/useAccountStore";

export const AccountActions = {
  loadAccounts: async () => {
    const store = useAccountStore.getState();
    store.setLoading(true);

    try {
      const accounts = await AccountService.getAll();
      console.log(
        "📦 /accounts =>",
        accounts.length,
        accounts.map((a) => ({
          id: a.id,
          name: a.name,
          bankLinkId: a.bankLinkId,
        })),
      );
      store.setAccounts(accounts);
    } catch (error) {
      console.error("Error cargando cuentas:", error);
    } finally {
      store.setLoading(false);
    }
  },

  createAccount: async (data: any) => {
    const store = useAccountStore.getState();
    store.setLoading(true);

    try {
      const newAccount = await AccountService.create(data);
      store.addAccount(newAccount);
      return true;
    } catch (error) {
      console.error("Error creando cuenta:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  updateAccount: async (data: any) => {
    const store = useAccountStore.getState();
    store.setLoading(true);

    try {
      const updatedAccount = await AccountService.update(data.id, data);
      store.updateAccount(updatedAccount);

      return true;
    } catch (error) {
      console.error("Error actualizando cuenta:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  deleteAccount: async (id: string) => {
    const store = useAccountStore.getState();
    const previousAccounts = store.accounts;

    store.removeAccount(id);

    try {
      await AccountService.delete(id);
    } catch (error) {
      console.error("Error borrando cuenta:", error);
      store.setAccounts(previousAccounts);
      throw error;
    }
  },
};
