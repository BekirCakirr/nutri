import type { ShoppingList } from '@/types';

export const mockShoppingLists: ShoppingList[] = [
  {
    id: 'list-1',
    name: 'Haftal\u0131k Al\u0131\u015fveri\u015f',
    createdAt: '2026-02-23T10:00:00Z',
    updatedAt: '2026-02-25T08:00:00Z',
    sharedWith: ['fm-1'],
    items: [
      { id: 'si-1', name: 'Beyaz Peynir', quantity: 1, unit: 'paket', checked: true, category: 'S\u00fct \u00dcr\u00fcnleri' },
      { id: 'si-2', name: 'Yo\u011furt', quantity: 2, unit: 'kg', checked: true, category: 'S\u00fct \u00dcr\u00fcnleri' },
      { id: 'si-3', name: 'Yumurta', quantity: 1, unit: 'koli', checked: false, category: 'S\u00fct \u00dcr\u00fcnleri' },
      { id: 'si-4', name: 'Tavuk G\u00f6\u011fs\u00fc', quantity: 1, unit: 'kg', checked: false, category: 'Et & Bal\u0131k' },
      { id: 'si-5', name: 'K\u0131rm\u0131z\u0131 Mercimek', quantity: 500, unit: 'g', checked: false, category: 'Baklagil' },
      { id: 'si-6', name: 'Bulgur', quantity: 1, unit: 'kg', checked: false, category: 'Tah\u0131l' },
      { id: 'si-7', name: 'Domates', quantity: 1, unit: 'kg', checked: false, category: 'Sebze' },
      { id: 'si-8', name: 'Sal\u0131atal\u0131k', quantity: 5, unit: 'adet', checked: false, category: 'Sebze' },
      { id: 'si-9', name: 'Ispanak', quantity: 1, unit: 'demet', checked: false, category: 'Sebze' },
      { id: 'si-10', name: 'Havuc', quantity: 500, unit: 'g', checked: false, category: 'Sebze' },
      { id: 'si-11', name: 'Elma', quantity: 1, unit: 'kg', checked: false, category: 'Meyve' },
      { id: 'si-12', name: 'Muz', quantity: 6, unit: 'adet', checked: false, category: 'Meyve' },
      { id: 'si-13', name: 'Zeytinya\u011f\u0131', quantity: 1, unit: '\u015fi\u015fe', checked: true, category: 'Ya\u011f' },
      { id: 'si-14', name: 'Tam Bu\u011fday Ekme\u011fi', quantity: 1, unit: 'adet', checked: false, category: 'Ekmek' },
    ],
  },
  {
    id: 'list-2',
    name: 'Cumartesi Kahvalt\u0131s\u0131',
    createdAt: '2026-02-24T18:00:00Z',
    updatedAt: '2026-02-24T18:00:00Z',
    sharedWith: [],
    items: [
      { id: 'si-20', name: 'Simit', quantity: 4, unit: 'adet', checked: false, category: 'Ekmek' },
      { id: 'si-21', name: 'Ka\u015far Peyniri', quantity: 200, unit: 'g', checked: false, category: 'S\u00fct \u00dcr\u00fcnleri' },
      { id: 'si-22', name: 'Siyah Zeytin', quantity: 200, unit: 'g', checked: false, category: 'Zeytin' },
      { id: 'si-23', name: 'Ye\u015fil Zeytin', quantity: 200, unit: 'g', checked: false, category: 'Zeytin' },
      { id: 'si-24', name: 'Bal', quantity: 1, unit: 'kavanoz', checked: false, category: 'Di\u011fer' },
      { id: 'si-25', name: '\u00c7ay', quantity: 1, unit: 'paket', checked: false, category: '\u0130\u00e7ecek' },
    ],
  },
];
