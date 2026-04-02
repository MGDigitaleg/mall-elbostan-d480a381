import { Link, useLocation } from "react-router-dom";
import { Compass, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const primaryNavItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن المول", path: "/about" },
  { label: "المتاجر", path: "/stores" },
  { label: "الخريطة", path: "/map" },
];

const secondaryNavItems = [
  { label: "التأجير", path: "/leasing" },
  { label: "يوم الافتتاح", path: "/opening-day" },
  { label: "تواصل معنا", path: "/contact" },
];

const mobileNavItems = [
  ...primaryNavItems,
  ...secondaryNavItems,
  { label: "الوظائف", path: "/careers" },
  { label: "المدونة", path: "/blog" },
  { label: "السوق قريباً", path: "/#marketplace" },
];

function HeaderMenuSheet({
  isActive,
  trigger,
}: {
  isActive: (path: string) => boolean;
  trigger: JSX.Element;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-[90vw] max-w-[23rem] border-border bg-background px-5 py-6">
        <SheetHeader className="space-y-2 text-right">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo align="start" imageClassName="h-auto max-w-[148px]" />
          </div>
          <SheetTitle className="text-right text-xl">القائمة الرئيسية</SheetTitle>
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
          <nav className="grid gap-1.5">
            {mobileNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? "bg-secondary text-foreground"
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

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/#marketplace") return location.pathname === "/" && location.hash === "#marketplace";
    return location.pathname === path;
  };

  const navLinkClass = (path: string) =>
    `inline-flex h-9 items-center rounded-lg px-3.5 text-[0.88rem] font-semibold transition-colors duration-200 ${
      isActive(path)
        ? "bg-secondary text-foreground"
        : "text-foreground/70 hover:text-foreground"
    }`;

  const secondaryNavLinkClass = (path: string) =>
    `inline-flex h-8 items-center px-2.5 text-[0.82rem] font-medium transition-colors duration-200 ${
      isActive(path)
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/70 bg-card shadow-[0_1px_4px_hsl(218_72%_9%/0.07),0_4px_12px_hsl(218_72%_9%/0.04)]">
      <div className="container">
        {/* Desktop */}
        <div className="hidden min-h-[72px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-4">
          <nav className="flex items-center justify-start gap-1">
            {primaryNavItems.map((item) => (
              <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-auto max-w-[192px]" />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center gap-0.5">
              {secondaryNavItems.map((item) => (
                <Link key={item.path} to={item.path} className={secondaryNavLinkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <Link to="/spin-win">
              <Button variant="cta" size="sm" className="h-9 rounded-lg px-5">
                أدر واربح
              </Button>
            </Link>
          </div>
        </div>

        {/* Tablet */}
        <div className="hidden min-[768px]:max-[1194px]:grid min-[768px]:max-[1194px]:min-h-[68px] min-[768px]:max-[1194px]:grid-cols-[1fr_auto_1fr] min-[768px]:max-[1194px]:items-center min-[768px]:max-[1194px]:gap-3">
          <nav className="flex items-center justify-start gap-1">
            {primaryNavItems.map((item) => (
              <Link key={item.path} to={item.path} className="inline-flex h-9 items-center px-2.5 text-[0.82rem] font-semibold text-foreground/70 transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-auto max-w-[176px]" />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <Link to="/spin-win">
              <Button variant="cta" size="sm" className="h-9 rounded-lg px-4 text-[0.82rem]">أدر واربح</Button>
            </Link>
            <HeaderMenuSheet
              isActive={isActive}
              trigger={
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground" aria-label="فتح القائمة">
                  <Menu size={18} />
                </button>
              }
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="grid min-h-[60px] grid-cols-[auto_1fr_auto] items-center gap-2 md:hidden">
          <Link to="/map">
            <Button variant="outline-blue" size="sm" className="h-10 w-10 rounded-lg px-0" aria-label="افتح الخريطة">
              <Compass className="h-4 w-4" />
            </Button>
          </Link>

          <Link to="/" className="justify-self-center">
            <BrandLogo align="center" imageClassName="h-auto max-w-[156px]" />
          </Link>

          <HeaderMenuSheet
            isActive={isActive}
            trigger={
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground" aria-label="فتح القائمة">
                <Menu size={18} />
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
