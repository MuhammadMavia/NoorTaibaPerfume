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
              <div key={i} className="bg-white shadow-sm animate-pulse">
                <div className="aspect-square bg-secondary"></div>
                <div className="p-5">
                  <div className="h-3 bg-secondary w-1/3 mb-3"></div>
                  <div className="h-5 bg-secondary w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary w-1/4 mb-4"></div>
                  <div className="h-8 bg-secondary w-full mt-3"></div>
                </div>
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
                <div key={product.id} className="group transition-all duration-300 hover:shadow-lg">
                  <div className="overflow-hidden relative">
                    <Link href={`/product/${product.handle}`} className="block">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={image?.url || "https://images.unsplash.com/photo-1593467685670-3261b0f3f522?auto=format&fit=crop&q=80&w=600&h=600"}
                          alt={image?.altText || product.title} 
                          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                    </Link>
                    <div className="absolute top-0 right-0 z-10 bg-accent text-white px-3 py-1 m-2 text-xs uppercase tracking-wider">
                      Best Seller
                    </div>
                    <div className="absolute top-3 left-3 z-10">
                      <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                        <i className="ri-heart-line text-primary"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-white">
                    <Link href={`/product/${product.handle}`}>
                      <h3 className="font-playfair text-lg font-medium text-primary mb-1 hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-accent font-medium mb-3">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </p>
                    <button 
                      className="w-full py-2.5 bg-primary text-white uppercase tracking-wider text-xs font-medium hover:bg-accent transition-colors mt-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (variantId) handleAddToCart(variantId);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
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