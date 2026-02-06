import React, { useEffect, useMemo, useState } from "react";
import { Sheet, XStack, YStack, Text, Button, Spinner } from "tamagui";

type Mode = "syncing" | "done" | "cooldown";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  cooldownUntilMs: number | null;
};

const fmtMMSS = (totalSec: number) => {
  const mm = Math.floor(totalSec / 60);
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export const SyncCooldownSheet = ({
  open,
  onOpenChange,
  mode,
  cooldownUntilMs,
}: Props) => {
  const [cooldownLeftSec, setCooldownLeftSec] = useState(0);

  const shouldShowCooldown = mode === "cooldown" && !!cooldownUntilMs;

  const leftNow = useMemo(() => {
    if (!cooldownUntilMs) return 0;
    return Math.max(0, Math.ceil((cooldownUntilMs - Date.now()) / 1000));
  }, [cooldownUntilMs]);

  useEffect(() => {
    if (!open) return;

    if (!shouldShowCooldown) {
      setCooldownLeftSec(0);
      return;
    }

    const tick = () => {
      const left = cooldownUntilMs
        ? Math.max(0, Math.ceil((cooldownUntilMs - Date.now()) / 1000))
        : 0;
      setCooldownLeftSec(left);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [open, shouldShowCooldown, cooldownUntilMs]);

  const displayLeft = shouldShowCooldown ? cooldownLeftSec || leftNow : 0;

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[30]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" space="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize="$5" fontWeight="900">
            {mode === "cooldown"
              ? "Actualización en cooldown"
              : mode === "done"
                ? "Actualizado ✅"
                : "Sincronizando…"}
          </Text>
          {mode === "syncing" ? <Spinner size="small" /> : null}
        </XStack>

        {shouldShowCooldown ? (
          <YStack space="$2">
            <Text color="$gray10">Podrás volver a sincronizar en:</Text>
            <Text fontSize="$8" fontWeight="900">
              {fmtMMSS(displayLeft)}
            </Text>
            <Text color="$gray10">
              Esto limita costos y evita exceso de llamadas.
            </Text>
          </YStack>
        ) : (
          <Text color="$gray10">
            Estamos actualizando tus cuentas y movimientos. Puedes cerrar esta
            ventana.
          </Text>
        )}

        <Button onPress={() => onOpenChange(false)} borderRadius="$10">
          Cerrar
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
