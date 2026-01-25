import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Input,
  Button,
  Switch,
  Slider,
  Avatar,
  Spinner,
  Checkbox,
} from "tamagui";
import { X, Check, Users, Lock, Info } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBudgetStore } from "../../stores/useBudgetStore";
import { useFamilyStore } from "../../stores/useFamilyStore";
import { BudgetActions } from "../../actions/budgetActions";
import { CategorySelector } from "../../components/budget/CategorySelector";
import { BudgetType } from "../../types/budget.types";
import { useUserStore } from "../../stores/useUserStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { CategoryActions } from "../../actions/categoryActions";
import { CreateCategorySheet } from "../../components/category/CreateCategorySheet";
import { ScrollView } from "react-native-gesture-handler";

export default function CreateBudgetScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const categories = useCategoryStore((state) => state.categories);
  const selectedMonth = useBudgetStore((state) => state.selectedMonth);
  const selectedYear = useBudgetStore((state) => state.selectedYear);
  const members = useFamilyStore((state) => state.members);

  useEffect(() => {
    CategoryActions.loadCategories();
  }, []);

  const user = useUserStore((state) => state.user);
  const isPro = useUserStore((state) => state.isPro());
  const canShare = isPro;

  const [isCreateCategoryOpen, setCreateCategoryOpen] = useState(false);
  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (c) => c.type === "EXPENSE" && c.isActive !== false 
      ),
    [categories]
  );

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isRollover, setIsRollover] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [isShared, setIsShared] = useState(false);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    string[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [currency, setCurrency] = useState(
    user?.preferences?.currency || "CLP"
  );

  const formattedAmount = useMemo(() => {
    if (!amount) {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: currency,
      }).format(0);
    }
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  }, [amount, currency]);

  const handleToggleParticipant = (userId: string) => {
    setSelectedParticipantIds((prev) => {
      if (prev.includes(userId)) return prev.filter((id) => id !== userId);
      return [...prev, userId];
    });
  };

  const handleSave = async () => {
    if (!amount || !categoryId || !name.trim()) return;
    Keyboard.dismiss();
    setIsSubmitting(true);

    const finalType = isShared ? BudgetType.SHARED : BudgetType.PERSONAL;

    try {
      await BudgetActions.createBudget({
        name: name,
        amount: Number(amount),
        currency: currency,
        categoryId,
        month: selectedMonth,
        year: selectedYear,
        isRollover,
        warningThreshold,
        type: finalType,
        participantIds: selectedParticipantIds,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    await CategoryActions.deleteCategory(categoryId);
    CategoryActions.loadCategories();
  }, []);

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCreateCategoryOpen(true);
  };

  const handleOpenSheet = useCallback(() => {
    setCreateCategoryOpen(true);
  }, []);

  const periodText = new Date(selectedYear, selectedMonth - 1)
    .toLocaleString("es-CL", { month: "long", year: "numeric" })
    .toUpperCase()
    .replace("DE ", "");

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={Platform.OS === "ios" ? 20 : insets.top}
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$2"
      >
        <Button
          size="$3"
          circular
          chromeless
          icon={X}
          onPress={() => navigation.goBack()}
        />
        <Text fontSize="$4" fontWeight="700">
          Nuevo Presupuesto
        </Text>
        <Button
          size="$3"
          disabled={!amount || !categoryId || isSubmitting}
          backgroundColor={!amount || !categoryId ? "$gray4" : "$color"}
          color="$gray10"
          onPress={handleSave}
          icon={isSubmitting ? <Spinner color="$background" /> : Check}
        >
          Guardar
        </Button>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack padding="$4" space="$5" paddingBottom={insets.bottom + 20}>
          <YStack alignItems="center" space="$2">
            <XStack alignItems="center" space="$2">
              <Text
                fontSize="$3"
                color="$gray10"
                fontWeight="700"
                letterSpacing={1}
              >
                LÍMITE PARA {periodText}
              </Text>
              <YStack
                backgroundColor="$gray4"
                paddingHorizontal="$2"
                borderRadius="$4"
              >
                <Text fontSize={10} fontWeight="bold" color="$gray11">
                  {currency}
                </Text>
              </YStack>
            </XStack>
          </YStack>
          <YStack space="$2">
            <Text
              fontSize="$3"
              fontWeight="700"
              color="$gray10"
              marginLeft="$2"
            >
              NOMBRE DEL PRESUPUESTO
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Ej: Supermercado, Vicios, Ahorro..."
              placeholderTextColor="$gray8"
              backgroundColor="$gray2"
              borderWidth={0}
              borderRadius="$4"
              padding="$3"
              fontSize="$4"
              fontWeight="600"
              color="$color"
            />
          </YStack>
          <YStack alignItems="center" space="$1">
            <Input
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              unstyled
              textAlign="center"
              fontSize={50}
              fontWeight="900"
              color="$color"
              placeholder="$0"
              placeholderTextColor="$gray6"
              maxLength={9}
            />
            <Text fontSize="$5" color="$gray10" opacity={amount ? 1 : 0}>
              {formattedAmount}
            </Text>
          </YStack>

          <CategorySelector
            categories={filteredCategories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            onAddPress={handleOpenSheet}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
          />

          <YStack
            backgroundColor="$gray2"
            borderRadius="$6"
            padding="$4"
            space="$5"
          >
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" fontWeight="600" color="$gray11">
                  Alerta consumo
                </Text>
                <Text fontSize="$3" fontWeight="800" color="$orange10">
                  {warningThreshold}%
                </Text>
              </XStack>
              <Slider
                defaultValue={[80]}
                max={100}
                step={5}
                onValueChange={(val) => setWarningThreshold(val[0])}
              >
                <Slider.Track backgroundColor="$gray4">
                  <Slider.TrackActive backgroundColor="$orange9" />
                </Slider.Track>
                <Slider.Thumb index={0} circular size="$2" />
              </Slider>
            </YStack>

            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1} paddingRight="$4">
                <Text fontSize="$3" fontWeight="700" color="$color">
                  Rollover
                </Text>
                <Text fontSize={11} color="$gray10">
                  Pasar sobrante al próximo mes.
                </Text>
              </YStack>
              <Switch
                size="$3"
                checked={isRollover}
                onCheckedChange={setIsRollover}
                backgroundColor={isRollover ? "$blue9" : "$gray5"}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>

            <YStack opacity={canShare ? 1 : 0.5}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$3" alignItems="center" flex={1}>
                  <YStack
                    backgroundColor={isShared ? "$purple3" : "$gray4"}
                    padding="$2"
                    borderRadius="$3"
                  >
                    <Users
                      size={20}
                      color={isShared ? "$purple10" : "$gray10"}
                    />
                  </YStack>
                  <YStack flex={1}>
                    <XStack alignItems="center" space="$2">
                      <Text
                        fontSize="$3"
                        fontWeight="700"
                        color={isShared ? "$purple10" : "$color"}
                      >
                        Modo Compartido
                      </Text>
                      {!canShare && <Lock size={12} color="$gray10" />}
                    </XStack>
                    <Text fontSize={11} color="$gray10">
                      {canShare
                        ? "Permite que otros colaboren en este gasto."
                        : "Función exclusiva Wou+."}
                    </Text>
                  </YStack>
                </XStack>

                <Switch
                  size="$3"
                  disabled={!canShare}
                  checked={isShared}
                  onCheckedChange={setIsShared}
                  backgroundColor={isShared ? "$purple9" : "$gray5"}
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>

              {isShared && members.length > 0 && (
                <YStack
                  marginTop="$3"
                  paddingLeft="$2"
                  borderLeftWidth={2}
                  borderColor="$purple5"
                >
                  <Text fontSize={11} color="$gray11" marginBottom="$2">
                    Selecciona participantes:
                  </Text>
                  {members.map((member) => (
                    <XStack
                      key={member.id}
                      alignItems="center"
                      space="$3"
                      paddingVertical="$1"
                    >
                      <Checkbox
                        size="$4"
                        checked={selectedParticipantIds.includes(member.id)}
                        onCheckedChange={() =>
                          handleToggleParticipant(member.id)
                        }
                      >
                        <Checkbox.Indicator>
                          <Check />
                        </Checkbox.Indicator>
                      </Checkbox>
                      <Avatar circular size="$3">
                        <Avatar.Image src={member.avatar} />
                        <Avatar.Fallback backgroundColor="$gray5" />
                      </Avatar>
                      <Text fontSize="$3" color="$color" fontWeight="600">
                        {member.name}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              )}

              {isShared && members.length === 0 && (
                <XStack
                  marginTop="$3"
                  backgroundColor="$purple2"
                  padding="$3"
                  borderRadius="$4"
                  space="$2"
                  alignItems="center"
                >
                  <Info size={16} color="$purple10" />
                  <Text fontSize={11} color="$purple11" flex={1}>
                    Al guardar, podrás generar un enlace de invitación desde el
                    detalle del presupuesto para enviárselo a tu pareja.
                  </Text>
                </XStack>
              )}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
      {isCreateCategoryOpen && (
        <CreateCategorySheet
          open={isCreateCategoryOpen}
          onOpenChange={(isOpen) => {
            setCreateCategoryOpen(isOpen);
            if (!isOpen) setEditingCategory(null);
          }}
          type="EXPENSE"
          initialData={editingCategory}
        />
      )}
    </YStack>
  );
}
