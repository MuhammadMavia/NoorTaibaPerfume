import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

export default function FeaturedProduct() {
  const [quantity, setQuantity] = useState(1);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: getAllProducts
  });
  
  const { addItem } = useCart();
  
  // Select the featured product (in a real app, this might be marked with a tag or metadata)
  const featuredProduct = products.length > 0 ? products[0] : null;
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    if (featuredProduct) {
      const variantId = featuredProduct.variants.edges[0]?.node.id;
      if (variantId) {
        addItem(variantId, quantity);
      }
    }
  };
  
  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 animate-pulse">
            <div className="lg:w-1/2 bg-secondary h-[600px]"></div>
            <div className="lg:w-1/2 space-y-4">
              <div className="h-4 bg-secondary w-1/4"></div>
              <div className="h-10 bg-secondary w-3/4"></div>
              <div className="h-4 bg-secondary w-1/2"></div>
              <div className="h-20 bg-secondary w-full"></div>
              <div className="h-12 bg-secondary w-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!featuredProduct) {
    return null;
  }
  
  const productImage = featuredProduct.images.edges[0]?.node;
  const price = featuredProduct.priceRange.minVariantPrice;
  const formattedPrice = `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}`;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="lg:w-1/2">
            <img 
              src={productImage?.url || "https://images.unsplash.com/photo-1623605931891-d5b95ee98459?auto=format&fit=crop&q=80&w=800&h=1000"}
              alt={productImage?.altText || featuredProduct.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="lg:w-1/2">
            <span className="text-accent uppercase tracking-widest text-sm">Featured Product</span>
            <h2 className="font-playfair text-3xl md:text-5xl text-primary mt-4 mb-4">{featuredProduct.title}</h2>
            <p className="text-sm uppercase tracking-wider text-foreground/70 mb-6">Exclusive Limited Edition</p>
            
            <p className="text-foreground mb-8 leading-relaxed">
              {featuredProduct.description}
            </p>
            
            <div className="mb-8">
              <h3 className="text-primary font-medium mb-3">Notes</h3>
              <div className="flex space-x-8">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Top</p>
                  <p className="text-foreground/70 text-sm">Bergamot, Cardamom</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Heart</p>
                  <p className="text-foreground/70 text-sm">Rose, Saffron</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Base</p>
                  <p className="text-foreground/70 text-sm">Oud, Amber, Vanilla</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <p className="text-accent text-2xl font-medium">{formattedPrice}</p>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={decreaseQuantity}
                  className="w-8 h-8 flex items-center justify-center border border-foreground/30 text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="w-8 h-8 flex items-center justify-center border border-foreground/30 text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-primary hover:bg-primary/90 text-white px-6 py-3 uppercase tracking-wider text-sm transition-colors"
              >
                Add to Cart
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-foreground/30 text-foreground hover:border-accent hover:text-accent transition-colors">
                <i className="ri-heart-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
