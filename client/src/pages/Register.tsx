import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { customerCreate, isLoggedIn } from "@/lib/shopify";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (isLoggedIn()) {
    setLocation("/account");
    return null;
  }

  const validateForm = () => {
    const validationErrors = [];

    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match");
    }

    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long");
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors([]);

    try {
      const { customerUserErrors, customerAccessToken } = await customerCreate(
        firstName,
        lastName,
        email,
        password
      );

      if (customerUserErrors && customerUserErrors.length > 0) {
        setErrors(customerUserErrors.map(error => error.message));
        setIsLoading(false);
        return;
      }

      if (customerAccessToken) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
          variant: "default",
        });
        
        // Redirect to account page after successful registration
        setLocation("/account");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Noor e Taiba Perfumers</title>
        <meta name="description" content="Create a new account with Noor e Taiba Perfumers to enjoy a personalized shopping experience." />
      </Helmet>

      <div className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
            <h1 className="font-playfair text-3xl text-primary mb-6 text-center">Create Account</h1>
            
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="First Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              
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
                  placeholder="Create a password"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}