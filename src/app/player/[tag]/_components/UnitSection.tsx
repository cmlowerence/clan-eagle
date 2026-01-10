import { ReactNode } from "react";
import UnitCard from "./UnitCard";
import { Unit } from "./types";

interface UnitSectionProps {
  title: string;
  icon: ReactNode;
  units: Unit[];
  type: string; // Used for categorization logic inside Card if needed
}

export default function UnitSection({ title, icon, units, type }: UnitSectionProps) {
  if (!units || units.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-clash text-skin-text mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-skin-muted/10 pb-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {units.map((unit) => (
          <UnitCard key={unit.name} unit={unit} type={type} />
        ))}
      </div>
    </section>
  );
}
