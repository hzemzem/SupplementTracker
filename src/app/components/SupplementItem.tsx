"use client";
import { motion } from "framer-motion";

type SupplementItemProps = {
  id: string;
  name: string;
  dosage: string;
  foodPairing: string;
  checked: boolean;
  onToggle: (id: string) => void;
};

export default function SupplementItem({
  id,
  name,
  dosage,
  foodPairing,
  checked,
  onToggle,
}: SupplementItemProps) {
  const pairingText =
    foodPairing === "empty"
      ? "empty stomach"
      : foodPairing === "fat"
      ? "with fat"
      : "any time";

  return (
    <div
      onClick={() => onToggle(id)}
      className={`flex justify-between items-center p-4 mb-2 rounded-xl border ${
        checked ? "bg-[#CCF5E1] border-[#40826D]" : "bg-white border-gray-300"
      } transition duration-300 ease-in-out cursor-pointer`}
    >
      <div>
        <h3 className="font-medium text-gray-600">{name}</h3>
        <p className="text-sm text-gray-500">
          {dosage} — {pairingText}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: checked ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="w-6 h-6 rounded-full bg-[#40826D] flex items-center justify-center text-white text-sm"
      >
        ✓
      </motion.div>
    </div>
  );
}
