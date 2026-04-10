import type { FamilyMember } from '@/types';
import apiClient from './client';

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  try {
    const { data } = await apiClient.get('/family/members');
    return (data.data || []).map((m: any) => ({
      id: m.id,
      name: m.member_name,
      birthDate: m.birth_date,
      relationship: m.relationship || '',
      allergies: (m.allergen_ids || []).map(String),
    }));
  } catch {
    return [];
  }
}

export async function addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
  try {
    const { data } = await apiClient.post('/family/members', {
      memberName: member.name,
      birthDate: member.birthDate,
      relationship: member.relationship,
    });
    const m = data.data;
    return {
      id: m.id,
      name: m.member_name,
      birthDate: m.birth_date,
      relationship: m.relationship || '',
      allergies: (m.allergen_ids || []).map(String),
    };
  } catch {
    return { ...member, id: 'fm-' + Date.now() };
  }
}

export async function updateFamilyMember(id: string, memberData: Partial<FamilyMember>): Promise<FamilyMember> {
  return { id, name: memberData.name || '', relationship: '', allergies: [], ...memberData } as FamilyMember;
}

export async function removeFamilyMember(id: string): Promise<void> {
  try {
    await apiClient.delete(`/family/members/${id}`);
  } catch {
    // silently fail
  }
}
