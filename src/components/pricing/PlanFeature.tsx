
import { LucideIcon } from "lucide-react";

interface PlanFeatureProps {
  icon: LucideIcon;
  text: string;
}

const PlanFeature = ({ icon: Icon, text }: PlanFeatureProps) => {
  return (
    <li className="flex items-center">
      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
        <Icon className="h-4 w-4 text-[#28e57d]" />
      </div>
      <span>{text}</span>
    </li>
  );
};

export default PlanFeature;
