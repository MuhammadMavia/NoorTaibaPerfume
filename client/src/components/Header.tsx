import React, { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Temporary implementation
  const totalItems = 0;
  const toggleCart = () => {
    console.log("Toggle cart clicked");
  };

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
              href="/collections"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location.startsWith("/collections") ? "text-accent" : ""
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/collections"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location === "/collections" ? "text-accent" : ""
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
              href="/journal"
              className={`text-foreground hover:text-accent transition-colors text-sm uppercase tracking-wider font-medium ${
                location === "/journal" ? "text-accent" : ""
              }`}
            >
              Journal
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
            <button 
              className="text-primary hover:text-accent transition-colors"
              aria-label="Account"
            >
              <i className="ri-user-line text-xl"></i>
            </button>
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
          isMenuOpen ? "h-[256px] opacity-100" : "h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-4 space-y-4">
          <Link 
            href="/collections"
            className="text-foreground py-2 border-b border-gray-100 uppercase tracking-wider text-sm"
            onClick={closeMenu}
          >
            Shop
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
            href="/journal"
            className="text-foreground py-2 uppercase tracking-wider text-sm"
            onClick={closeMenu}
          >
            Journal
          </Link>
        </nav>
      </div>
    </header>
  );
}
