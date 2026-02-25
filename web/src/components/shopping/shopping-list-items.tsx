import { ShoppingItem } from "./shopping-item";

interface Item {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category: string;
}

interface ShoppingListItemsProps {
  items?: Item[];
  onToggle?: (id: string) => void;
}

const defaultItems: Item[] = [
  { id: "1", name: "Tavuk gogsu", quantity: "500g", checked: false, category: "Et & Balik" },
  { id: "2", name: "Somon fileto", quantity: "300g", checked: false, category: "Et & Balik" },
  { id: "3", name: "Yumurta", quantity: "1 paket", checked: true, category: "Sut Urunleri" },
  { id: "4", name: "Yogurt", quantity: "2 adet", checked: true, category: "Sut Urunleri" },
  { id: "5", name: "Beyaz peynir", quantity: "200g", checked: false, category: "Sut Urunleri" },
  { id: "6", name: "Ispanak", quantity: "1 demet", checked: false, category: "Sebze & Meyve" },
  { id: "7", name: "Domates", quantity: "1 kg", checked: true, category: "Sebze & Meyve" },
  { id: "8", name: "Muz", quantity: "1 tarak", checked: false, category: "Sebze & Meyve" },
  { id: "9", name: "Kinoa", quantity: "500g", checked: false, category: "Baklagil & Tahil" },
  { id: "10", name: "Bulgur", quantity: "1 kg", checked: true, category: "Baklagil & Tahil" },
];

export function ShoppingListItems({
  items = defaultItems,
  onToggle,
}: ShoppingListItemsProps) {
  const groups = items.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([category, groupItems]) => (
        <div key={category} className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {category}
          </h4>
          <div className="space-y-1">
            {groupItems.map((item) => (
              <ShoppingItem
                key={item.id}
                name={item.name}
                quantity={item.quantity}
                checked={item.checked}
                onToggle={() => onToggle?.(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
