import { useCallback } from 'react';
import { useProfileStore } from '@/stores';
import type { FamilyMember } from '@/types';

export function useFamily() {
  const store = useProfileStore();

  const loadFamilyMembers = useCallback(async () => {
    await store.loadFamilyMembers();
  }, [store.loadFamilyMembers]);

  const addFamilyMember = useCallback(
    async (member: Omit<FamilyMember, 'id'>) => {
      await store.addFamilyMember(member);
    },
    [store.addFamilyMember],
  );

  const removeFamilyMember = useCallback(
    async (id: string) => {
      await store.removeFamilyMember(id);
    },
    [store.removeFamilyMember],
  );

  const updateFamilyMember = useCallback(
    async (id: string, data: Partial<FamilyMember>) => {
      await store.updateFamilyMember(id, data);
    },
    [store.updateFamilyMember],
  );

  return {
    familyMembers: store.familyMembers,
    loadFamilyMembers,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember,
  };
}
