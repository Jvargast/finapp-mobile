import { ScrollView } from "tamagui";
import { MainLayout } from "../../components/layout/MainLayout";
import { HomeHeader } from "../../components/home/HomeHeader";
import { BalanceCard } from "../../components/home/BalanceCard";
import { QuickActions } from "../../components/home/QuickActions";

export default function HomeScreen() {
  return (
    <MainLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <BalanceCard />
        <QuickActions />
      </ScrollView>
    </MainLayout>
  );
}
