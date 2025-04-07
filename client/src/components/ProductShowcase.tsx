import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/shopify";
import { Product } from "@/types/shopify";
import { useCart } from "@/context/CartContext";

interface FilterOptions {
  price: string[];
  scent: string[];
}

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" }
];

export default function ProductShowcase() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    price: [],
    scent: []
  });
  const [sortBy, setSortBy] = useState<string>("newest");
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: getAllProducts
  });
  
  // Use the Cart context
  const { addItem } = useCart();
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isSortOpen) setIsSortOpen(false);
  };
  
  const toggleSort = () => {
    setIsSortOpen(!isSortOpen);
    if (isFilterOpen) setIsFilterOpen(false);
  };
  
  const handleFilterChange = (category: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => {
      const updatedFilter = { ...prev };
      if (updatedFilter[category].includes(value)) {
        updatedFilter[category] = updatedFilter[category].filter(item => item !== value);
      } else {
        updatedFilter[category] = [...updatedFilter[category], value];
      }
      return updatedFilter;
    });
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsSortOpen(false);
  };
  
  const filteredProducts = products.filter(product => {
    if (filterOptions.price.length === 0 && filterOptions.scent.length === 0) {
      return true;
    }
    
    let matchesPrice = filterOptions.price.length === 0;
    let matchesScent = filterOptions.scent.length === 0;
    
    // Price filtering logic
    if (filterOptions.price.length > 0) {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      
      if (filterOptions.price.includes("0-100") && price <= 100) {
        matchesPrice = true;
      } else if (filterOptions.price.includes("100-200") && price > 100 && price <= 200) {
        matchesPrice = true;
      } else if (filterOptions.price.includes("200+") && price > 200) {
        matchesPrice = true;
      }
    }
    
    // Scent filtering logic (This is a simplification - in real app you'd use product tags/metadata)
    if (filterOptions.scent.length > 0) {
      // For demo purposes, assume product title or collection contains scent type
      const productText = product.title.toLowerCase() + 
                         (product.collections?.edges?.map(edge => edge.node.title.toLowerCase()).join(" ") || "");
      
      matchesScent = filterOptions.scent.some(scent => 
        productText.includes(scent.toLowerCase())
      );
    }
    
    return matchesPrice && matchesScent;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      case "price-desc":
        return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
      case "newest":
        // In a real app, you would use a timestamp field
        return 0;
      case "best-selling":
        // In a real app, you would use sales data
        return 0;
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
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-2">Featured Fragrances</h2>
            <p className="text-foreground/70">Our most coveted scents that define luxury</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleFilter}
                className="flex items-center space-x-2 text-foreground hover:text-accent transition-colors"
              >
                <span className="text-sm uppercase tracking-wider">Filter</span>
                <i className="ri-filter-3-line"></i>
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-sm">Price</p>
                    <div className="mt-2 space-y-1">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.price.includes("0-100")}
                          onChange={() => handleFilterChange("price", "0-100")}
                        />
                        <span className="text-sm">$0 - $100</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.price.includes("100-200")}
                          onChange={() => handleFilterChange("price", "100-200")}
                        />
                        <span className="text-sm">$100 - $200</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.price.includes("200+")}
                          onChange={() => handleFilterChange("price", "200+")}
                        />
                        <span className="text-sm">$200+</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2">
                    <p className="font-medium text-sm">Scent</p>
                    <div className="mt-2 space-y-1">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.scent.includes("Floral")}
                          onChange={() => handleFilterChange("scent", "Floral")}
                        />
                        <span className="text-sm">Floral</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.scent.includes("Oriental")}
                          onChange={() => handleFilterChange("scent", "Oriental")}
                        />
                        <span className="text-sm">Oriental</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.scent.includes("Fresh")}
                          onChange={() => handleFilterChange("scent", "Fresh")}
                        />
                        <span className="text-sm">Fresh</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={filterOptions.scent.includes("Woody")}
                          onChange={() => handleFilterChange("scent", "Woody")}
                        />
                        <span className="text-sm">Woody</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleSort}
                className="flex items-center space-x-2 text-foreground hover:text-accent transition-colors"
              >
                <span className="text-sm uppercase tracking-wider">Sort</span>
                <i className="ri-arrow-up-down-line"></i>
              </button>
              
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`block px-4 py-2 text-sm hover:bg-secondary w-full text-left ${
                        sortBy === option.value ? "bg-secondary" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-4 animate-pulse">
                <div className="w-full h-80 bg-secondary mb-4"></div>
                <div className="h-6 bg-secondary w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-secondary w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-secondary w-1/4 mx-auto"></div>
              </div>
            ))
          ) : sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
              const firstImage = product.images.edges[0]?.node;
              const price = product.priceRange.minVariantPrice;
              const collectionName = product.collections?.edges[0]?.node.title || "";
              
              return (
                <div key={product.id} className="bg-white p-4 group hover-scale">
                  <Link href={`/product/${product.handle}`} className="block relative overflow-hidden">
                    <img 
                      src={firstImage?.url || "https://images.unsplash.com/photo-1593467685670-3261b0f3f522?auto=format&fit=crop&q=80&w=400&h=500"}
                      alt={firstImage?.altText || product.title} 
                      className="w-full h-80 object-cover mb-4"
                    />
                    <div className="absolute top-0 right-0 m-2 p-2 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-heart-line text-lg text-primary"></i>
                    </div>
                    <button 
                      className="absolute bottom-0 left-0 right-0 bg-accent text-white py-3 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </Link>
                  <div className="text-center mt-4">
                    <h3 className="font-playfair text-xl text-primary">{product.title}</h3>
                    <p className="text-foreground/70 text-sm mb-2">{collectionName}</p>
                    <p className="text-accent font-medium">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-foreground/70">No products found matching your filters.</p>
              <button 
                onClick={() => setFilterOptions({ price: [], scent: [] })}
                className="mt-4 text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/collections" className="inline-block px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase tracking-wider text-sm">
            View All Fragrances
          </Link>
        </div>
      </div>
    </section>
  );
}
