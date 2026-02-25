import type { FamilyMember } from '@/types';
import { mockProfile } from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  await delay();
  return mockProfile.familyMembers;
}

export async function addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
  await delay();
  return { ...member, id: 'fm-' + Date.now() };
}

export async function updateFamilyMember(id: string, data: Partial<FamilyMember>): Promise<FamilyMember> {
  await delay();
  const found = mockProfile.familyMembers.find((m) => m.id === id);
  return { ...found!, ...data };
}

export async function removeFamilyMember(id: string): Promise<void> {
  await delay(400);
}
