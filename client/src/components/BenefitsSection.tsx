import React from "react";

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

const benefits: BenefitItem[] = [
  {
    icon: "ri-truck-line",
    title: "Free Shipping",
    description: "On all orders over $100. International shipping available."
  },
  {
    icon: "ri-shield-check-line",
    title: "100% Authentic",
    description: "All our fragrances are authentic and sourced directly from the best suppliers."
  },
  {
    icon: "ri-recycle-line",
    title: "Eco-Friendly",
    description: "We are committed to sustainable practices and eco-friendly packaging."
  },
  {
    icon: "ri-customer-service-2-line",
    title: "24/7 Support",
    description: "Our dedicated team is available to assist you with any inquiries."
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Why Choose Us</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Experience the perfect blend of quality, service, and luxury that sets us apart
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-6 border border-foreground/10 hover:border-accent transition-colors hover:shadow-sm">
              <i className={`${benefit.icon} text-4xl text-accent mb-4`}></i>
              <h3 className="font-playfair text-xl text-primary mb-2">{benefit.title}</h3>
              <p className="text-foreground/70">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}