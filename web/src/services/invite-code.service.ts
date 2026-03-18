import api from "@/lib/axios";

export interface InviteCode {
  id: string;
  code: string;
  isActive: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

export interface InviteCodeStats {
  totalCodes: number;
  activeCodes: number;
  usedCodes: number;
}

export async function generateCode(_params?: Record<string, unknown>): Promise<InviteCode> {
  const { data } = await api.post("/dietitians/me/invite-code/regenerate");
  return { id: "new", code: (data as any).inviteCode ?? data, isActive: true, createdAt: new Date().toISOString() };
}

export async function getCodes(): Promise<InviteCode[]> {
  const { data } = await api.get("/dietitians/me/invite-code");
  const code = (data as any).inviteCode ?? (typeof data === "string" ? data : "");
  return code ? [{ id: "current", code, isActive: true, createdAt: new Date().toISOString() }] : [];
}

export async function deactivateCode(_codeId: string): Promise<{ success: boolean }> {
  // Regenerating effectively deactivates the old code
  await api.post("/dietitians/me/invite-code/regenerate");
  return { success: true };
}

export async function getCodeStats(): Promise<InviteCodeStats> {
  return { totalCodes: 1, activeCodes: 1, usedCodes: 0 };
}
