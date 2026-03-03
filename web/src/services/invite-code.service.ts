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
  const newCode = {
    id: `inv_${Date.now()}`,
    code: `NUTRI-${Date.now().toString(36).toUpperCase()}`,
    dietitianId: "usr_001",
    dietitianName: "",
    patientName: null,
    patientEmail: "",
    status: "active" as const,
    expiresAt: params.expiresAt ?? new Date(Date.now() + 30 * 86_400_000).toISOString(),
    createdAt: new Date().toISOString(),
    usedAt: null,
    notes: params.note ?? "",
  } satisfies InviteCode;
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
  const pending = mockInviteCodes.filter((c) => c.status === "active").length;
  const accepted = mockInviteCodes.filter((c) => c.status === "used").length;

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
