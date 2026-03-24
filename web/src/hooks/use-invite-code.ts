import { useState, useCallback } from "react";
import {
  getCodes,
  generateCode,
  deactivateCode,
} from "@/services/invite-code.service";

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
      const data = await getCodes();
      setInviteCodes(data as unknown as InviteCode[]);
    } catch {
      setError("Failed to fetch invite codes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInviteCode = useCallback(async (_data: CreateInviteData) => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await generateCode();
      setInviteCodes((prev) => [created as unknown as InviteCode, ...prev]);
      return created as unknown as InviteCode;
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
      await deactivateCode(inviteId);
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
