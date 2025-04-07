import React from "react";
import { Link } from "wouter";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

export default function HeroSection({
  title = "Discover Your Signature Scent",
  subtitle = "Handcrafted fragrances that tell your unique story",
  imageUrl = "https://images.unsplash.com/photo-1613521973937-efce73f2f3dd?auto=format&fit=crop&q=80&w=1800&h=1000",
  buttonText = "Shop Now",
  buttonLink = "/collections"
}: Partial<HeroSectionProps>) {
  return (
    <section className="relative h-[70vh] overflow-hidden bg-secondary">
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl}
          alt="Luxury perfume bottles" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>
      
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-lg text-white">
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-4">{title}</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">{subtitle}</p>
          <Link href={buttonLink}>
            <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 uppercase tracking-wider text-sm transition-colors">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
