import React, { createContext, useContext, useState } from "react";
import { Cart as ShopifyCart } from "@/types/shopify";
import { useToast } from "@/hooks/use-toast";

// Simplified cart data structure
interface SimplifiedCart {
  totalItems: number;
}

// Simplified context interface for now
interface CartContextType {
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (id: string, quantity: number) => void;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [totalItems, setTotalItems] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Cart drawer controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Add item to cart (simplified implementation)
  const addItem = (id: string, quantity: number) => {
    setTotalItems(prev => prev + quantity);
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart.",
    });
    openCart();
  };

  return (
    <CartContext.Provider
      value={{
        totalItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
