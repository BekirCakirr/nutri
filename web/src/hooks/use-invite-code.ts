import { useState, useCallback } from "react";
import { mockInviteCodes, simulateApiCall } from "@/mock";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InviteCode {
  id: string;
  code: string;
  nutritionistId: string;
  patientEmail: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

interface CreateInviteData {
  patientEmail: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Invite code generation and management.
 */
export function useInviteCode() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInviteCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateApiCall(mockInviteCodes, 600);
      setInviteCodes(data as unknown as InviteCode[]);
    } catch {
      setError("Failed to fetch invite codes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInviteCode = useCallback(async (data: CreateInviteData) => {
    setIsLoading(true);
    setError(null);
    try {
      const code = `NUTRI-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const newInvite: InviteCode = {
        id: `inv_${Date.now()}`,
        code,
        nutritionistId: "usr_001",
        patientEmail: data.patientEmail,
        status: "pending",
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };
      const created = await simulateApiCall(newInvite, 500);
      setInviteCodes((prev) => [created, ...prev]);
      return created;
    } catch {
      setError("Failed to create invite code");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeInviteCode = useCallback(async (inviteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await simulateApiCall(null, 400);
      setInviteCodes((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, status: "revoked" as const } : inv,
        ),
      );
    } catch {
      setError("Failed to revoke invite code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pendingInvites = inviteCodes.filter((inv) => inv.status === "pending");
  const acceptedInvites = inviteCodes.filter((inv) => inv.status === "accepted");

  return {
    inviteCodes,
    pendingInvites,
    acceptedInvites,
    isLoading,
    error,
    fetchInviteCodes,
    createInviteCode,
    revokeInviteCode,
  };
}
