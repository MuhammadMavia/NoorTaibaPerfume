import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { customerLogin, isLoggedIn } from "@/lib/shopify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (isLoggedIn()) {
    setLocation("/account");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const { customerUserErrors, customerAccessToken } = await customerLogin(email, password);

      if (customerUserErrors && customerUserErrors.length > 0) {
        setErrors(customerUserErrors.map(error => error.message));
        setIsLoading(false);
        return;
      }

      if (customerAccessToken) {
        toast({
          title: "Login successful",
          description: "You have been logged in to your account.",
          variant: "default",
        });
        
        // Redirect to account page after successful login
        setLocation("/account");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Noor e Taiba Perfumers</title>
        <meta name="description" content="Login to your Noor e Taiba Perfumers account to view your orders, manage your account details, and more." />
      </Helmet>

      <div className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
            <h1 className="font-playfair text-3xl text-primary mb-6 text-center">Login</h1>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <ul className="list-disc pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="text-sm">
                  <Link href="/register" className="text-accent hover:underline">
                    Create account
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>
                Don't have an account?{" "}
                <Link href="/register" className="text-accent hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}