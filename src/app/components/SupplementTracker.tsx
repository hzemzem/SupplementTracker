"use client";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SupplementItem from "../components/SupplementItem";

type Supplement = {
  id: string;
  name: string;
  time: "AM" | "PM";
  dosage: string;
  foodPairing: "fat" | "empty" | "any";
  alternateWith?: string;
};

const supplements: Supplement[] = [
  { id: "seed", name: "Seed Synbiotic", time: "AM", dosage: "2 capsules", foodPairing: "empty" },
  { id: "multi", name: "Multivitamin", time: "AM", dosage: "1 capsule", foodPairing: "fat", alternateWith: "bone" },
  { id: "magnesium", name: "Magnesium Glycinate", time: "AM", dosage: "1 capsule", foodPairing: "any" },
  { id: "omega", name: "Omega-3", time: "AM", dosage: "2 softgels", foodPairing: "fat" },
  { id: "magnesium2", name: "Magnesium Glycinate", time: "PM", dosage: "2 capsules", foodPairing: "any" },
  { id: "omega2", name: "Omega-3 (2nd dose)", time: "PM", dosage: "2 softgels", foodPairing: "fat" },
  { id: "bone", name: "Bone Support Formula", time: "PM", dosage: "1 capsule", foodPairing: "any", alternateWith: "multi" }
];

const getTodaySupplements = (): Supplement[] => {
  const isEvenDay = dayjs().date() % 2 === 0;
  return supplements.filter(s => {
    if (!s.alternateWith) return true;
    return isEvenDay ? s.name === "Multivitamin" : s.name === "Bone Support Formula";
  });
};

export default function SupplementTracker() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState<number>(1);

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  
    // Load saved checklist
    const saved = JSON.parse(localStorage.getItem(`checklist-${today}`) || '{}');
    setChecked(saved);
  
    // Check if all supplements were taken yesterday
    const streakData = JSON.parse(localStorage.getItem("supplement-tracker") || "{}");
    const yesterdayChecklist = JSON.parse(localStorage.getItem(`checklist-${yesterday}`) || '{}');
  
    const allYesterdayChecked = getTodaySupplements()
      .map(s => yesterdayChecklist[s.id])
      .every(Boolean); // all values must be true
  
    if (streakData.lastCheckIn === yesterday && allYesterdayChecked) {
      setStreak((streakData.currentStreak || 1) + 1);
    } else if (streakData.lastCheckIn === today) {
      setStreak(streakData.currentStreak || 1);
    } else {
      setStreak(1);
    }
  }, []);   

  const handleCheck = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);

    const today = dayjs().format("YYYY-MM-DD");
    localStorage.setItem(`checklist-${today}`, JSON.stringify(updated));
  
    const allChecked = getTodaySupplements().every(s => updated[s.id]);
    if (allChecked) {
    const today = dayjs().format("YYYY-MM-DD");
    localStorage.setItem("supplement-tracker", JSON.stringify({
        lastCheckIn: today,
        currentStreak: streak
    }));
    }
  };  

  const am = getTodaySupplements().filter(s => s.time === "AM");
  const pm = getTodaySupplements().filter(s => s.time === "PM");

  const renderList = (items: Supplement[]) =>
    items.map((s) => (
      <SupplementItem
        key={s.id}
        id={s.id}
        name={s.name}
        dosage={s.dosage}
        foodPairing={s.foodPairing}
        checked={!!checked[s.id]}
        onToggle={handleCheck}
      />
    ));  

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-gray-600">Daily Supplement Checklist</h1>
      <p className="text-sm text-gray-600">🔥 Streak: {streak} day{streak > 1 ? "s" : ""}</p>

      <div>
        <h2 className="text-lg font-semibold text-gray-600">🌞 Morning</h2>
        {renderList(am)}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-600">🌙 Evening</h2>
        {renderList(pm)}
      </div>
    </div>
  );
}
