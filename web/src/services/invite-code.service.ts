// ---------------------------------------------------------------------------
// Invite Code Service
// ---------------------------------------------------------------------------

import { mockInviteCodes, simulateApiCall } from "@/mock";

type InviteCode = (typeof mockInviteCodes)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface InviteCodeStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function generateCode(params: {
  maxUses?: number;
  expiresAt?: string;
  note?: string;
}): Promise<InviteCode> {
  void params;
  const newCode: InviteCode = {
    id: `inv_${Date.now()}`,
    code: `NUTRI-${Date.now().toString(36).toUpperCase()}`,
    nutritionistId: "usr_001",
    patientEmail: "",
    status: "pending",
    expiresAt: params.expiresAt ?? new Date(Date.now() + 30 * 86_400_000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  return simulateApiCall(newCode, 400);
}

export async function getCodes(): Promise<InviteCode[]> {
  return simulateApiCall([...mockInviteCodes], 300);
}

export async function deactivateCode(
  codeId: string,
): Promise<{ success: boolean }> {
  void codeId;
  return simulateApiCall({ success: true }, 300);
}

export async function getCodeStats(): Promise<InviteCodeStats> {
  const pending = mockInviteCodes.filter((c) => c.status === "pending").length;
  const accepted = mockInviteCodes.filter((c) => c.status === "accepted").length;

  return simulateApiCall(
    {
      total: mockInviteCodes.length,
      pending,
      accepted,
      expired: 0,
    },
    300,
  );
}
