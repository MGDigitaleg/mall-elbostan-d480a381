import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const mobileNavItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن المول", path: "/about" },
  { label: "المحلات", path: "/stores" },
  { label: "المنتجات", path: "/products" },
  { label: "الخريطة", path: "/map" },
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "تواصل معنا", path: "/contact" },
  { label: "فرع وسط البلد", path: "/downtown-branch" },
  { label: "فرع القاهرة الجديدة", path: "/new-cairo-branch" },
  { label: "انضم للسوق", path: "/join-marketplace" },
  { label: "الوظائف", path: "/careers" },
  { label: "المدونة", path: "/blog" },
];

interface HeaderMenuSheetProps {
  isActive: (path: string) => boolean;
  trigger: JSX.Element;
}

export function HeaderMenuSheet({ isActive, trigger }: HeaderMenuSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-[90vw] max-w-[23rem] border-border bg-background px-5 py-6">
        <SheetHeader className="space-y-2 text-right">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo align="start" imageClassName="h-auto max-w-[148px]" />
          </div>
          <SheetTitle className="text-right text-xl">القائمة</SheetTitle>
          <SheetDescription className="text-right leading-7">
            تنقل سريع بين صفحات مول البستان.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link to="/map">
            <Button variant="cta" className="h-11 w-full rounded-xl">استكشف الخريطة</Button>
          </Link>
          <Link to="/leasing">
            <Button variant="orange" className="h-11 w-full rounded-xl">التأجير</Button>
          </Link>
        </div>

        <div className="mt-6 space-y-1.5">
          <p className="px-1 text-[0.72rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">التصفح</p>
          <nav className="grid gap-1">
            {mobileNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
