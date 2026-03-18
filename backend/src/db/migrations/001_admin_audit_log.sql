-- ============================================================================
-- Migration 001: admin_audit_log table + additional indexes
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    UUID NOT NULL REFERENCES users(id),
  action      VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id   UUID,
  details     JSONB,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log(action);

-- Additional indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_plans_dietitian ON meal_plans(created_by_dietitian_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_status ON meal_plans(status);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_plan ON meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_patient ON shopping_lists(patient_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_dietitian_reviews_dietitian ON dietitian_reviews(dietitian_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_patient ON ai_chat_history(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_weekly_reports_patient ON ai_weekly_reports(patient_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weight_logs_measured ON weight_logs(patient_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(patient_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_date ON exercise_logs(patient_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_date ON sleep_logs(patient_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(user_id, created_at DESC);
