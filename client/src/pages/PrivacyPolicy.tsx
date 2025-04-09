
import React from "react";
import { Helmet } from "react-helmet";
import Newsletter from "@/components/Newsletter";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Noor e Taiba Perfumers</title>
        <meta name="description" content="Learn about how we collect, use, and protect your personal information at Noor e Taiba Perfumers." />
      </Helmet>
      
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl text-primary mb-6">Privacy Policy</h1>
            <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-foreground/80 leading-relaxed">
              Your privacy is important to us. This policy outlines how we collect and handle your information.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Order history</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process your orders and payments</li>
              <li>Communicate with you about your orders</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>Payment processors and shipping partners</li>
              <li>Service providers who assist our operations</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h2>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at privacy@nooretaiba.com</p>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
