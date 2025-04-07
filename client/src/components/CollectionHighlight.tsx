import React from "react";
import { Link } from "wouter";
import { Collection } from "@/types/shopify";
import { useQuery } from "@tanstack/react-query";
import { getAllCollections } from "@/lib/shopify";

const DEFAULT_COLLECTION_IMAGES = [
  {
    title: "Oriental",
    description: "Rich, warm fragrances with amber and spice",
    image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=600&h=600"
  },
  {
    title: "Floral",
    description: "Elegant bouquets of jasmine, rose, and lily",
    image: "https://images.unsplash.com/photo-1615704048632-e95f3acbddb2?auto=format&fit=crop&q=80&w=600&h=600"
  },
  {
    title: "Fresh",
    description: "Crisp, invigorating scents with citrus notes",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=600&h=600"
  }
];

export default function CollectionHighlight() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: getAllCollections
  });

  const collectionItems = collections?.slice(0, 3) || [];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Our Collections</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Expertly crafted fragrances to suit every personality and occasion. 
            Discover the perfect scent that speaks to your unique spirit.
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="mx-auto rounded-full w-64 h-64 bg-secondary mb-6"></div>
                <div className="h-6 bg-secondary w-2/3 mx-auto mb-3"></div>
                <div className="h-4 bg-secondary w-1/2 mx-auto"></div>
              </div>
            ))
          ) : collectionItems.length > 0 ? (
            // Render actual collections from Shopify
            collectionItems.map((collection: Collection) => (
              <div key={collection.id} className="text-center group">
                <Link href={`/collections/${collection.handle}`} className="block">
                  <div className="relative mx-auto rounded-full w-64 h-64 overflow-hidden mb-6 shadow-md transition-transform duration-500 hover:scale-105">
                    <img 
                      src={collection.image?.url || DEFAULT_COLLECTION_IMAGES[0].image}
                      alt={collection.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-playfair text-2xl text-primary mb-2 group-hover:text-accent transition-colors">{collection.title}</h3>
                  <p className="text-foreground/70 mb-4 max-w-xs mx-auto">{collection.description}</p>
                  <span className="inline-block text-sm uppercase tracking-wider border-b border-accent pb-1 text-accent">
                    Explore Collection
                  </span>
                </Link>
              </div>
            ))
          ) : (
            // Fallback to default collections
            DEFAULT_COLLECTION_IMAGES.map((collection, i) => (
              <div key={i} className="text-center group">
                <Link href="/collections" className="block">
                  <div className="relative mx-auto rounded-full w-64 h-64 overflow-hidden mb-6 shadow-md transition-transform duration-500 hover:scale-105">
                    <img 
                      src={collection.image}
                      alt={collection.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-playfair text-2xl text-primary mb-2 group-hover:text-accent transition-colors">{collection.title}</h3>
                  <p className="text-foreground/70 mb-4 max-w-xs mx-auto">{collection.description}</p>
                  <span className="inline-block text-sm uppercase tracking-wider border-b border-accent pb-1 text-accent">
                    Explore Collection
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
