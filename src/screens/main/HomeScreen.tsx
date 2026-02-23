import { useCallback } from "react";
import { ScrollView } from "tamagui";
import { MainLayout } from "../../components/layout/MainLayout";
import { HomeHeader } from "../../components/home/HomeHeader";
import { BalanceCard } from "../../components/home/BalanceCard";
import { HomePriorityRail } from "../../components/home/HomePriorityRail";
import { AccountsCarousel } from "../../components/home/AccountsCarousel";
import { RecentTransactions } from "../../components/home/RecentTransactions";
import { AccountActions } from "../../actions/accountActions";
import { TransactionActions } from "../../actions/transactionActions";
import { AnalyticsPreview } from "../../components/home/AnalyticsPreview";
import { HomeGoalsBudgetRow } from "../../components/home/HomeGoalsBudgetRow";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  useFocusEffect(
    useCallback(() => {
      AccountActions.loadAccounts();
      TransactionActions.loadRecent();
    }, []),
  );

  return (
    <MainLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <HomePriorityRail />
        <BalanceCard />
        <AccountsCarousel />
        <AnalyticsPreview />
        <HomeGoalsBudgetRow />
        <RecentTransactions />
      </ScrollView>
    </MainLayout>
  );
}
