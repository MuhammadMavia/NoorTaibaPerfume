import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { isLoggedIn, getCurrentCustomer } from "@/lib/shopify";
import { Customer } from "@/types/shopify";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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
              <h1 className="font-playfair text-2xl md:text-3xl font-semibold tracking-wide text-primary">
                Noor e Taiba
              </h1>
              <p className="text-xs uppercase tracking-widest text-foreground/70">
                Perfumers
              </p>
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
            <button 
              className="text-primary hover:text-accent transition-colors"
              aria-label="Search"
            >
              <i className="ri-search-line text-xl"></i>
            </button>
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
