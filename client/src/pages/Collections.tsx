import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCollections, getCollectionByHandle, getAllProducts } from "@/lib/shopify";
import { Link, useRoute, useLocation } from "wouter";
import { Product } from "@/types/shopify";
import { useCart } from "@/context/CartContext";
import { Helmet } from "react-helmet";

export default function Collections() {
  const [, params] = useRoute("/collections/:id");
  const collectionHandle = params?.id;
  const [, setLocation] = useLocation();
  
  // State for products filtering and sorting
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all collections for the sidebar
  const { data: collections = [], isLoading: isLoadingCollections } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: getAllCollections
  });
  
  // Fetch products either for a specific collection or all products
  const { 
    data: collectionData, 
    isLoading: isLoadingProducts 
  } = useQuery({
    queryKey: [`/api/collections/${collectionHandle || 'all'}`],
    queryFn: collectionHandle 
      ? () => getCollectionByHandle(collectionHandle)
      : async () => {
          const products = await getAllProducts();
          return { products, collection: null };
        }
  });
  
  const { addItem } = useCart();
  
  const products = collectionData?.products || [];
  const collection = collectionData?.collection;
  
  // Filter products based on search query
  const filteredProducts = searchQuery 
    ? products.filter((product: Product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;
  
  // Sort products based on the selected option
  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      case "price-desc":
        return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  const handleAddToCart = (product: Product) => {
    // Get the first variant
    const variantId = product.variants.edges[0]?.node.id;
    if (variantId) {
      addItem(variantId, 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {collection 
            ? `${collection.title} | Noor e Taiba Perfumers` 
            : "All Collections | Noor e Taiba Perfumers"}
        </title>
        <meta 
          name="description" 
          content={collection?.description || "Browse our luxury perfume collections. Find your signature scent at Noor e Taiba Perfumers."} 
        />
      </Helmet>
      
      <div className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl text-primary text-center mb-4">
            {collection ? collection.title : "All Collections"}
          </h1>
          {collection?.description && (
            <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-8">
              {collection.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <h2 className="font-medium text-lg mb-4">Collections</h2>
            <div className="space-y-2 mb-8">
              <Link 
                href="/collections"
                className={`block py-2 hover:text-accent transition-colors ${
                  !collectionHandle ? "text-accent font-medium" : "text-foreground"
                }`}
              >
                All Fragrances
              </Link>
              
              {isLoadingCollections ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 bg-secondary"></div>
                  ))}
                </div>
              ) : (
                collections.map(col => (
                  <Link 
                    key={col.id}
                    href={`/collections/${col.handle}`}
                    className={`block py-2 hover:text-accent transition-colors ${
                      collectionHandle === col.handle ? "text-accent font-medium" : "text-foreground"
                    }`}
                  >
                    {col.title}
                  </Link>
                ))
              )}
            </div>
            
            <h2 className="font-medium text-lg mb-4">Price</h2>
            <div className="space-y-2 mb-8">
              <button 
                onClick={() => setSortBy("price-asc")}
                className={`block py-2 w-full text-left hover:text-accent transition-colors ${
                  sortBy === "price-asc" ? "text-accent" : "text-foreground"
                }`}
              >
                Price: Low to High
              </button>
              <button 
                onClick={() => setSortBy("price-desc")}
                className={`block py-2 w-full text-left hover:text-accent transition-colors ${
                  sortBy === "price-desc" ? "text-accent" : "text-foreground"
                }`}
              >
                Price: High to Low
              </button>
            </div>
            
            <h2 className="font-medium text-lg mb-4">Sort Alphabetically</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setSortBy("title-asc")}
                className={`block py-2 w-full text-left hover:text-accent transition-colors ${
                  sortBy === "title-asc" ? "text-accent" : "text-foreground"
                }`}
              >
                A to Z
              </button>
              <button 
                onClick={() => setSortBy("title-desc")}
                className={`block py-2 w-full text-left hover:text-accent transition-colors ${
                  sortBy === "title-desc" ? "text-accent" : "text-foreground"
                }`}
              >
                Z to A
              </button>
            </div>
          </div>
          
          {/* Products */}
          <div className="md:w-3/4">
            <div className="mb-8">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search fragrances..."
                  className="w-full px-4 py-3 pr-10 border border-foreground/20 focus:outline-none focus:border-accent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50"></i>
              </div>
            </div>
            
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white shadow-sm">
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
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product: Product) => {
                  const firstImage = product.images.edges[0]?.node;
                  const price = product.priceRange.minVariantPrice;
                  const collectionName = product.collections?.edges[0]?.node.title || "";
                  
                  return (
                    <div key={product.id} className="group transition-all duration-300 hover:shadow-lg">
                      <div className="overflow-hidden relative">
                        <Link href={`/product/${product.handle}`} className="block">
                          <div className="aspect-square overflow-hidden">
                            <img 
                              src={firstImage?.url || "https://images.unsplash.com/photo-1593467685670-3261b0f3f522?auto=format&fit=crop&q=80&w=600&h=600"}
                              alt={firstImage?.altText || product.title} 
                              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                            />
                          </div>
                        </Link>
                        <div className="absolute top-3 right-3 z-10">
                          <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                            <i className="ri-heart-line text-primary"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-white">
                        <p className="text-foreground/60 text-xs tracking-wider uppercase mb-2">{collectionName}</p>
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
                            handleAddToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="ri-search-line text-6xl text-foreground/30 mb-4"></i>
                <h3 className="text-xl mb-2">No results found</h3>
                <p className="text-foreground/70 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("newest");
                    setLocation("/collections");
                  }}
                  className="text-accent hover:underline"
                >
                  View all products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
