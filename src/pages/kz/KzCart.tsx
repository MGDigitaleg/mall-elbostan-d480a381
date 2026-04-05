import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKzCart } from "@/hooks/useKzCart";

const KZ_WHATSAPP = "201000000000"; // placeholder — replace with real number

function buildWhatsAppMessage(items: ReturnType<typeof useKzCart>["items"], total: number): string {
  let msg = "مرحبًا، أريد طلب المنتجات التالية من Kasr Zero:\n\n";
  items.forEach((item, i) => {
    msg += `${i + 1}. ${item.title}`;
    if (item.variantName) msg += ` (${item.variantName})`;
    msg += ` — ${item.quantity}x — ${Number(item.price * item.quantity).toLocaleString("ar-EG")} ج.م\n`;
  });
  msg += `\nالإجمالي: ${total.toLocaleString("ar-EG")} ج.م`;
  msg += "\n\nأرجو تأكيد الطلب والتوفر.";
  return msg;
}

const KzCart = () => {
  const { items, updateQty, removeItem, clearCart, totalItems, totalPrice } = useKzCart();

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage(items, totalPrice);
    const url = `https://wa.me/${KZ_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <MainLayout>
      <SEOHead title="سلة المشتريات - Kasr Zero" titleEn="Cart - Kasr Zero" description="سلة مشترياتك في Kasr Zero" />

      <section className="py-8 md:py-10 bg-background">
        <div className="container max-w-[800px]">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-[1.3rem] font-extrabold text-foreground">سلة المشتريات</h1>
            {items.length > 0 && (
              <button onClick={clearCart} className="text-[0.74rem] font-semibold text-muted-foreground hover:text-destructive transition-colors">
                إفراغ السلة
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
              <p className="text-[1rem] font-bold text-foreground">السلة فارغة</p>
              <p className="mt-1 text-[0.84rem] text-muted-foreground">ابدأ بالتسوّق وأضف منتجات للسلة</p>
              <Link to="/kz/products">
                <Button variant="cta" className="mt-5 gap-2">
                  <ShoppingBag className="h-4 w-4" /> تصفّح المنتجات
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.variantId} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <Link to={`/kz/products/${item.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-card dark:bg-muted/20">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-5 w-5 text-muted-foreground/20" /></div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/kz/products/${item.slug}`} className="text-[0.84rem] font-bold text-foreground hover:text-primary transition-colors line-clamp-1">{item.title}</Link>
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

              {/* Summary */}
              <div className="mt-6 rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.84rem] text-muted-foreground">{totalItems} منتج</span>
                  <span className="font-poppins text-[0.84rem] text-muted-foreground">{totalPrice.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[0.92rem] font-bold text-foreground">الإجمالي</span>
                  <span className="font-poppins text-[1.2rem] font-extrabold text-foreground">{totalPrice.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <p className="mt-3 text-[0.72rem] text-muted-foreground">اضغط الزر أدناه لإرسال طلبك عبر واتساب وسيتم التواصل معك لتأكيد الطلب والتوصيل</p>
                <Button variant="cta" className="mt-4 w-full h-12 gap-2 text-[0.92rem] font-bold" onClick={handleWhatsApp}>
                  <MessageCircle className="h-5 w-5" /> إتمام الطلب عبر واتساب
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
