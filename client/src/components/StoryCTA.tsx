import React from "react";
import { Link } from "wouter";

export default function StoryCTA() {
  return (
    <section className="py-16 md:py-24 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-playfair text-3xl md:text-4xl mb-6">The Art of Perfumery</h2>
        <p className="max-w-2xl mx-auto text-white/80 mb-8 leading-relaxed">
          At Noor e Taiba, we blend time-honored Arabian traditions with modern 
          perfumery techniques. Each fragrance is carefully crafted to tell a unique story, 
          capturing the essence of luxury and sophistication.
        </p>
        <Link href="/about" className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-white transition-colors uppercase tracking-wider text-sm">
          Discover Our Story
        </Link>
      </div>
    </section>
  );
}
