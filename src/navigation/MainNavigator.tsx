import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/main/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Sidebar } from "../components/layout/Sidebar";
import EditPreferenceScreen from "../screens/profile/EditPreferenceScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import AppearanceSettingsScreen from "../screens/settings/AppearanceSettingsScreen";
import ChangePasswordScreen from "../screens/settings/ChangePasswordScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import { useTheme } from "tamagui";
import { GoalsScreen } from "../screens/goals/GoalsScreen";
import { CreateGoalScreen } from "../screens/goals/CreateGoalScreen";
import { GoalDetailScreen } from "../screens/goals/GoalDetailScreen";
import { EditGoalScreen } from "../screens/goals/EditGoalScreen";
import AddAccountScreen from "../screens/accounts/AddAccountScreen";
import AccountSourcesScreen from "../screens/accounts/AccountSourcesScreen";
import AccountSetupWizardScreen from "../screens/accounts/AccountSetupWizardScreen";
import AccountDetailScreen from "../screens/accounts/AccountDetailScreen";
import EmailSourceCreateScreen from "../screens/banking/EmailSourceCreateScreen";
import EmailRuleSelectScreen from "../screens/banking/EmailRuleSelectScreen";
import EmailRuleCreateScreen from "../screens/banking/EmailRuleCreateScreen";
import EmailRuleAttachScreen from "../screens/banking/EmailRuleAttachScreen";
import EmailSourceConnectScreen from "../screens/banking/EmailSourceConnectScreen";
import EmailSourcePreviewScreen from "../screens/banking/EmailSourcePreviewScreen";
import EmailSourceSyncScreen from "../screens/banking/EmailSourceSyncScreen";
import PendingMovementsScreen from "../screens/banking/PendingMovementsScreen";
import AccountsScreen from "../screens/main/AccountsScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import SubscriptionScreen from "../screens/subscription/SubscriptionScreen";
import SubscriptionDetailsScreen from "../screens/settings/SubscriptionDetailsScreen";
import FamilyGroupScreen from "../screens/settings/FamilyGroupScreen";
import BankingIntegrationsScreen from "../screens/settings/BankingIntegrationsScreen";
import BudgetScreen from "../screens/budget/BudgetScreen";
import CreateBudgetScreen from "../screens/budget/CreateBudgetScreen";
import ManageCategoriesScreen from "../screens/profile/ManageCategoriesScreen";
import BudgetDetailScreen from "../screens/budget/BudgetDetailScreen";
import AddExpenseScreen from "../screens/transactions/AddExpenseScreen";
import AddIncomeScreen from "../screens/transactions/AddIncomeScreen";
import TransactionDetailScreen from "../screens/transactions/TransactionDetailScreen";
import AllTransactionsScreen from "../screens/transactions/AllTransactionsScreen";
import MovementsScreen from "../screens/transactions/MovementsScreen";
import AddTransferScreen from "../screens/transactions/AddTransferScreen";
import ConnectBankScreen from "../screens/fintoc/ConnectBankScreen";
import FintocWidgetScreen from "../screens/fintoc/FintocWidgetScreen";
import RecurringScreen from "../screens/recurring/RecurringScreen";
import RecurringCreateScreen from "../screens/recurring/RecurringCreateScreen";
import RecurringEditScreen from "../screens/recurring/RecurringEditScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerGroup() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: "80%",
          backgroundColor: "#F8FAFC",
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={DrawerGroup} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: "Mi Perfil",
          headerBackTitle: "Volver",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
          headerShadowVisible: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="EditPreference"
        component={EditPreferenceScreen}
        options={{
          headerShown: true,
          title: "Editar",
          headerBackTitle: "Atrás",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
          headerShadowVisible: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Configuración",
          headerShown: true,
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
        }}
      />
      <Stack.Screen
        name="AppearanceSettings"
        component={AppearanceSettingsScreen}
        options={{
          title: "Apariencia",
          headerShown: true,
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ManageCategories"
        component={ManageCategoriesScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="FamilyGroup"
        component={FamilyGroupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BankingIntegrations"
        component={BankingIntegrationsScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: "Cambiar Contraseña",
          headerBackTitle: "Volver",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: "Editar Perfil",
          animation: "slide_from_bottom",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
        }}
      />
      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="CreateGoal"
        component={CreateGoalScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="EditGoal"
        component={EditGoalScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AddAccount"
        component={AddAccountScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AccountSources"
        component={AccountSourcesScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="AccountSetup"
        component={AccountSetupWizardScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="AccountDetail"
        component={AccountDetailScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="EmailSourceCreate"
        component={EmailSourceCreateScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EmailRuleSelect"
        component={EmailRuleSelectScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EmailRuleCreate"
        component={EmailRuleCreateScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EmailRuleAttach"
        component={EmailRuleAttachScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EmailSourceConnect"
        component={EmailSourceConnectScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EmailSourcePreview"
        component={EmailSourcePreviewScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EmailSourceSync"
        component={EmailSourceSyncScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="PendingMovements"
        component={PendingMovementsScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="SubscriptionDetails"
        component={SubscriptionDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateBudget"
        component={CreateBudgetScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="BudgetDetail"
        component={BudgetDetailScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Budgets"
        component={BudgetScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="AllTransactions"
        component={AllTransactionsScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Movements"
        component={MovementsScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Recurring"
        component={RecurringScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="RecurringCreate"
        component={RecurringCreateScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="RecurringEdit"
        component={RecurringEditScreen}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddTransfer"
        component={AddTransferScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TransactionDetailScreen"
        component={TransactionDetailScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="ConnectBank"
        component={ConnectBankScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FintocWidget"
        component={FintocWidgetScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
