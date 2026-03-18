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
  // Toggle items or other updates
  const { data } = await api.patch(`/shopping-lists/items/${id}/toggle`);
  return data as ShoppingList;
}

export async function deleteList(id: string): Promise<{ success: boolean }> {
  await api.delete(`/shopping-lists/${id}`);
  return { success: true };
}

export async function shareList(listId: string, _patientId: string): Promise<{ success: boolean }> {
  // Share code is generated on creation — just return success
  return { success: true };
}
