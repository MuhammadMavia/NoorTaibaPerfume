import React, { useState, useEffect } from "react";
import { Link, useLocation, useLocation as useWouterLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { isLoggedIn, getCurrentCustomer, searchProducts } from "@/lib/shopify";
import { Customer } from "@/types/shopify";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

// Import logo image from assets
import logoImage from "../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [, setLocation] = useWouterLocation();
  
  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Use Cart context
  const { totalItems, toggleCart } = useCart();
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const authenticated = isLoggedIn();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const customerData = await getCurrentCustomer();
          setCustomer(customerData);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [location]); // Re-check when location changes to update after login/logout

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Mobile Menu Toggle */}
          <button
            className="text-primary md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          
          {/* Logo */}
          <div className="flex-grow md:flex-grow-0 text-center md:text-left">
            <Link href="/" className="inline-block">
              <img src={logoImage} alt="Noor e Taiba Perfumers Logo" className="h-12 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location === "/" ? "text-accent" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              href="/collections"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location.startsWith("/collections") ? "text-accent" : ""
              }`}
            >
              Collections
            </Link>
            <Link 
              href="/about"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location === "/about" ? "text-accent" : ""
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location === "/contact" ? "text-accent" : ""
              }`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-40 md:w-64 px-3 py-1 border border-foreground/20 focus:outline-none focus:border-accent rounded-full text-sm"
                  value={searchQuery}
                  onChange={async (e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    if (query.trim().length >= 2) {
                      const results = await searchProducts(query);
                      setSearchResults(results.slice(0, 5));
                      setShowResults(true);
                    } else {
                      setSearchResults([]);
                      setShowResults(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setLocation(`/collections?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowResults(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowResults(true);
                    }
                  }}
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.handle}`}
                        className="flex items-center p-3 hover:bg-accent/5 transition-colors"
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery('');
                          setLocation(`/product/${product.handle}`);
                        }}
                      >
                        <div className="w-12 h-12 rounded overflow-hidden mr-3">
                          <img
                            src={product.images.edges[0]?.node.url || "https://via.placeholder.com/48"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-primary">{product.title}</h4>
                          <p className="text-xs text-accent">
                            {product.priceRange.minVariantPrice.currencyCode}{' '}
                            {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-accent transition-colors"
                onClick={() => {
                  if (searchQuery.trim()) {
                    setLocation(`/collections?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                aria-label="Search"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
            </div>
            {isLoading ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="text-primary hover:text-accent transition-colors relative"
                    aria-label="Account"
                  >
                    <i className="ri-user-fill text-xl"></i>
                    <span className="absolute -top-2 -right-2 bg-green-500 w-2 h-2 rounded-full"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">
                      {customer?.firstName} {customer?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {customer?.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      isLoggedIn() && navigate("/account");
                    }}
                    className="cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      // Logout and redirect to home
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem("shopify_customer_access_token");
                        localStorage.removeItem("shopify_customer_access_token_expires_at");
                        navigate("/");
                        window.location.reload();
                      }
                    }}
                    className="text-red-600 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                href="/login"
                className="text-primary hover:text-accent transition-colors"
                aria-label="Account"
              >
                <i className="ri-user-line text-xl"></i>
              </Link>
            )}
            <button 
              className="text-primary hover:text-accent transition-colors relative"
              onClick={toggleCart}
              aria-label="Shopping cart"
            >
              <i className="ri-shopping-bag-line text-xl"></i>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-[height,opacity] duration-300 ease-in-out overflow-hidden bg-white border-t border-gray-100 ${
          isMenuOpen ? "h-auto opacity-100" : "h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-4 space-y-4">
          <Link 
            href="/"
            className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href="/collections"
            className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
            onClick={closeMenu}
          >
            Collections
          </Link>
          <Link 
            href="/about"
            className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            href="/contact"
            className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
            onClick={closeMenu}
          >
            Contact
          </Link>
          
          {/* Authentication Links for Mobile */}
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-gray-100">
                <p className="text-primary font-medium text-sm">
                  {customer?.firstName} {customer?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {customer?.email}
                </p>
              </div>
              <Link 
                href="/account"
                className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
                onClick={closeMenu}
              >
                My Account
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  // Logout and redirect to home
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem("shopify_customer_access_token");
                    localStorage.removeItem("shopify_customer_access_token_expires_at");
                    navigate("/");
                    window.location.reload();
                  }
                }}
                className="text-red-600 py-2 text-left uppercase tracking-wider text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="text-foreground py-2 uppercase tracking-wider text-sm"
                onClick={closeMenu}
              >
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
