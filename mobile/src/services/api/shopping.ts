import type { ShoppingList, ShoppingItem } from '@/types';
import { mockShoppingLists } from '@/mock';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function getShoppingLists(): Promise<ShoppingList[]> {
  await delay();
  return mockShoppingLists;
}

export async function getShoppingListById(id: string): Promise<ShoppingList | null> {
  await delay(400);
  return mockShoppingLists.find((l) => l.id === id) ?? null;
}

export async function createShoppingList(name: string): Promise<ShoppingList> {
  await delay();
  return {
    id: 'list-' + Date.now(),
    name,
    items: [],
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function addShoppingItem(
  listId: string,
  item: Omit<ShoppingItem, 'id' | 'checked'>,
): Promise<ShoppingItem> {
  await delay(300);
  return { ...item, id: 'si-' + Date.now(), checked: false };
}

export async function toggleShoppingItem(listId: string, itemId: string): Promise<boolean> {
  await delay(200);
  return true;
}

export async function deleteShoppingItem(listId: string, itemId: string): Promise<void> {
  await delay(200);
}

export async function shareShoppingList(listId: string, userId: string): Promise<void> {
  await delay(500);
}

export async function deleteShoppingList(listId: string): Promise<void> {
  await delay(400);
}
