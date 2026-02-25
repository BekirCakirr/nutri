import { useCallback } from 'react';
import { useShoppingStore } from '@/stores';
import type { ShoppingItem } from '@/types';

export function useShopping() {
  const store = useShoppingStore();

  const loadLists = useCallback(async () => {
    await store.loadLists();
  }, [store.loadLists]);

  const createList = useCallback(
    async (name: string) => {
      await store.createList(name);
    },
    [store.createList],
  );

  const deleteList = useCallback(
    async (id: string) => {
      await store.deleteList(id);
    },
    [store.deleteList],
  );

  const addItem = useCallback(
    async (listId: string, item: Omit<ShoppingItem, 'id' | 'checked'>) => {
      await store.addItem(listId, item);
    },
    [store.addItem],
  );

  const toggleItem = useCallback(
    async (listId: string, itemId: string) => {
      await store.toggleItem(listId, itemId);
    },
    [store.toggleItem],
  );

  const removeItem = useCallback(
    async (listId: string, itemId: string) => {
      await store.removeItem(listId, itemId);
    },
    [store.removeItem],
  );

  const checkedCount = store.activeList?.items.filter((i) => i.checked).length ?? 0;
  const totalCount = store.activeList?.items.length ?? 0;

  return {
    lists: store.lists,
    activeList: store.activeList,
    checkedCount,
    totalCount,
    loadLists,
    setActiveList: store.setActiveList,
    createList,
    deleteList,
    addItem,
    toggleItem,
    removeItem,
  };
}
