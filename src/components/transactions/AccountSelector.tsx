import React from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";
import { Account } from "../../types/account.types";
import { AccountItem } from "./AccountItem"; 

interface Props {
  accounts: Account[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const AccountSelector = ({ accounts, selectedId, onSelect }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 10,
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
