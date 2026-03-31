import { Link, useLocation } from "react-router-dom";
import { Compass, Menu, ShoppingBag } from "lucide-react";
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

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/#marketplace") {
      return location.pathname === "/" && location.hash === "#marketplace";
    }

    return location.pathname === path;
  };

  const navLinkClass = (path: string) =>
    `inline-flex h-8 items-center rounded-full px-3.5 text-[0.95rem] font-semibold transition-colors duration-200 ${
      isActive(path)
        ? "bg-secondary text-foreground shadow-[var(--shadow-soft)]"
        : "text-foreground hover:bg-secondary/75 hover:text-foreground"
    }`;

  const secondaryNavLinkClass = (path: string) =>
    `inline-flex h-8 items-center rounded-full px-2.5 text-[0.82rem] font-semibold transition-colors duration-200 ${
      isActive(path)
        ? "bg-card text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-3 pt-2 md:px-4 md:pt-2.5">
      <div className="container">
        <div className="surface-panel rounded-[1.35rem] px-4 md:px-5">
          <div className="hidden min-h-[78px] xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-3">
            <nav className="flex items-center justify-end gap-1">
              {primaryNavItems.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link to="/" className="justify-self-center">
              <div className="relative -translate-y-[2px] flex items-center justify-center">
                <BrandLogo
                  align="center"
                  imageClassName="h-auto max-w-[208px]"
                />
              </div>
            </Link>

            <div className="flex items-center justify-start gap-2">
              <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-card px-1.5 py-1">
                {secondaryNavItems.map((item) => (
                  <Link key={item.path} to={item.path} className={secondaryNavLinkClass(item.path)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link to="/#marketplace" className="inline-flex h-8 items-center rounded-full px-2.5 text-[0.82rem] font-semibold text-muted-foreground transition-colors hover:text-foreground">
                السوق قريبًا
              </Link>
              <Link to="/spin-win">
                <Button variant="cta" size="sm" className="h-8 rounded-full px-4">
                  أدر واربح
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid min-h-[66px] grid-cols-[auto_1fr_auto] items-center gap-2 xl:hidden">
            <Link to="/map">
              <Button variant="outline-blue" size="sm" className="h-10 rounded-full px-3.5 text-[0.78rem] font-semibold">
                <Compass className="h-4 w-4" />
                الخريطة
              </Button>
            </Link>

            <Link to="/" className="justify-self-center">
              <div className="flex -translate-y-[1px] items-center justify-center">
                <BrandLogo align="center" imageClassName="h-auto max-w-[176px]" />
              </div>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-[var(--shadow-soft)]"
                  aria-label="فتح القائمة"
                >
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90vw] max-w-[23rem] border-border bg-background px-4 py-5">
                <SheetHeader className="space-y-2 text-right">
                  <div className="flex items-center justify-between gap-3">
                    <BrandLogo align="start" imageClassName="h-auto max-w-[156px]" />
                    <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[0.72rem] font-semibold text-muted-foreground">
                      تنقل سريع
                    </span>
                  </div>
                  <SheetTitle className="text-right text-xl">وصول أسرع إلى صفحات المول</SheetTitle>
                  <SheetDescription className="text-right leading-7">
                    إجراء أساسي واحد ظاهر، وباقي الصفحات داخل قائمة أوضح وأهدأ.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <Link to="/map">
                    <Button variant="cta" className="h-11 w-full rounded-[1rem]">استكشف الخريطة</Button>
                  </Link>
                  <Link to="/leasing">
                    <Button variant="orange" className="h-11 w-full rounded-[1rem]">التأجير</Button>
                  </Link>
                  <Link to="/spin-win" className="sm:col-span-2">
                    <Button variant="secondary" className="h-11 w-full rounded-[1rem]">أدر واربح</Button>
                  </Link>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="space-y-2">
                    <p className="px-1 text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground">التصفح الرئيسي</p>
                    <nav className="grid gap-2">
                      {primaryNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold transition-colors ${
                            isActive(item.path)
                              ? "border-primary/20 bg-secondary text-foreground"
                              : "border-border bg-card text-foreground hover:bg-secondary"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-2">
                    <p className="px-1 text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground">صفحات إضافية</p>
                    <nav className="grid gap-2">
                      {mobileNavItems.slice(4).map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`rounded-[1rem] px-4 py-3 text-sm font-medium transition-colors ${
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

                  <Link to="/#marketplace" className="flex items-center justify-between rounded-[1rem] border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <span>السوق قريبًا</span>
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
