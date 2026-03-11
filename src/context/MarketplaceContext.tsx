import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  stockStatus: "متوفر" | "كمية محدودة" | "غير متوفر";
  hasOffer?: boolean;
  discountPrice?: number;
  specs?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
}

export interface MarketplaceStore {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  coverImage: string;
  productsCount: number;
  description: string;
}

export interface MarketplaceCartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface MarketplaceContextType {
  cart: MarketplaceCartItem[];
  addToCart: (item: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<MarketplaceCartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToCart = (item: Product, quantity: number = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.selectedColor === color && i.selectedSize === size);
      if (existing) {
        return prev.map((i) => 
          (i.id === item.id && i.selectedColor === color && i.selectedSize === size) 
          ? { ...i, quantity: i.quantity + quantity } 
          : i
        );
      }
      return [...prev, { ...item, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <MarketplaceContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
