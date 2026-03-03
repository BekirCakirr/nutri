import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/root-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AdminLayout } from '@/layouts/admin-layout'
import { ProtectedRoute } from './protected-route'
import { AdminRoute } from './admin-route'
import { Loader2 } from 'lucide-react'

// Lazy loading wrapper
function PageLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  )
}

function L({ C }: { C: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <C />
    </Suspense>
  )
}

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/login'))
const RegisterPage = lazy(() => import('@/pages/auth/register'))

// Main Pages
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const PatientListPage = lazy(() => import('@/pages/patient-list'))
const PatientDetailPage = lazy(() => import('@/pages/patient-detail'))
const MealReviewPage = lazy(() => import('@/pages/meal-review'))
const PlanCreatorPage = lazy(() => import('@/pages/plan-creator'))
const LiveTrackingPage = lazy(() => import('@/pages/live-tracking'))

// Communication Pages
const MessagesPage = lazy(() => import('@/pages/messages'))
const AppointmentsPage = lazy(() => import('@/pages/appointments'))
const VideoCallPage = lazy(() => import('@/pages/video-call'))

// Feature Pages
const InviteCodePage = lazy(() => import('@/pages/invite-code'))
const RecipesPage = lazy(() => import('@/pages/recipes'))
const RecipeDetailPage = lazy(() => import('@/pages/recipe-detail'))
const ShoppingListsPage = lazy(() => import('@/pages/shopping-lists'))
const ReportsPage = lazy(() => import('@/pages/reports'))
const PatientReportPage = lazy(() => import('@/pages/patient-report'))
const ReviewsPage = lazy(() => import('@/pages/reviews'))
const AIAssistantPage = lazy(() => import('@/pages/ai-assistant'))
const NotificationsPage = lazy(() => import('@/pages/notifications'))
const SettingsPage = lazy(() => import('@/pages/settings'))

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/dashboard'))
const AdminFoodDBPage = lazy(() => import('@/pages/admin/food-db'))
const AdminAllergensPage = lazy(() => import('@/pages/admin/allergens'))
const AdminRecipesPage = lazy(() => import('@/pages/admin/recipes'))
const AdminDietitians = lazy(() => import('@/pages/admin/dietitians'))
const AdminUsersPage = lazy(() => import('@/pages/admin/users'))
const AdminReportsPage = lazy(() => import('@/pages/admin/reports'))

const NotFoundPage = lazy(() => import('@/pages/not-found'))

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth routes
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <L C={LoginPage} /> },
          { path: '/register', element: <L C={RegisterPage} /> },
        ],
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/', element: <L C={DashboardPage} /> },
              { path: '/patients', element: <L C={PatientListPage} /> },
              { path: '/patients/:id', element: <L C={PatientDetailPage} /> },
              { path: '/meal-review', element: <L C={MealReviewPage} /> },
              { path: '/plans/create', element: <L C={PlanCreatorPage} /> },
              { path: '/plans/create/:patientId', element: <L C={PlanCreatorPage} /> },
              { path: '/live-tracking', element: <L C={LiveTrackingPage} /> },
              { path: '/messages', element: <L C={MessagesPage} /> },
              { path: '/messages/:conversationId', element: <L C={MessagesPage} /> },
              { path: '/appointments', element: <L C={AppointmentsPage} /> },
              { path: '/invite-code', element: <L C={InviteCodePage} /> },
              { path: '/recipes', element: <L C={RecipesPage} /> },
              { path: '/recipes/:id', element: <L C={RecipeDetailPage} /> },
              { path: '/shopping-lists', element: <L C={ShoppingListsPage} /> },
              { path: '/reports', element: <L C={ReportsPage} /> },
              { path: '/reports/patient/:id', element: <L C={PatientReportPage} /> },
              { path: '/reviews', element: <L C={ReviewsPage} /> },
              { path: '/ai-assistant', element: <L C={AIAssistantPage} /> },
              { path: '/notifications', element: <L C={NotificationsPage} /> },
              { path: '/settings', element: <L C={SettingsPage} /> },
            ],
          },
          // Video call (fullscreen, no sidebar)
          { path: '/video-call/:id', element: <L C={VideoCallPage} /> },
          // Admin routes
          {
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: '/admin', element: <L C={AdminDashboardPage} /> },
                  { path: '/admin/food-db', element: <L C={AdminFoodDBPage} /> },
                  { path: '/admin/allergens', element: <L C={AdminAllergensPage} /> },
                  { path: '/admin/recipes', element: <L C={AdminRecipesPage} /> },
                  { path: '/admin/dietitians', element: <L C={AdminDietitians} /> },
                  { path: '/admin/users', element: <L C={AdminUsersPage} /> },
                  { path: '/admin/reports', element: <L C={AdminReportsPage} /> },
                ],
              },
            ],
          },
        ],
      },
      // 404
      { path: '*', element: <L C={NotFoundPage} /> },
    ],
  },
])
