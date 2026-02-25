import { LivePatientCard } from "./live-patient-card";

interface LivePatient {
  id: string;
  name: string;
  status: "online" | "offline" | "eating";
  caloriesConsumed: number;
  calorieTarget: number;
  lastMeal?: string;
  lastMealTime?: string;
}

interface LivePatientGridProps {
  patients?: LivePatient[];
  onSelect?: (id: string) => void;
}

const defaultPatients: LivePatient[] = [
  { id: "1", name: "Ayse Yilmaz", status: "online", caloriesConsumed: 1250, calorieTarget: 2000, lastMeal: "Ogle yemegi", lastMealTime: "12:30" },
  { id: "2", name: "Mehmet Kaya", status: "eating", caloriesConsumed: 850, calorieTarget: 2200, lastMeal: "Kahvalti", lastMealTime: "08:45" },
  { id: "3", name: "Fatma Demir", status: "online", caloriesConsumed: 1680, calorieTarget: 1800, lastMeal: "Ara ogun", lastMealTime: "15:00" },
  { id: "4", name: "Ali Celik", status: "offline", caloriesConsumed: 420, calorieTarget: 2000, lastMeal: "Kahvalti", lastMealTime: "07:30" },
  { id: "5", name: "Zeynep Ozturk", status: "online", caloriesConsumed: 1950, calorieTarget: 2000, lastMeal: "Aksam yemegi", lastMealTime: "19:00" },
  { id: "6", name: "Baris Akin", status: "offline", caloriesConsumed: 0, calorieTarget: 2100 },
];

export function LivePatientGrid({
  patients = defaultPatients,
  onSelect,
}: LivePatientGridProps) {
  const sorted = [...patients].sort((a, b) => {
    const order = { eating: 0, online: 1, offline: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sorted.map((p) => (
        <LivePatientCard
          key={p.id}
          name={p.name}
          status={p.status}
          caloriesConsumed={p.caloriesConsumed}
          calorieTarget={p.calorieTarget}
          lastMeal={p.lastMeal}
          lastMealTime={p.lastMealTime}
          onClick={() => onSelect?.(p.id)}
        />
      ))}
    </div>
  );
}
