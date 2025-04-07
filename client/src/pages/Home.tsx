import React from "react";
import HeroSection from "@/components/HeroSection";
import StoryCTA from "@/components/StoryCTA";
import Newsletter from "@/components/Newsletter";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Noor e Taiba Perfumers | Luxury Fragrances</title>
        <meta name="description" content="Discover luxury Arabian fragrances crafted with the finest ingredients. Shop our collection of exclusive perfumes at Noor e Taiba Perfumers." />
      </Helmet>
      
      <HeroSection />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-6">Luxury Perfumes</h2>
            <p className="max-w-2xl mx-auto text-foreground/70 mb-12">
              Explore our exquisite collection of perfumes crafted from the finest ingredients. 
              Experience the rich tradition of Arabian perfumery reimagined for the modern connoisseur.
            </p>
            <div className="w-16 h-1 bg-accent mx-auto mb-12"></div>
          </div>
        </div>
      </div>
      <StoryCTA />
      <Newsletter />
    </>
  );
}
