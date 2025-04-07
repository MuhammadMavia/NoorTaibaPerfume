import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/shopify";
import { Product } from "@/types/shopify";
import { useCart } from "@/context/CartContext";

export default function FeaturedProduct() {
  // Use Cart context for adding items
  const { addItem } = useCart();
  
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['/api/products/featured'],
    queryFn: getAllProducts
  });

  // Select the first product as featured (in a real app, you might have a dedicated API endpoint for featured products)
  const featuredProduct: Product | undefined = products[0];

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-[600px] bg-secondary animate-pulse"></div>
            <div className="px-6 md:px-12 lg:px-16">
              <div className="h-4 bg-secondary w-24 mb-1 animate-pulse"></div>
              <div className="h-10 bg-secondary w-3/4 mb-6 animate-pulse"></div>
              <div className="h-4 bg-secondary w-32 mb-6 animate-pulse"></div>
              <div className="h-20 bg-secondary w-full mb-8 animate-pulse"></div>
              <div className="h-8 bg-secondary w-24 mb-2 animate-pulse"></div>
              <div className="h-4 bg-secondary w-48 mb-8 animate-pulse"></div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="h-12 bg-secondary w-40 animate-pulse"></div>
                <div className="h-12 bg-secondary w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle error state or no products found
  if (isError || !featuredProduct) {
    return null; // Don't show featured section if there's an error or no products
  }

  // Extract product details from the featured product
  const image = featuredProduct.images.edges[0]?.node;
  const price = featuredProduct.priceRange.minVariantPrice;
  const formattedPrice = `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}`;
  
  const handleAddToCart = () => {
    const variantId = featuredProduct.variants.edges[0]?.node.id;
    if (variantId) {
      addItem(variantId, 1);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="h-[600px] bg-secondary relative">
            <img 
              src={image?.url} 
              alt={image?.altText || featuredProduct.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-accent text-white px-4 py-1 text-sm uppercase tracking-wider">
              Featured
            </div>
          </div>
          
          <div className="px-6 md:px-12 lg:px-16">
            <h4 className="text-accent uppercase tracking-wider text-sm mb-1">Featured Product</h4>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-primary mb-6">{featuredProduct.title}</h2>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center text-accent">
                <i className="ri-star-fill mr-1"></i>
                <i className="ri-star-fill mr-1"></i>
                <i className="ri-star-fill mr-1"></i>
                <i className="ri-star-fill mr-1"></i>
                <i className="ri-star-half-fill"></i>
              </div>
              <span className="text-foreground/70 ml-2">(24 reviews)</span>
            </div>
            
            <p className="text-foreground mb-8 leading-relaxed">
              {featuredProduct.description}
            </p>
            
            <div className="mb-8">
              <p className="text-2xl text-accent font-medium mb-2">{formattedPrice}</p>
              <p className="text-foreground/70">
                {featuredProduct.variants.edges.length > 0 ? `Available in ${featuredProduct.variants.edges.length} variants` : 'Out of stock'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                className="bg-accent hover:bg-accent/90 text-white py-3 px-10 uppercase tracking-wider text-sm transition-colors"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <Link 
                href={`/product/${featuredProduct.handle}`} 
                className="border border-primary text-primary hover:bg-primary hover:text-white py-3 px-10 uppercase tracking-wider text-sm transition-colors text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}