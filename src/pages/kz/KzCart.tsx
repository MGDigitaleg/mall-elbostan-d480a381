import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

// Simple localStorage-based cart (no auth needed)
function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem("kz_cart") ?? "[]"); } catch { return []; }
}
function saveCart(items: CartItem[]) { localStorage.setItem("kz_cart", JSON.stringify(items)); }

const KzCart = () => {
  const [items, setItems] = useState<CartItem[]>(getCart);

  const updateQty = useCallback((variantId: string, delta: number) => {
    setItems(prev => {
      const next = prev.map(item =>
        item.variantId === variantId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.variantId !== variantId);
      saveCart(next);
      return next;
    });
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <MainLayout>
      <SEOHead title="سلة المشتريات - Kasr Zero" titleEn="Cart - Kasr Zero" description="سلة مشترياتك في Kasr Zero" />

      <section className="py-8 md:py-10" style={{ background: "hsl(var(--background))" }}>
        <div className="container max-w-[800px]">
          <h1 className="mb-6 text-[1.3rem] font-extrabold text-foreground">سلة المشتريات</h1>

          {items.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
              <p className="text-[1rem] font-bold text-foreground">السلة فارغة</p>
              <p className="mt-1 text-[0.84rem] text-muted-foreground">ابدأ بالتسوّق وأضف منتجات للسلة</p>
              <Link to="/kz/products">
                <Button className="mt-5 gap-2" style={{ background: "hsl(var(--primary))", color: "#fff" }}>
                  <ShoppingBag className="h-4 w-4" /> تصفّح المنتجات
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.variantId} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-5 w-5 text-muted-foreground/20" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/kz/products/${item.productId}`} className="text-[0.84rem] font-bold text-foreground hover:text-primary transition-colors line-clamp-1">{item.title}</Link>
                      {item.variantName && <p className="text-[0.7rem] text-muted-foreground">{item.variantName}</p>}
                      <p className="mt-1 font-poppins text-[0.88rem] font-bold text-foreground">{Number(item.price).toLocaleString("ar-EG")} ج.م</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.variantId, -1)} className="rounded-md border border-border p-1 hover:bg-secondary transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-6 text-center font-poppins text-[0.84rem] font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.variantId, 1)} className="rounded-md border border-border p-1 hover:bg-secondary transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => removeItem(item.variantId)} className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.92rem] font-bold text-foreground">الإجمالي</span>
                  <span className="font-poppins text-[1.2rem] font-extrabold text-foreground">{total.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <p className="mt-2 text-[0.72rem] text-muted-foreground">للطلب تواصل معنا عبر واتساب أو الهاتف لتأكيد طلبك</p>
                <Button className="mt-4 w-full h-11 gap-2 text-[0.88rem] font-bold" style={{ background: "hsl(var(--primary))", color: "#fff" }}>
                  إتمام الطلب عبر واتساب
                </Button>
              </div>

              <Link to="/kz/products" className="mt-4 flex items-center justify-center gap-1.5 text-[0.82rem] font-bold text-primary hover:underline">
                متابعة التسوّق <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default KzCart;
