-- Migration 002: Add dietitian response to reviews + shopping item CRUD support
-- Date: 2026-03-25

-- Add response column to reviews
ALTER TABLE dietitian_reviews ADD COLUMN IF NOT EXISTS dietitian_response TEXT;
ALTER TABLE dietitian_reviews ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;
