import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  slug: string;
  variantId: string;
  title: string;
  variantName: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQty: (variantId: string, delta: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem("kz_cart") ?? "[]"); } catch { return []; }
}
function persistCart(items: CartItem[]) {
  localStorage.setItem("kz_cart", JSON.stringify(items));
}

export function KzCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => { persistCart(items); }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === newItem.variantId);
      if (existing) {
        return prev.map(i => i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((variantId: string, delta: number) => {
    setItems(prev => prev.map(i =>
      i.variantId === variantId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useKzCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useKzCart must be used within KzCartProvider");
  return ctx;
}
