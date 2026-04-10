import type { ProgressPhoto } from '@/types';
import apiClient from './client';

export async function getProgressPhotos(): Promise<ProgressPhoto[]> {
  try {
    const { data } = await apiClient.get('/progress-photos');
    return (data.data || []).map((p: any) => ({
      id: p.id,
      uri: p.photo_url,
      date: p.taken_at?.split('T')[0] || '',
      weight: p.weight_at_time ? parseFloat(p.weight_at_time) : undefined,
      note: p.notes,
    }));
  } catch {
    return [];
  }
}

export async function addProgressPhoto(photo: Omit<ProgressPhoto, 'id'>): Promise<ProgressPhoto> {
  try {
    const { data } = await apiClient.post('/progress-photos', {
      photoUrl: photo.uri,
      weightAtTime: photo.weight,
      notes: photo.note,
    });
    const p = data.data;
    return {
      id: p.id,
      uri: p.photo_url,
      date: p.taken_at?.split('T')[0] || '',
      weight: p.weight_at_time ? parseFloat(p.weight_at_time) : undefined,
      note: p.notes,
    };
  } catch {
    return { ...photo, id: 'pp-' + Date.now() };
  }
}

export async function deleteProgressPhoto(id: string): Promise<void> {
  try {
    await apiClient.delete(`/progress-photos/${id}`);
  } catch {
    // silently fail
  }
}
