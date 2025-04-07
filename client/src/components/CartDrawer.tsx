import React, { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    totalItems, 
    cartLines, 
    isLoading,
    updateItem,
    removeItem,
    applyPromoCode
  } = useCart();
  
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  // Function to increase item quantity
  const increaseQuantity = (lineId: string, currentQuantity: number) => {
    updateItem(lineId, currentQuantity + 1);
  };

  // Function to decrease item quantity
  const decreaseQuantity = (lineId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateItem(lineId, currentQuantity - 1);
    } else {
      removeItem(lineId);
    }
  };

  // Overlay that closes when clicked
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      {/* Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="font-playfair text-xl text-primary">
              Your Cart ({totalItems})
            </h2>
            <button 
              onClick={closeCart}
              className="text-foreground hover:text-accent transition-colors"
              aria-label="Close cart"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                <p className="mt-4 text-foreground">Loading your cart...</p>
              </div>
            ) : totalItems === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <i className="ri-shopping-bag-line text-4xl text-foreground/30 mb-4"></i>
                <p className="text-foreground mb-4">Your cart is empty</p>
                <button 
                  onClick={closeCart}
                  className="text-accent hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartLines.map(item => (
                  <div key={item.id} className="flex border-b border-gray-100 pb-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-secondary">
                      <img 
                        src={item.merchandise.image?.url} 
                        alt={item.merchandise.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <Link 
                            href={`/product/${item.merchandise.product.handle}`}
                            className="text-primary hover:text-accent transition-colors font-medium"
                            onClick={closeCart}
                          >
                            {item.merchandise.title}
                          </Link>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-foreground/50 hover:text-accent transition-colors"
                          aria-label="Remove item"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center border border-gray-200">
                          <button 
                            onClick={() => decreaseQuantity(item.id, item.quantity)}
                            className="px-2 py-1 text-foreground hover:text-accent"
                            aria-label="Decrease quantity"
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <span className="px-2 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item.id, item.quantity)}
                            className="px-2 py-1 text-foreground hover:text-accent"
                            aria-label="Increase quantity"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                        <div className="text-accent font-medium">
                          {item.merchandise.priceV2.currencyCode} {(parseFloat(item.merchandise.priceV2.amount) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {!isLoading && cart && totalItems > 0 && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-foreground">Subtotal</span>
                <span className="font-medium">
                  {cart.cost.subtotalAmount.currencyCode} {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-foreground">Taxes</span>
                <span className="font-medium">
                  {cart.cost.totalTaxAmount?.currencyCode || cart.cost.subtotalAmount.currencyCode} {
                    cart.cost.totalTaxAmount 
                      ? parseFloat(cart.cost.totalTaxAmount.amount).toFixed(2) 
                      : "Calculated at checkout"
                  }
                </span>
              </div>
              
              {/* Promo Code Section */}
              <div className="mb-4 pt-2 border-t border-gray-100">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow border border-gray-200 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    disabled={applyingPromo || isLoading}
                  />
                  <button
                    onClick={async () => {
                      if (!promoCode.trim()) return;
                      
                      setApplyingPromo(true);
                      const result = await applyPromoCode(promoCode.trim());
                      setApplyingPromo(false);
                      
                      toast({
                        title: result.success ? "Success" : "Error",
                        description: result.message,
                        variant: result.success ? "default" : "destructive"
                      });
                      
                      if (result.success) {
                        setPromoCode("");
                      }
                    }}
                    disabled={applyingPromo || isLoading || !promoCode.trim()}
                    className="ml-2 bg-primary hover:bg-primary/90 text-white p-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyingPromo ? "Applying..." : "Apply"}
                  </button>
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  Enter a promo code to get discounts
                </p>
              </div>
              
              <div className="flex justify-between text-lg font-medium mb-4">
                <span className="text-primary">Total</span>
                <span className="text-accent">
                  {cart.cost.totalAmount.currencyCode} {parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                </span>
              </div>
              <p className="text-foreground/70 text-sm mb-4">
                Shipping calculated at checkout
              </p>
              <a href={cart.checkoutUrl} className="block w-full" target="_blank" rel="noopener noreferrer">
                <button className="w-full bg-accent hover:bg-accent/90 text-white py-3 uppercase tracking-wider text-sm transition-colors">
                  Checkout
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
