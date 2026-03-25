import { useState, useCallback, useMemo } from "react";
import {
  getShoppingLists,
  toggleItem as toggleItemApi,
  addItem as addItemApi,
  deleteItem as deleteItemApi,
} from "@/services/shopping.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  patientId: string;
  mealPlanId: string;
  name: string;
  status: "active" | "completed" | "archived";
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Shopping list operations.
 */
export function useShoppingLists(patientId?: string) {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShoppingLists = useCallback(
    async (targetPatientId?: string) => {
      const pid = targetPatientId ?? patientId;
      setIsLoading(true);
      setError(null);
      try {
        const all = await getShoppingLists();
        const items = all as unknown as ShoppingList[];
        const filtered = pid
          ? items.filter((sl) => sl.patientId === pid)
          : items;
        setShoppingLists(filtered);
      } catch {
        setError("Failed to fetch shopping lists");
      } finally {
        setIsLoading(false);
      }
    },
    [patientId],
  );

  const toggleItem = useCallback(
    async (listId: string, itemId: string) => {
      setError(null);
      try {
        await toggleItemApi(itemId);
        setShoppingLists((prev) =>
          prev.map((sl) =>
            sl.id === listId
              ? {
                  ...sl,
                  items: sl.items.map((item) =>
                    item.id === itemId
                      ? { ...item, checked: !item.checked }
                      : item,
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : sl,
          ),
        );
      } catch {
        setError("Failed to update item");
      }
    },
    [],
  );

  const addItem = useCallback(
    async (
      listId: string,
      item: Omit<ShoppingListItem, "id" | "checked">,
    ) => {
      setError(null);
      try {
        const result = await addItemApi(listId, { foodName: item.name, amount: item.quantity, category: item.category });
        const newItem: ShoppingListItem = {
          id: (result as any)?.id ?? `sli_${Date.now()}`,
          ...item,
          checked: false,
        };
        setShoppingLists((prev) =>
          prev.map((sl) =>
            sl.id === listId
              ? {
                  ...sl,
                  items: [...sl.items, newItem],
                  updatedAt: new Date().toISOString(),
                }
              : sl,
          ),
        );
        return newItem;
      } catch {
        setError("Failed to add item");
        return null;
      }
    },
    [],
  );

  const removeItem = useCallback(
    async (listId: string, itemId: string) => {
      setError(null);
      try {
        await deleteItemApi(itemId);
        setShoppingLists((prev) =>
          prev.map((sl) =>
            sl.id === listId
              ? {
                  ...sl,
                  items: sl.items.filter((i) => i.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : sl,
          ),
        );
      } catch {
        setError("Failed to remove item");
      }
    },
    [],
  );

  const activeList = useMemo(
    () => shoppingLists.find((sl) => sl.status === "active") ?? null,
    [shoppingLists],
  );

  return {
    shoppingLists,
    activeList,
    isLoading,
    error,
    fetchShoppingLists,
    toggleItem,
    addItem,
    removeItem,
  };
}
