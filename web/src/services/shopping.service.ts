import api from "@/lib/axios";

import type { ShoppingList } from "@/types/shopping";
export type { ShoppingList };

export async function getShoppingLists(): Promise<ShoppingList[]> {
  const { data } = await api.get("/shopping-lists");
  return (Array.isArray(data) ? data : []) as ShoppingList[];
}

export async function createList(listData: Partial<ShoppingList>): Promise<ShoppingList> {
  const { data } = await api.post("/shopping-lists", listData);
  return data as ShoppingList;
}

export async function updateList(id: string, listData: Partial<ShoppingList>): Promise<ShoppingList> {
  const { data } = await api.patch(`/shopping-lists/${id}`, listData);
  return data as ShoppingList;
}

export async function toggleItem(itemId: string): Promise<unknown> {
  const { data } = await api.patch(`/shopping-lists/items/${itemId}/toggle`);
  return data;
}

export async function deleteList(id: string): Promise<{ success: boolean }> {
  await api.delete(`/shopping-lists/${id}`);
  return { success: true };
}

export async function addItem(
  listId: string,
  item: { foodName: string; amount?: string; category?: string },
): Promise<unknown> {
  const { data } = await api.post(`/shopping-lists/${listId}/items`, item);
  return data;
}

export async function deleteItem(itemId: string): Promise<void> {
  await api.delete(`/shopping-lists/items/${itemId}`);
}

export async function shareList(_listId: string, _patientId: string): Promise<{ success: boolean }> {
  // Share code is generated on creation — just return success
  return { success: true };
}
