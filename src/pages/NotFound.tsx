import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Store, Map, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="الصفحة غير موجودة"
        titleEn="Page Not Found"
        description="الصفحة المطلوبة غير موجودة في مول البستان. تصفح المحلات أو الخريطة التفاعلية."
        noIndex
      />
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="text-center max-w-md">
          <h1 className="mb-3 text-6xl font-bold text-primary">404</h1>
          <p className="mb-2 text-xl font-semibold text-foreground">الصفحة غير موجودة</p>
          <p className="mb-8 text-sm text-muted-foreground">
            عذراً، الصفحة التي تبحث عنها غير متاحة. يمكنك العودة للصفحة الرئيسية أو تصفح المحلات.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link to="/">
                <Home className="ml-2 h-4 w-4" />
                الرئيسية
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/stores">
                <Store className="ml-2 h-4 w-4" />
                المحلات
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/map">
                <Map className="ml-2 h-4 w-4" />
                الخريطة
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
