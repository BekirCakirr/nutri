// ---------------------------------------------------------------------------
// NutriAI Web – Type Re-exports
// ---------------------------------------------------------------------------
// Central barrel file. Import any type from "@/types" instead of deep paths.
// ---------------------------------------------------------------------------

// Common / shared primitives
export type {
  PaginationParams,
  PaginationMeta,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  SelectOption,
  DateRange,
  TimeRange,
  FileUpload,
  ImageVariant,
  ImageSet,
  Address,
  ContactInfo,
  Timestamps,
  SoftDeletable,
  LocalePreference,
  Metadata,
  ThemeMode,
  GenericStatus,
  DayOfWeek,
  Gender,
  ActivityLevel,
  MacroNutrient,
  NutritionUnit,
  BulkActionResult,
  SearchParams,
  TabItem,
  BreadcrumbItem,
  ConfirmationDialog,
  ToastMessage,
} from "./common";

// Authentication & authorization
export {
  UserRole,
  VerificationStatus,
  SubscriptionTier,
} from "./auth";

export type {
  TwoFactorMethod,
  OAuthProvider,
  User,
  UserSummary,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  EnableTwoFactorRequest,
  EnableTwoFactorResponse,
  VerifyTwoFactorRequest,
  OAuthLoginRequest,
  OAuthCallbackRequest,
  UpdateProfileRequest,
  Session,
  Permission,
  RolePermissions,
} from "./auth";

// Patient
export type {
  PatientStatus,
  DietaryPreference,
  GoalDirection,
  GoalType,
  GoalPriority,
  GoalStatus,
  Patient,
  PatientSummary,
  PatientFilters,
  Goal,
  GoalMilestone,
  MacroTargets,
  MicroTarget,
  Medication,
  EmergencyContact,
  InsuranceInfo,
  HealthMetrics,
  HealthMetricsTrend,
  CreatePatientRequest,
  UpdatePatientRequest,
  OnboardingProgress,
  OnboardingStep,
} from "./patient";

// Dietitian
export { Specialization } from "./dietitian";

export type {
  Credential,
  Education,
  WorkingHoursBlock,
  WorkingHours,
  ConsultationType,
  LanguageProficiency,
  Dietitian,
  SocialLinks,
  DietitianSummary,
  DietitianProfile,
  DietitianDashboard,
  DietitianActivity,
  UpdateDietitianProfileRequest,
  DietitianFilters,
} from "./dietitian";

// Meal
export { MealType } from "./meal";

export type {
  MealLogSource,
  MealVerificationStatus,
  Meal,
  MealEntry,
  MealMood,
  DailyNutritionSummary,
  DailyNutritionTargets,
  NutritionCompliance,
  CreateMealRequest,
  CreateMealEntryRequest,
  UpdateMealRequest,
  QuickAddRequest,
  CopyMealRequest,
  FrequentFood,
  MealHistoryFilters,
} from "./meal";

// Food
export { FoodCategory, NutrientCategory } from "./food";

export type {
  FoodSource,
  FoodItem,
  FoodItemSummary,
  ServingSize,
  Nutrient,
  NutritionInfo,
  NutritionInfoKey,
  CreateFoodItemRequest,
  UpdateFoodItemRequest,
  FoodSearchParams,
  BarcodeScanResult,
  NutritionLabel,
  FoodComparison,
} from "./food";

// Diet plan
export type {
  PlanStatus,
  PlanVisibility,
  PlanFlexibility,
  DietPlan,
  DietPlanSummary,
  PlanDay,
  PlanMeal,
  PlanMealItem,
  PlanMealAlternative,
  PlanTemplate,
  PlanTemplateCategory,
  PlanTemplateSummary,
  CreateDietPlanRequest,
  CreatePlanDayRequest,
  CreatePlanMealRequest,
  CreatePlanMealItemRequest,
  CreatePlanMealAlternativeRequest,
  UpdateDietPlanRequest,
  DietPlanFilters,
  PlanAdherenceDay,
  PlanAdherenceReport,
} from "./plan";

// Appointment
export { AppointmentStatus } from "./appointment";

export type {
  AppointmentMode,
  AppointmentType,
  CancellationReason,
  RecurrencePattern,
  Appointment,
  AppointmentParticipant,
  AppointmentSummaryItem,
  AppointmentSummary,
  FollowUpAction,
  AppointmentReminder,
  TimeSlot,
  DayAvailability,
  AvailabilityOverride,
  AvailabilityQuery,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  CompleteAppointmentRequest,
  AppointmentFilters,
  CalendarViewParams,
} from "./appointment";

// Messaging
export { MessageType } from "./message";

export type {
  ConversationType,
  MessageDeliveryStatus,
  ParticipantRole,
  Conversation,
  ConversationSummary,
  ChatParticipant,
  Message,
  MessagePayload,
  MealLogPayload,
  PlanUpdatePayload,
  AppointmentPayload,
  SystemPayload,
  AiSuggestionPayload,
  MessageAttachment,
  MessageReaction,
  MessageReadReceipt,
  SendMessageRequest,
  EditMessageRequest,
  CreateConversationRequest,
  MarkReadRequest,
  MessageFilters,
  ConversationFilters,
  TypingIndicator,
  MessageEvent,
} from "./message";

// Notification
export { NotificationType } from "./notification";

export type {
  NotificationPriority,
  NotificationChannel,
  Notification,
  NotificationGroup,
  NotificationSummary,
  NotificationPreference,
  NotificationSettings,
  MarkNotificationsReadRequest,
  DismissNotificationsRequest,
  UpdateNotificationSettingsRequest,
  RegisterDeviceTokenRequest,
  NotificationFilters,
  UnreadCounts,
  NotificationEvent,
} from "./notification";

// Tracking
export type {
  WeightEntry,
  WeightTrend,
  WaterEntry,
  WaterDrinkType,
  DailyWaterSummary,
  ExerciseEntry,
  ExerciseCategory,
  ExerciseIntensity,
  ExerciseSet,
  DailyExerciseSummary,
  SleepEntry,
  SleepQuality,
  MoodEntry,
  MoodType,
  BloodValueEntry,
  BloodValueType,
  BodyMeasurementEntry,
  TrackingSource,
  DailyWellnessSummary,
  TrackingFilters,
  TrackingTargets,
  ConnectedDevice,
} from "./tracking";

// Recipe
export { RecipeCategory } from "./recipe";

export type {
  RecipeDifficulty,
  RecipeVisibility,
  DietaryTag,
  Recipe,
  RecipeSummary,
  Ingredient,
  CookingStep,
  CookingTemperature,
  IngredientSubstitution,
  ScaledRecipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  RecipeFilters,
  RecipeCollection,
} from "./recipe";

// Shopping
export { ShoppingCategory } from "./shopping";

export type {
  ShoppingListStatus,
  ShoppingItemStatus,
  ShoppingListSource,
  ShoppingList,
  ShoppingListSummary,
  ShoppingItem,
  StapleItem,
  CreateShoppingListRequest,
  CreateShoppingItemRequest,
  UpdateShoppingItemRequest,
  GenerateShoppingListRequest,
  MergeShoppingListsRequest,
  ShoppingListFilters,
  PriceComparison,
} from "./shopping";

// Review
export type {
  ReviewStatus,
  ReviewTarget,
  Review,
  CategoryRating,
  ReviewResponse,
  RatingSummary,
  ReviewSummary,
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReviewResponseRequest,
  ReviewVoteRequest,
  ReviewFilters,
  ModerateReviewRequest,
} from "./review";

// Gamification
export type {
  BadgeRarity,
  BadgeCategory,
  ChallengeParticipantStatus,
  ChallengeType,
  XPCategory,
  Badge,
  EarnedBadge,
  Achievement,
  AchievementTier,
  AchievementProgress,
  Challenge,
  ChallengeGoal,
  ChallengeParticipation,
  XPEvent,
  Streak,
  StreakType,
  Level,
  GamificationProfile,
  LeaderboardEntry,
  Leaderboard,
  XPHistory,
  Reward,
} from "./gamification";

// Allergy
export { AllergenCategory, AllergySeverity } from "./allergy";

export type {
  AllergyDiagnosisMethod,
  ReactionType,
  Allergen,
  AllergenSummary,
  AllergyInfo,
  AllergyActionPlan,
  AllergyMedication,
  AllergenAlert,
  AllergenCheckResult,
  CreateAllergyRequest,
  UpdateAllergyRequest,
  AllergenCheckRequest,
  AllergenPreset,
} from "./allergy";

// Report
export { ReportType } from "./report";

export type {
  ReportPeriod,
  ReportFormat,
  ReportStatus,
  Report,
  ReportSummary,
  ReportData,
  ReportSummaryData,
  ReportMetric,
  ReportSection,
  ChartData,
  ChartType,
  ChartDataset,
  ChartOptions,
  ChartAnnotation,
  ReportTable,
  ReportTableColumn,
  ReportInsight,
  GenerateReportRequest,
  ScheduleReportRequest,
  ScheduledReport,
  ReportFilters,
} from "./report";

// Admin
export type {
  AdminStats,
  UserStats,
  RevenueStats,
  EngagementStats,
  SystemHealthStats,
  ServiceStatus,
  SystemHealth,
  SystemIncident,
  IncidentUpdate,
  ScheduledMaintenance,
  UserManagementFilters,
  AdminUserAction,
  AdminUserActionResult,
  AdminUserDetail,
  AdminNote,
  AuditLogEntry,
  AuditLogFilters,
  FeatureFlag,
  PlatformSetting,
  Announcement,
  SupportTicket,
  SupportMessage,
} from "./admin";

// Invite codes
export { InviteCodeStatus } from "./invite-code";

export type {
  InviteCodeType,
  InviteCode,
  InviteCodeSummary,
  InviteCodeRedemption,
  CreateInviteCodeRequest,
  BulkCreateInviteCodesRequest,
  RedeemInviteCodeRequest,
  RedeemInviteCodeResponse,
  RevokeInviteCodeRequest,
  ValidateInviteCodeRequest,
  ValidateInviteCodeResponse,
  InviteCodeFilters,
  InviteCodeAnalytics,
} from "./invite-code";

// AI
export type {
  AIProvider,
  AIMessageRole,
  AIConversationType,
  AISuggestionStatus,
  AIConfidence,
  AIConversation,
  AIMessage,
  AIMessageAttachment,
  AIToolCall,
  AIConversationContext,
  AIMessageFeedback,
  FoodAnalysis,
  FoodAnalysisItem,
  FoodAnalysisRequest,
  AISuggestion,
  AISuggestionType,
  AIMealSuggestion,
  AIFoodSwap,
  AINutrientWarning,
  AIRecipeGenerationRequest,
  AIRecipeGenerationResult,
  AIPlanGenerationRequest,
  AIPlanGenerationResult,
  AIProgressInsight,
  AIInsightRequest,
  AIUsageStats,
} from "./ai";
