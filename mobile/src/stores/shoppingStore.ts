import { create } from 'zustand';
import type { ShoppingList, ShoppingItem } from '@/types';
import * as shoppingApi from '@/services/api/shopping';

interface ShoppingState {
  lists: ShoppingList[];
  activeList: ShoppingList | null;
}

interface ShoppingActions {
  loadLists: () => Promise<void>;
  setActiveList: (list: ShoppingList | null) => void;
  createList: (name: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'checked'>) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
}

type ShoppingStore = ShoppingState & ShoppingActions;

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
  lists: [],
  activeList: null,

  loadLists: async () => {
    const lists = await shoppingApi.getShoppingLists();
    set({ lists });
  },

  setActiveList: (list) => set({ activeList: list }),

  createList: async (name) => {
    const list = await shoppingApi.createShoppingList(name);
    set((state) => ({ lists: [...state.lists, list] }));
  },

  deleteList: async (id) => {
    await shoppingApi.deleteShoppingList(id);
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
      activeList: state.activeList?.id === id ? null : state.activeList,
    }));
  },

  addItem: async (listId, item) => {
    const newItem = await shoppingApi.addShoppingItem(listId, item);
    set((state) => {
      const lists = state.lists.map((l) =>
        l.id === listId
          ? { ...l, items: [...l.items, newItem], updatedAt: new Date().toISOString() }
          : l,
      );
      const activeList =
        state.activeList?.id === listId
          ? { ...state.activeList, items: [...state.activeList.items, newItem], updatedAt: new Date().toISOString() }
          : state.activeList;
      return { lists, activeList };
    });
  },

  toggleItem: async (listId, itemId) => {
    await shoppingApi.toggleShoppingItem(listId, itemId);
    set((state) => {
      const toggleInList = (list: ShoppingList): ShoppingList => ({
        ...list,
        items: list.items.map((i) =>
          i.id === itemId ? { ...i, checked: !i.checked } : i,
        ),
        updatedAt: new Date().toISOString(),
      });

      return {
        lists: state.lists.map((l) => (l.id === listId ? toggleInList(l) : l)),
        activeList:
          state.activeList?.id === listId
            ? toggleInList(state.activeList)
            : state.activeList,
      };
    });
  },

  removeItem: async (listId, itemId) => {
    await shoppingApi.deleteShoppingItem(listId, itemId);
    set((state) => {
      const removeFromList = (list: ShoppingList): ShoppingList => ({
        ...list,
        items: list.items.filter((i) => i.id !== itemId),
        updatedAt: new Date().toISOString(),
      });

      return {
        lists: state.lists.map((l) => (l.id === listId ? removeFromList(l) : l)),
        activeList:
          state.activeList?.id === listId
            ? removeFromList(state.activeList)
            : state.activeList,
      };
    });
  },
}));
