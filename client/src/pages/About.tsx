
import React from "react";
import { Helmet } from "react-helmet";
import Newsletter from "@/components/Newsletter";
import BenefitsSection from "@/components/BenefitsSection";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Noor e Taiba Perfumers</title>
        <meta name="description" content="Learn about our heritage, values, and commitment to crafting the finest Arabian fragrances at Noor e Taiba Perfumers." />
      </Helmet>
      
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl text-primary mb-6">Our Story</h1>
            <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-foreground/80 leading-relaxed mb-8">
              Founded with a passion for authentic Arabian perfumery, Noor e Taiba Perfumers has been crafting exquisite fragrances that blend traditional artistry with modern sophistication. Our journey began with a simple vision: to share the rich heritage of Middle Eastern perfumery with the world.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-12">
              Each fragrance in our collection is carefully composed using the finest natural ingredients, sourced from across the globe. Our master perfumers combine centuries-old techniques with innovative approaches to create scents that tell stories and evoke emotions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="../src/assets/hero.jpeg" 
                alt="Perfume Crafting" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-6">Our Commitment</h2>
              <div className="w-16 h-1 bg-accent mb-8"></div>
              <p className="text-foreground/80 leading-relaxed mb-6">
                At Noor e Taiba, we are committed to preserving the authenticity of Arabian perfumery while embracing sustainable practices. Our dedication to quality extends from ingredient selection to the final packaging, ensuring each product meets our exceptional standards.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                We believe that every fragrance should be a journey of discovery, an expression of individuality, and a tribute to the timeless art of perfumery. This belief drives us to continuously innovate while honoring traditional craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BenefitsSection />
      <Newsletter />
    </>
  );
}
