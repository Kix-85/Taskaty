
import { cn } from "@/lib/utils";

type BadgeProps = {
  status: 'low' | 'medium' | 'high' | string;
}

const Badge = ({ status }: BadgeProps) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'low':
        return 'bg-[#13c2c2]';
      case 'medium':
        return 'bg-[#d4b106]';
      case 'high':
        return 'bg-[#fa541c]';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn(
      "inline-flex px-2 py-0.5 rounded-md text-xs font-medium text-white",
      getBadgeColor()
    )}>
      {status}
    </div>
  );
};

export default Badge;
