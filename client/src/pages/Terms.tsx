
import React from "react";
import { Helmet } from "react-helmet";
import Newsletter from "@/components/Newsletter";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Noor e Taiba Perfumers</title>
        <meta name="description" content="Read our terms and conditions for using Noor e Taiba Perfumers' services and products." />
      </Helmet>
      
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl text-primary mb-6">Terms & Conditions</h1>
            <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-foreground/80 leading-relaxed">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by these terms and conditions.</p>

            <h2>Products and Services</h2>
            <p>All products are subject to availability. We reserve the right to discontinue any product at any time.</p>
            
            <h2>Pricing and Payment</h2>
            <ul>
              <li>All prices are in USD unless otherwise stated</li>
              <li>Prices are subject to change without notice</li>
              <li>Payment must be made in full before order processing</li>
            </ul>

            <h2>Shipping and Delivery</h2>
            <p>We aim to deliver products within the estimated timeframes, but delays may occur. Risk of loss and title pass to you upon delivery.</p>

            <h2>Returns and Refunds</h2>
            <ul>
              <li>Returns accepted within 30 days of purchase</li>
              <li>Products must be unused and in original packaging</li>
              <li>Shipping costs for returns are the customer's responsibility</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>All content on this website is our property and protected by copyright laws.</p>

            <h2>Limitation of Liability</h2>
            <p>We shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products or services.</p>

            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>

            <h2>Contact Information</h2>
            <p>For questions about these terms, please contact us at legal@nooretaiba.com</p>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
