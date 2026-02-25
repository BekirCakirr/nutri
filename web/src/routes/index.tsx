import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/root-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AdminLayout } from '@/layouts/admin-layout'
import { ProtectedRoute } from './protected-route'
import { AdminRoute } from './admin-route'

// Auth Pages
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'

// Main Pages
import DashboardPage from '@/pages/dashboard'
import PatientListPage from '@/pages/patient-list'
import PatientDetailPage from '@/pages/patient-detail'
import MealReviewPage from '@/pages/meal-review'
import PlanCreatorPage from '@/pages/plan-creator'
import LiveTrackingPage from '@/pages/live-tracking'

// Communication Pages
import MessagesPage from '@/pages/messages'
import AppointmentsPage from '@/pages/appointments'
import VideoCallPage from '@/pages/video-call'

// Feature Pages
import InviteCodePage from '@/pages/invite-code'
import RecipesPage from '@/pages/recipes'
import RecipeDetailPage from '@/pages/recipe-detail'
import ShoppingListsPage from '@/pages/shopping-lists'
import ReportsPage from '@/pages/reports'
import PatientReportPage from '@/pages/patient-report'
import ReviewsPage from '@/pages/reviews'
import AIAssistantPage from '@/pages/ai-assistant'
import NotificationsPage from '@/pages/notifications'
import SettingsPage from '@/pages/settings'

// Admin Pages
import AdminDashboardPage from '@/pages/admin/dashboard'
import AdminFoodDBPage from '@/pages/admin/food-db'
import AdminAllergensPage from '@/pages/admin/allergens'
import AdminRecipesPage from '@/pages/admin/recipes'
import AdminDietitians from '@/pages/admin/dietitians'
import AdminUsersPage from '@/pages/admin/users'
import AdminReportsPage from '@/pages/admin/reports'

import NotFoundPage from '@/pages/not-found'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth routes
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/', element: <DashboardPage /> },
              { path: '/patients', element: <PatientListPage /> },
              { path: '/patients/:id', element: <PatientDetailPage /> },
              { path: '/meal-review', element: <MealReviewPage /> },
              { path: '/plans/create', element: <PlanCreatorPage /> },
              { path: '/plans/create/:patientId', element: <PlanCreatorPage /> },
              { path: '/live-tracking', element: <LiveTrackingPage /> },
              { path: '/messages', element: <MessagesPage /> },
              { path: '/messages/:conversationId', element: <MessagesPage /> },
              { path: '/appointments', element: <AppointmentsPage /> },
              { path: '/invite-code', element: <InviteCodePage /> },
              { path: '/recipes', element: <RecipesPage /> },
              { path: '/recipes/:id', element: <RecipeDetailPage /> },
              { path: '/shopping-lists', element: <ShoppingListsPage /> },
              { path: '/reports', element: <ReportsPage /> },
              { path: '/reports/patient/:id', element: <PatientReportPage /> },
              { path: '/reviews', element: <ReviewsPage /> },
              { path: '/ai-assistant', element: <AIAssistantPage /> },
              { path: '/notifications', element: <NotificationsPage /> },
              { path: '/settings', element: <SettingsPage /> },
            ],
          },
          // Video call (fullscreen, no sidebar)
          { path: '/video-call/:id', element: <VideoCallPage /> },
          // Admin routes
          {
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: '/admin', element: <AdminDashboardPage /> },
                  { path: '/admin/food-db', element: <AdminFoodDBPage /> },
                  { path: '/admin/allergens', element: <AdminAllergensPage /> },
                  { path: '/admin/recipes', element: <AdminRecipesPage /> },
                  { path: '/admin/dietitians', element: <AdminDietitians /> },
                  { path: '/admin/users', element: <AdminUsersPage /> },
                  { path: '/admin/reports', element: <AdminReportsPage /> },
                ],
              },
            ],
          },
        ],
      },
      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
