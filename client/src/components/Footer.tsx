import React from "react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl mb-6">Noor e Taiba</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Luxury fragrances inspired by Arabian heritage and crafted with the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-facebook-line text-lg"></i>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-pinterest-line text-lg"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors">
                <i className="ri-twitter-line text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-6">Shop</h3>
            <ul className="space-y-3 text-white/70">
              <li><Link href="/collections" className="hover:text-accent transition-colors">All Fragrances</Link></li>
              <li><Link href="/collections" className="hover:text-accent transition-colors">Collections</Link></li>
              <li><Link href="/collections/gift-sets" className="hover:text-accent transition-colors">Gift Sets</Link></li>
              <li><Link href="/collections/discovery-sets" className="hover:text-accent transition-colors">Discovery Sets</Link></li>
              <li><Link href="/collections/accessories" className="hover:text-accent transition-colors">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-6">About</h3>
            <ul className="space-y-3 text-white/70">
              <li><Link href="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link href="/craftsmanship" className="hover:text-accent transition-colors">Craftsmanship</Link></li>
              <li><Link href="/sustainability" className="hover:text-accent transition-colors">Sustainability</Link></li>
              <li><Link href="/press" className="hover:text-accent transition-colors">Press</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-6">Help</h3>
            <ul className="space-y-3 text-white/70">
              <li><Link href="/shipping-returns" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/track-order" className="hover:text-accent transition-colors">Track Order</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Noor e Taiba Perfumers. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg" alt="Shopify" className="h-6 w-6 opacity-50" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-6 opacity-50" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-6 opacity-50" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google Pay" className="h-6 opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  );
}
