// ---------------------------------------------------------------------------
// Axios Instance & Interceptors
// ---------------------------------------------------------------------------

import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "./constants";

// ── snake_case → camelCase key transformer ──────────────────────────────────

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function transformKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(transformKeys);
  if (obj && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        snakeToCamel(k),
        transformKeys(v),
      ]),
    );
  }
  return obj;
}

// ── Backend response envelope ───────────────────────────────────────────────

interface BackendEnvelope<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Pre-configured Axios instance for all API calls.
 *
 * - Reads access-token from localStorage and attaches it as a Bearer header.
 * - Unwraps backend `{ success, data, meta }` envelopes automatically.
 * - Converts snake_case keys to camelCase in responses.
 * - Converts camelCase keys to snake_case in request bodies.
 * - Intercepts 401 responses and attempts token refresh.
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // NOTE: Request body is NOT transformed to snake_case because
    // backend Zod schemas expect camelCase (firstName, lastName, etc.)

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => {
    // Unwrap backend envelope and convert snake_case → camelCase
    const body = response.data;
    if (body && typeof body === "object" && "success" in body) {
      const envelope = body as BackendEnvelope;
      response.data = transformKeys(envelope.data);
      // Preserve meta on a custom property for pagination
      if (envelope.meta) {
        (response as typeof response & { meta?: unknown }).meta = transformKeys(envelope.meta);
      }
    } else {
      response.data = transformKeys(body);
    }
    return response;
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // Handle 401 – attempt a single token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data: body } = await axios.post<BackendEnvelope<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
          tokenType: string;
        }>>(`${API_URL}/auth/refresh-token`, { refreshToken });

        const tokens = body.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }

        return api(originalRequest);
      } catch {
        // Refresh failed — clear all auth state, then redirect once
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("nutriai-auth");
        // Avoid reload loop if already on /login
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(error);
      }
    }

    // Normalise error shape for consumers
    const message =
      error.response?.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : error.message;

    // Show global error toast for non-auth errors
    if (error.response?.status !== 401) {
      toast.error(message ?? "Bir hata oluştu");
    }

    return Promise.reject(new Error(message));
  },
);

export default api;

/**
 * Extract pagination meta from an API response.
 * Backend sends meta via the response interceptor's custom `.meta` property.
 */
export function extractMeta(response: any): Record<string, unknown> | undefined {
  return response?.meta;
}
