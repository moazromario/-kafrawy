import { motion } from "motion/react";
import { Shield, CheckCircle, Award, Store, Star } from "lucide-react";
import { cn } from "@/src/utils/cn";

export type TrustLevel = 'new_member' | 'trusted' | 'expert' | 'verified_merchant' | 'public_figure';

interface BadgeProps {
  level: TrustLevel;
  className?: string;
  showLabel?: boolean;
}

export const Badge = ({ level, className, showLabel = true }: BadgeProps) => {
  const configs = {
    new_member: { icon: Shield, color: "text-gray-400 bg-gray-100", label: "عضو جديد" },
    trusted: { icon: CheckCircle, color: "text-emerald-500 bg-emerald-50", label: "عضو موثوق" },
    expert: { icon: Award, color: "text-purple-500 bg-purple-50", label: "خبير" },
    verified_merchant: { icon: Store, color: "text-orange-500 bg-orange-50", label: "تاجر موثق" },
    public_figure: { icon: Star, color: "text-blue-500 bg-blue-50", label: "شخصية عامة" },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold", config.color, className)}>
      <Icon size={12} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};
