import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import CollectionHighlight from "@/components/CollectionHighlight";
import ProductShowcase from "@/components/ProductShowcase";
import StoryCTA from "@/components/StoryCTA";
import Newsletter from "@/components/Newsletter";
import BenefitsSection from "@/components/BenefitsSection";
import CategoryGrid from "@/components/CategoryGrid";
import BestSellers from "@/components/BestSellers";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InstagramGallery from "@/components/InstagramGallery";
import DiscountsSection from "@/components/DiscountsSection";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Noor e Taiba Perfumers | Luxury Fragrances</title>
        <meta name="description" content="Discover luxury Arabian fragrances crafted with the finest ingredients. Shop our collection of exclusive perfumes at Noor e Taiba Perfumers." />
      </Helmet>
      
      <HeroSection 
        title="Discover the Art of Luxury Perfumery"
        subtitle="Exquisite fragrances that capture the essence of Arabian tradition with modern elegance"
        imageUrl="https://images.unsplash.com/photo-1593483592239-795639d8a7bb?auto=format&fit=crop&q=80&w=1920&h=1080"
        buttonText="Shop Collection"
        buttonLink="/collections"
      />
      <BestSellers />
      <DiscountsSection />
      
      <CategoryGrid />
      <FeaturedProduct />
      <CollectionHighlight />
      {/* <TestimonialCarousel /> */}
      {/* <StoryCTA /> */}
      {/* <InstagramGallery /> */}
      <Newsletter />
      <BenefitsSection />
    </>
  );
}
