import React from "react";
import { Link } from "wouter";

interface Category {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const categories: Category[] = [
  {
    title: "For Men",
    description: "Distinctive masculine fragrances for the modern gentleman",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800&h=1000",
    link: "/collections/men"
  },
  {
    title: "For Women",
    description: "Elegant and sophisticated scents for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1629144462171-d90012099da2?auto=format&fit=crop&q=80&w=800&h=1000",
    link: "/collections/women"
  },
  {
    title: "Unisex",
    description: "Gender-neutral fragrances that transcend traditional boundaries",
    imageUrl: "https://images.unsplash.com/photo-1590736969596-8650e471f48a?auto=format&fit=crop&q=80&w=800&h=1000",
    link: "/collections/unisex"
  },
  {
    title: "Gift Sets",
    description: "Perfect presents for fragrance enthusiasts and loved ones",
    imageUrl: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=80&w=800&h=1000",
    link: "/collections/gift-sets"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Explore Categories</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover our carefully curated fragrance collections
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group hover-scale overflow-hidden rounded-sm">
              <Link href={category.link} className="block">
                <div className="relative h-[400px]">
                  <img 
                    src={category.imageUrl} 
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/40 flex flex-col justify-end p-6 text-white">
                    <h3 className="font-playfair text-2xl mb-2">{category.title}</h3>
                    <p className="text-white/80 mb-4">{category.description}</p>
                    <span className="inline-block uppercase tracking-wider text-sm font-medium">
                      Explore <i className="ri-arrow-right-line ml-1 align-middle"></i>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}