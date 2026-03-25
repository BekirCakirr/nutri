import type { ShoppingList, ShoppingItem } from '@/types';
import apiClient from './client';

export async function getShoppingLists(): Promise<ShoppingList[]> {
  const { data } = await apiClient.get('/shopping-lists');
  return (data.data ?? data ?? []) as ShoppingList[];
}

export async function getShoppingListById(id: string): Promise<ShoppingList | null> {
  try {
    const { data } = await apiClient.get(`/shopping-lists/${id}`);
    return (data.data ?? data) as ShoppingList;
  } catch {
    return null;
  }
}

export async function createShoppingList(name: string): Promise<ShoppingList> {
  const { data } = await apiClient.post('/shopping-lists', { name });
  return (data.data ?? data) as ShoppingList;
}

export async function addShoppingItem(listId: string, item: Partial<ShoppingItem>): Promise<ShoppingItem> {
  const { data } = await apiClient.post(`/shopping-lists/${listId}/items`, item);
  return (data.data ?? data) as ShoppingItem;
}

export async function toggleShoppingItem(listId: string, itemId: string): Promise<boolean> {
  await apiClient.patch(`/shopping-lists/items/${itemId}/toggle`);
  return true;
}

export async function deleteShoppingItem(_listId: string, itemId: string): Promise<void> {
  await apiClient.delete(`/shopping-lists/items/${itemId}`);
}

export async function shareShoppingList(_listId: string, _userId: string): Promise<void> {
  // Share code is generated on creation
}

export async function deleteShoppingList(listId: string): Promise<void> {
  await apiClient.delete(`/shopping-lists/${listId}`);
}
