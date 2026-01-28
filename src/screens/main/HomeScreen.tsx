import { useEffect } from "react"; // 1. Importar useEffect
import { ScrollView } from "tamagui";
import { MainLayout } from "../../components/layout/MainLayout";
import { HomeHeader } from "../../components/home/HomeHeader";
import { BalanceCard } from "../../components/home/BalanceCard";
import { QuickActions } from "../../components/home/QuickActions";
import { AccountsCarousel } from "../../components/home/AccountsCarousel";
import { RecentTransactions } from "../../components/home/RecentTransactions";
import { AccountActions } from "../../actions/accountActions";
import { TransactionActions } from "../../actions/transactionActions";

export default function HomeScreen() {
  useEffect(() => {
    const initData = async () => {
      await Promise.all([
        AccountActions.loadAccounts(),
        TransactionActions.loadRecent(),
      ]);
    };
    initData();
  }, []);

  return (
    <MainLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <BalanceCard />
        <QuickActions />
        <AccountsCarousel />
        <RecentTransactions />
      </ScrollView>
    </MainLayout>
  );
}
