import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  slots?: string[];
  selectedSlot?: string;
  bookedSlots?: string[];
  onSelect?: (slot: string) => void;
}

const defaultSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const defaultBooked = ["10:00", "11:00", "14:30"];

export function TimeSlotPicker({
  slots = defaultSlots,
  selectedSlot,
  bookedSlots = defaultBooked,
  onSelect,
}: TimeSlotPickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Saat Secin</p>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;
          return (
            <Button
              key={slot}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={isBooked}
              onClick={() => onSelect?.(slot)}
              className={cn(
                "text-xs",
                isBooked && "opacity-50 line-through",
              )}
            >
              {slot}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
