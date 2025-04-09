
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Newsletter from "@/components/Newsletter";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Noor e Taiba Perfumers</title>
        <meta name="description" content="Get in touch with us for any questions about our fragrances or services at Noor e Taiba Perfumers." />
      </Helmet>
      
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl text-primary mb-6">Contact Us</h1>
            <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-foreground/80 leading-relaxed">
              Have questions about our fragrances or services? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-playfair text-3xl text-primary mb-6">Get in Touch</h2>
              <div className="w-16 h-1 bg-accent mb-8"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 uppercase tracking-wider text-sm transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            <div>
              <h2 className="font-playfair text-3xl text-primary mb-6">Visit Our Store</h2>
              <div className="w-16 h-1 bg-accent mb-8"></div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Address</h3>
                  <p className="text-foreground/80">
                    123 Perfume Street<br />
                    Dubai, United Arab Emirates
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Hours</h3>
                  <p className="text-foreground/80">
                    Monday - Saturday: 10:00 AM - 9:00 PM<br />
                    Sunday: 12:00 PM - 6:00 PM
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Contact</h3>
                  <p className="text-foreground/80">
                    Phone: +971 123 456 789<br />
                    Email: info@nooretaiba.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
