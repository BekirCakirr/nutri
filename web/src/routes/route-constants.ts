export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Main
  DASHBOARD: '/',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  MEAL_REVIEW: '/meal-review',
  PLAN_CREATOR: '/plans/create',
  PLAN_CREATOR_PATIENT: '/plans/create/:patientId',
  LIVE_TRACKING: '/live-tracking',

  // Communication
  MESSAGES: '/messages',
  MESSAGES_CONVERSATION: '/messages/:conversationId',
  APPOINTMENTS: '/appointments',
  VIDEO_CALL: '/video-call/:id',

  // Features
  INVITE_CODE: '/invite-code',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  SHOPPING_LISTS: '/shopping-lists',
  REPORTS: '/reports',
  PATIENT_REPORT: '/reports/patient/:id',
  REVIEWS: '/reviews',
  AI_ASSISTANT: '/ai-assistant',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_FOOD_DB: '/admin/food-db',
  ADMIN_ALLERGENS: '/admin/allergens',
  ADMIN_RECIPES: '/admin/recipes',
  ADMIN_DIETITIANS: '/admin/dietitians',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
} as const
