import React from "react";
import { Link } from "wouter";
import { Product } from "@/types/shopify";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";

// Promotional offers that will be displayed
interface PromoOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  percentage: number;
  expiry: string;
  collection: string;
  featuredProduct?: Product;
}

const PROMO_OFFERS: PromoOffer[] = [
  {
    id: "summer-sale",
    code: "SUMMER23",
    title: "Summer Sale",
    description: "Enjoy 20% off on selected summer fragrances. Perfect for warm days and evening outings.",
    percentage: 20,
    expiry: "2025-05-30",
    collection: "Summer"
  },
  {
    id: "new-customer",
    code: "WELCOME10",
    title: "New Customer Offer",
    description: "Use code WELCOME10 to get 10% off your first purchase. Welcome to the Noor e Taiba family!",
    percentage: 10,
    expiry: "2025-12-31",
    collection: "All"
  }
];

export default function DiscountsSection() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: getAllProducts
  });

  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    const variantId = product.variants.edges[0]?.node.id;
    if (variantId) {
      addItem(variantId, 1);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-pulse">
            <div className="h-10 w-1/3 bg-secondary mx-auto mb-4"></div>
            <div className="h-4 w-1/2 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 h-64 bg-secondary"></div>
                <div className="w-full md:w-3/5 p-6">
                  <div className="h-6 w-1/3 bg-secondary mb-3"></div>
                  <div className="h-4 w-1/2 bg-secondary mb-4"></div>
                  <div className="h-4 w-3/4 bg-secondary mb-6"></div>
                  <div className="h-10 w-1/4 bg-secondary"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Get a featured product for each promo
  const promoWithProducts = PROMO_OFFERS.map(promo => {
    let featuredProduct: Product | undefined;
    
    // Try to match a product from the collection if specified
    if (promo.collection && promo.collection !== "All") {
      featuredProduct = products.find(product => 
        product.collections.edges.some(
          edge => edge.node.title.toLowerCase().includes(promo.collection.toLowerCase())
        )
      );
    }
    
    // If no product found for collection or no collection specified, pick a random product
    if (!featuredProduct && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(products.length, 5));
      featuredProduct = products[randomIndex];
    }
    
    return {
      ...promo,
      featuredProduct
    };
  });

  return (
    <section className="py-16 md:py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Special Offers</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Exclusive discounts and promotions for our valued customers. 
            Don't miss these limited-time offers on our premium fragrances.
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promoWithProducts.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              {promo.featuredProduct && (
                <div className="md:w-2/5 relative overflow-hidden">
                  <img 
                    src={promo.featuredProduct.images.edges[0]?.node.url || "https://images.unsplash.com/photo-1593467685670-3261b0f3f522?auto=format&fit=crop&q=80&w=600&h=600"}
                    alt={promo.featuredProduct.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-accent text-white px-4 py-2 font-medium">
                    {promo.percentage ? `${promo.percentage}% OFF` : 'SPECIAL OFFER'}
                  </div>
                </div>
              )}
              
              <div className={`${promo.featuredProduct ? 'md:w-3/5' : 'w-full'} p-6 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-wider">
                      Code: {promo.code}
                    </span>
                    {promo.expiry && (
                      <span className="text-xs text-red-500 ml-3">
                        Expires: {new Date(promo.expiry).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-playfair text-xl font-medium text-primary mb-2">
                    {promo.title}
                  </h3>
                  
                  <p className="text-foreground/70 mb-4">
                    {promo.description}
                  </p>
                </div>
                
                <div className="mt-4">
                  {promo.featuredProduct ? (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <Link href={`/product/${promo.featuredProduct.handle}`} className="font-medium text-accent hover:underline">
                          {promo.featuredProduct.title}
                        </Link>
                        <p className="text-sm font-medium">
                          {promo.featuredProduct.priceRange.minVariantPrice.currencyCode}{' '}
                          {parseFloat(promo.featuredProduct.priceRange.minVariantPrice.amount).toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => promo.featuredProduct && handleAddToCart(promo.featuredProduct)}
                        className="mt-3 md:mt-0 px-4 py-2 bg-primary text-white text-sm uppercase tracking-wider hover:bg-accent transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/collections" 
                      className="inline-block px-4 py-2 bg-primary text-white text-sm uppercase tracking-wider hover:bg-accent transition-colors"
                    >
                      Shop Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}