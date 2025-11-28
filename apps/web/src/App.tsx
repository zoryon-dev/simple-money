import { Route, Switch } from 'wouter'
import { AppShell } from '@/components/layout/AppShell'
import { PublicLayout } from '@/components/layout/PublicLayout'

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage'
import { PlansPage } from '@/pages/public/PlansPage'
import { TermsPage } from '@/pages/public/TermsPage'
import { PrivacyPage } from '@/pages/public/PrivacyPage'
import { SupportPage } from '@/pages/public/SupportPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'

// Private Pages
import { DashboardPage } from '@/pages/Dashboard'
import { TransactionsPage } from '@/pages/Transactions'
import { ForecastPage } from '@/pages/Forecast'
import { AnalyticsPage } from '@/pages/Analytics'
import { SavingsPage } from '@/pages/Savings'
import { SettingsPage } from '@/pages/Settings'
import { ProfilePage } from '@/pages/Profile'
import { BillingPage } from '@/pages/Billing'
import { ApiAccessPage } from '@/pages/ApiAccess'
import { HelpCenterPage } from '@/pages/help/HelpCenter'
import { DataManagementPage } from '@/pages/data/DataManagementPage'
import { ChatPage } from '@/pages/ai/ChatPage'
import { InsightsPage } from '@/pages/ai/InsightsPage'

function App() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <LandingPage />
        </PublicLayout>
      </Route>
      <Route path="/login">
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      </Route>
      <Route path="/register">
        <PublicLayout>
          <RegisterPage />
        </PublicLayout>
      </Route>
      <Route path="/forgot-password">
        <PublicLayout>
          <ForgotPasswordPage />
        </PublicLayout>
      </Route>
      <Route path="/plans">
        <PublicLayout>
          <PlansPage />
        </PublicLayout>
      </Route>
      <Route path="/terms">
        <PublicLayout>
          <TermsPage />
        </PublicLayout>
      </Route>
      <Route path="/privacy">
        <PublicLayout>
          <PrivacyPage />
        </PublicLayout>
      </Route>
      <Route path="/support">
        <PublicLayout>
          <SupportPage />
        </PublicLayout>
      </Route>

      {/* Private Routes */}
      <Route path="/dashboard">
        <AppShell>
          <DashboardPage />
        </AppShell>
      </Route>
      <Route path="/transactions">
        <AppShell>
          <TransactionsPage />
        </AppShell>
      </Route>
      <Route path="/forecast">
        <AppShell>
          <ForecastPage />
        </AppShell>
      </Route>
      <Route path="/analytics">
        <AppShell>
          <AnalyticsPage />
        </AppShell>
      </Route>
      <Route path="/savings">
        <AppShell>
          <SavingsPage />
        </AppShell>
      </Route>
      <Route path="/settings">
        <AppShell>
          <SettingsPage />
        </AppShell>
      </Route>
      <Route path="/profile">
        <AppShell>
          <ProfilePage />
        </AppShell>
      </Route>
      <Route path="/billing">
        <AppShell>
          <BillingPage />
        </AppShell>
      </Route>
      <Route path="/api-access">
        <AppShell>
          <ApiAccessPage />
        </AppShell>
      </Route>
      <Route path="/help">
        <AppShell>
          <HelpCenterPage />
        </AppShell>
      </Route>
      <Route path="/data">
        <AppShell>
          <DataManagementPage />
        </AppShell>
      </Route>
      <Route path="/ai-chat">
        <AppShell>
          <ChatPage />
        </AppShell>
      </Route>
      <Route path="/ai-insights">
        <AppShell>
          <InsightsPage />
        </AppShell>
      </Route>
    </Switch>
  )
}

export default App
