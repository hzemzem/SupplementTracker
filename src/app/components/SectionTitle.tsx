"use client";
import { Flame, Sun, Moon } from "lucide-react";

type SectionTitleProps = {
  icon: "flame" | "sun" | "moon";
  children: React.ReactNode;
};

const iconMap = {
  flame: <Flame size={18} className="text-orange-600" />,
  sun: <Sun size={18} className="text-yellow-500" />,
  moon: <Moon size={18} className="text-indigo-400" />,
};

export default function SectionTitle({ icon, children }: SectionTitleProps) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
        <span className="shrink-0 text-gray-600">{iconMap[icon]}</span>
        <span className="text-inherit text-gray-600">{children}</span>
    </h2>
  );
}
