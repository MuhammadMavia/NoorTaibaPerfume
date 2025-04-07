import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart as ShopifyCart, CartLine } from "@/types/shopify";
import { useToast } from "@/hooks/use-toast";
import { createCart, getCart, addToCart, updateCartItems, removeFromCart } from "@/lib/shopify";

interface CartContextType {
  cart: ShopifyCart | null;
  totalItems: number;
  isCartOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (id: string, quantity: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  cartLines: CartLine[];
}

// Local storage key for cart ID
const CART_ID_KEY = 'shopify_cart_id';

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      
      if (savedCartId) {
        try {
          setIsLoading(true);
          const existingCart = await getCart(savedCartId);
          
          if (existingCart) {
            setCart(existingCart);
          } else {
            // Create a new cart if the saved one doesn't exist anymore
            const newCart = await createCart();
            setCart(newCart);
            localStorage.setItem(CART_ID_KEY, newCart.id);
          }
        } catch (error) {
          console.error('Error initializing cart:', error);
          toast({
            title: "Error loading cart",
            description: "Please try refreshing the page.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // No saved cart, create a new one
        try {
          setIsLoading(true);
          const newCart = await createCart();
          setCart(newCart);
          localStorage.setItem(CART_ID_KEY, newCart.id);
        } catch (error) {
          console.error('Error creating cart:', error);
          toast({
            title: "Error creating cart",
            description: "Please try refreshing the page.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeCart();
  }, [toast]);

  // Cart drawer controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Extract cart lines from cart
  const cartLines = cart ? cart.lines.edges.map(edge => edge.node) : [];
  
  // Calculate total items in cart
  const totalItems = cart ? cart.totalQuantity : 0;

  // Add item to cart
  const addItem = async (merchandiseId: string, quantity: number) => {
    if (!cart) return;
    
    try {
      setIsLoading(true);
      const updatedCart = await addToCart(cart.id, [{ merchandiseId, quantity }]);
      setCart(updatedCart);
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
      openCart();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error adding item",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update item in cart
  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    try {
      setIsLoading(true);
      const updatedCart = await updateCartItems(cart.id, [{ id: lineId, quantity }]);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error updating item",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (lineId: string) => {
    if (!cart) return;
    
    try {
      setIsLoading(true);
      const updatedCart = await removeFromCart(cart.id, [lineId]);
      setCart(updatedCart);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast({
        title: "Error removing item",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        isCartOpen,
        isLoading,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateItem,
        removeItem,
        cartLines
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
