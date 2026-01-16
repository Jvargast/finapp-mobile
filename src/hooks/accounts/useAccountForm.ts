import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import {
  CreateAccountFormInputs,
  createAccountSchema,
} from "../../screens/main/createAccount.schema";
import { AccountActions } from "../../actions/accountActions";
import { useToastStore } from "../../stores/useToastStore";
import { Account } from "../../types/account.types";
import { useSubscription } from "../useSubscription";

export const useAccountForm = (accountToEdit?: Account) => {
  const navigation = useNavigation();
  const showToast = useToastStore((state) => state.showToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canCreateAccount } = useSubscription();

  const form = useForm<CreateAccountFormInputs>({
    resolver: zodResolver(createAccountSchema) as any,
    mode: "onSubmit",
    defaultValues: {
      name: accountToEdit?.name || "",
      balance: accountToEdit ? String(accountToEdit.balance) : "",
      type: (accountToEdit?.type as any) || "BANK",
      currency: (accountToEdit?.currency as any) || "CLP",
      institution: accountToEdit?.institution || "",
      color: accountToEdit?.color || "DEFAULT",
      isCredit: accountToEdit?.isCredit || false,
    },
  });

  useEffect(() => {
    if (accountToEdit) {
      form.reset({
        name: accountToEdit.name,
        balance: String(accountToEdit.balance),
        type: accountToEdit.type as any,
        currency: accountToEdit.currency as any,
        institution: accountToEdit.institution || "",
        color: accountToEdit.color,
        isCredit: accountToEdit.isCredit || false,
      });
    }
  }, [accountToEdit, form]);

  const onSubmit: SubmitHandler<CreateAccountFormInputs> = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        balance: parseFloat(data.balance),
      };

      if (accountToEdit) {
        await AccountActions.updateAccount({
          id: accountToEdit.id,
          ...payload,
        });
        showToast("Cuenta actualizada correctamente", "success");
      } else {
        if (!canCreateAccount) {
          showToast(
            "Límite alcanzado. Pásate a PRO para más cuentas.",
            "error"
          );
          // navigation.navigate("Paywall");
          return;
        }
        await AccountActions.createAccount(payload);
        showToast("Cuenta creada exitosamente", "success");
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error procesando cuenta:", error);
      showToast("Ocurrió un error al guardar", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submit: form.handleSubmit(onSubmit as any),
    setValue: form.setValue,
    watch: form.watch,
    isEditing: !!accountToEdit,
    canCreate: canCreateAccount,
  };
};
