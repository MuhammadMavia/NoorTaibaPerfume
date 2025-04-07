import React, { useState } from "react";
import { Link } from "wouter";

export default function CartDrawer() {
  // Temporary implementation
  const [isCartOpen, setIsCartOpen] = useState(false);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-playfair text-xl text-primary">
            Your Cart (0)
          </h2>
          <button 
            onClick={closeCart}
            className="text-foreground hover:text-accent transition-colors"
            aria-label="Close cart"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
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
        </div>
      </div>
    </div>
  );
}
