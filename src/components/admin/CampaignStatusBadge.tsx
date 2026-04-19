import { Link } from "react-router-dom";
import { useCampaignStatus } from "@/hooks/useCampaignStatus";
import { Badge } from "@/components/ui/badge";
import { Sparkles, PauseCircle } from "lucide-react";

interface Props {
  /** Render as a Link to the spin system admin page */
  asLink?: boolean;
  className?: string;
}

export const CampaignStatusBadge = ({ asLink = true, className }: Props) => {
  const { data, isLoading } = useCampaignStatus("spin_win");
  if (isLoading || !data) return null;

  const active = data.is_active;
  const badge = (
    <Badge
      variant="outline"
      className={`gap-1.5 px-2.5 py-1 text-[0.7rem] font-semibold border ${
        active
          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
          : "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15"
      } ${className ?? ""}`}
    >
      {active ? <Sparkles className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
      <span>الحملة: {active ? "نشطة" : "موقوفة"}</span>
    </Badge>
  );

  return asLink ? (
    <Link to="/admin/spin-system" aria-label="إدارة الحملة">
      {badge}
    </Link>
  ) : (
    badge
  );
};
