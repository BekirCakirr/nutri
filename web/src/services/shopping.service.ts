// ---------------------------------------------------------------------------
// Shopping List Service
// ---------------------------------------------------------------------------

import { mockShoppingLists, simulateApiCall } from "@/mock";

type ShoppingList = (typeof mockShoppingLists)[number];

// ── Public API ───────────────────────────────────────────────────────────────

export async function getShoppingLists(): Promise<ShoppingList[]> {
  return simulateApiCall([...mockShoppingLists], 300);
}

export async function createList(
  data: Partial<ShoppingList>,
): Promise<ShoppingList> {
  const newList = {
    ...mockShoppingLists[0],
    ...data,
    id: `sl_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return simulateApiCall(newList, 400);
}

export async function updateList(
  id: string,
  data: Partial<ShoppingList>,
): Promise<ShoppingList> {
  const existing =
    mockShoppingLists.find((l) => l.id === id) ?? mockShoppingLists[0];
  return simulateApiCall(
    { ...existing, ...data, updatedAt: new Date().toISOString() },
    400,
  );
}

export async function deleteList(
  id: string,
): Promise<{ success: boolean }> {
  void id;
  return simulateApiCall({ success: true }, 300);
}

export async function shareList(
  listId: string,
  patientId: string,
): Promise<{ success: boolean }> {
  void listId;
  void patientId;
  return simulateApiCall({ success: true }, 400);
}
