import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

export default function BestSellers() {
  // Use Cart context
  const { addItem } = useCart();
  
  // Fetch products (in a real application, you would have a dedicated API for best sellers)
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products/bestsellers'],
    queryFn: getAllProducts
  });

  // Use only the first 4 products for this section
  const bestSellers = products.slice(0, 4);

  const handleAddToCart = (productId: string) => {
    addItem(productId, 1);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Best Sellers</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Our most loved fragrances that have captured the hearts of our customers
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-secondary mb-4"></div>
                <div className="h-4 bg-secondary w-2/3 mb-2"></div>
                <div className="h-4 bg-secondary w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map(product => {
              const image = product.images.edges[0]?.node;
              const price = product.priceRange.minVariantPrice;
              const variantId = product.variants.edges[0]?.node.id;
              
              return (
                <div key={product.id} className="group hover-scale">
                  <Link href={`/product/${product.handle}`} className="block relative overflow-hidden">
                    <div className="relative">
                      <img 
                        src={image?.url} 
                        alt={image?.altText || product.title}
                        className="w-full h-64 object-cover mb-4"
                      />
                      <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-xs uppercase tracking-wider">
                        Best Seller
                      </div>
                    </div>
                    <h3 className="font-playfair text-xl text-primary mb-1">{product.title}</h3>
                    <p className="text-accent font-medium mb-3">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (variantId) handleAddToCart(variantId);
                      }}
                      className="w-full py-2 bg-primary text-white uppercase tracking-wider text-sm transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      Add to Cart
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/collections" 
            className="inline-block px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase tracking-wider text-sm"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}