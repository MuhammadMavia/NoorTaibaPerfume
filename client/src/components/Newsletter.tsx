import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would connect to a newsletter service
      // Like Shopify's customer data platform or a third-party service
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-playfair text-2xl md:text-3xl text-primary mb-4">Join Our Fragrance Journey</h2>
        <p className="max-w-xl mx-auto text-foreground/70 mb-8">
          Subscribe to receive exclusive offers, early access to new releases, 
          and personalized fragrance recommendations.
        </p>
        
        <form className="max-w-md mx-auto flex" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-4 py-3 bg-white border border-foreground/20 focus:outline-none focus:border-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-accent hover:bg-accent/90 text-white px-6 py-3 uppercase tracking-wider text-sm transition-colors whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
