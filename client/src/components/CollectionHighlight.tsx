import React from "react";
import { Link } from "wouter";
import { Collection } from "@/types/shopify";
import { useQuery } from "@tanstack/react-query";
import { getAllCollections } from "@/lib/shopify";

const DEFAULT_COLLECTION_IMAGES = [
  {
    title: "Oriental",
    description: "Rich, warm fragrances with amber and spice",
    image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=600&h=800"
  },
  {
    title: "Floral",
    description: "Elegant bouquets of jasmine, rose, and lily",
    image: "https://images.unsplash.com/photo-1615704048632-e95f3acbddb2?auto=format&fit=crop&q=80&w=600&h=800"
  },
  {
    title: "Fresh",
    description: "Crisp, invigorating scents with citrus notes",
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=600&h=800"
  }
];

export default function CollectionHighlight() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ['/api/collections'],
    queryFn: getAllCollections
  });

  const collectionItems = collections?.slice(0, 3) || [];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Our Collections</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Expertly crafted fragrances to suit every personality and occasion. 
            Discover the perfect scent that speaks to your unique spirit.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="group relative overflow-hidden animate-pulse">
                <div className="w-full h-96 bg-secondary"></div>
              </div>
            ))
          ) : collectionItems.length > 0 ? (
            // Render actual collections from Shopify
            collectionItems.map((collection: Collection) => (
              <div key={collection.id} className="group relative overflow-hidden hover-scale">
                <img 
                  src={collection.image?.url || DEFAULT_COLLECTION_IMAGES[0].image}
                  alt={collection.title} 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-80 transition-opacity group-hover:opacity-95"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <h3 className="font-playfair text-2xl mb-2">{collection.title}</h3>
                  <p className="text-white/80 mb-4">{collection.description}</p>
                  <Link href={`/collections/${collection.handle}`} className="inline-block text-sm uppercase tracking-wider border-b border-accent pb-1 text-accent">
                    Explore Collection
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // Fallback to default collections
            DEFAULT_COLLECTION_IMAGES.map((collection, i) => (
              <div key={i} className="group relative overflow-hidden hover-scale">
                <img 
                  src={collection.image}
                  alt={collection.title} 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-80 transition-opacity group-hover:opacity-95"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <h3 className="font-playfair text-2xl mb-2">{collection.title}</h3>
                  <p className="text-white/80 mb-4">{collection.description}</p>
                  <Link href="/collections" className="inline-block text-sm uppercase tracking-wider border-b border-accent pb-1 text-accent">
                    Explore Collection
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
