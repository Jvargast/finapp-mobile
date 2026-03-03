import React from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";
import { Account } from "../../types/account.types";
import { AccountItem } from "./AccountItem"; 

interface Props {
  accounts: Account[];
  selectedId: string;
  onSelect: (id: string) => void;
  embedded?: boolean;
}

export const AccountSelector = ({
  accounts,
  selectedId,
  onSelect,
  embedded = false,
}: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      nestedScrollEnabled
      contentContainerStyle={{
        paddingHorizontal: embedded ? 0 : 20,
        paddingVertical: embedded ? 6 : 10,
        gap: 12,
      }}
      style={{ flexGrow: 0 }}
    >
      {accounts.map((acc) => (
        <AccountItem
          key={acc.id}
          account={acc}
          isSelected={selectedId === acc.id}
          onSelect={onSelect}
        />
      ))}
      <YStack width={10} />
    </ScrollView>
  );
};
