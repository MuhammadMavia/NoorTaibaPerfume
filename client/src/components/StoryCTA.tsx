import React from "react";
import { Link } from "wouter";

export default function StoryCTA() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1598273542301-d7502bbe4b96?auto=format&fit=crop&q=80&w=600&h=800" 
              alt="Our Story" 
              className="w-full h-[600px] object-cover"
            />
          </div>
          
          <div className="max-w-lg">
            <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-6">Our Story</h2>
            <div className="w-16 h-1 bg-accent mb-8"></div>
            
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Noor e Taiba Perfumers was born from a passion for exceptional fragrances and a dedication to the ancient art of perfumery. Our journey began with a simple vision: to create scents that evoke emotions, memories, and experiences.
            </p>
            
            <p className="text-foreground/80 mb-8 leading-relaxed">
              With roots in traditional Middle Eastern perfumery and an eye toward contemporary luxury, we craft each fragrance with meticulous attention to detail, selecting only the finest ingredients from around the world.
            </p>
            
            <Link 
              href="/about" 
              className="inline-block px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase tracking-wider text-sm"
            >
              Read More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}