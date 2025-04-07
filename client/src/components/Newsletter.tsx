import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success toast
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
      variant: "default"
    });
    
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/80 mb-8">
            Stay updated with our latest collections, exclusive offers, and fragrance insights
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white uppercase tracking-wider text-sm font-medium disabled:opacity-70"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          
          <p className="text-white/60 text-sm mt-4">
            By subscribing, you agree to receive marketing communications from us.
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}