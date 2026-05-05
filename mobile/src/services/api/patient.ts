import apiClient from './client';

/**
 * Backend PUT /patients/me — accepts a partial set of snake_case fields.
 * Only fields that are present in the body are updated; the rest stay untouched.
 */
export interface UpdateMyProfilePayload {
  first_name?: string;
  last_name?: string;
  birth_date?: string; // ISO YYYY-MM-DD
  gender?: string;
  height_cm?: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  activity_level?: string;
  goal_type?: string;
  diet_type?: string;
  daily_water_target?: number;
  sleep_hours?: number;
  profile_photo_url?: string;
  dark_mode?: boolean;
  language?: string;
  notification_enabled?: boolean;
  intermittent_fasting_enabled?: boolean;
  fasting_type?: string;
  fasting_start_hour?: string;
  fasting_end_hour?: string;
}

export async function getMyPatientProfile() {
  const { data } = await apiClient.get('/patients/me');
  return data.data ?? data;
}

export async function updateMyProfile(payload: UpdateMyProfilePayload) {
  // Strip undefined keys so the backend zod .partial() schema validates cleanly
  const clean: Record<string, unknown> = {};
  for (const k of Object.keys(payload) as Array<keyof UpdateMyProfilePayload>) {
    const v = payload[k];
    if (v !== undefined && v !== null && v !== '') clean[k] = v;
  }
  const { data } = await apiClient.put('/patients/me', clean);
  return data.data ?? data;
}
