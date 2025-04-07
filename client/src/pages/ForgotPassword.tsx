import React, { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/lib/shopify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      const { customerUserErrors } = await requestPasswordReset(email);

      if (customerUserErrors && customerUserErrors.length > 0) {
        setErrors(customerUserErrors.map(error => error.message));
        setIsLoading(false);
        return;
      }

      // Shopify will always return success, even if the email doesn't exist
      // This is for security reasons to prevent email enumeration
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists with that email, you'll receive a reset link shortly.",
        variant: "default",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Noor e Taiba Perfumers</title>
        <meta name="description" content="Reset your password for your Noor e Taiba Perfumers account." />
      </Helmet>

      <div className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
            <h1 className="font-playfair text-3xl text-primary mb-6 text-center">Reset Password</h1>
            
            {!isSubmitted ? (
              <>
                <p className="text-foreground mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
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
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 transition-colors hover:bg-primary/90 disabled:opacity-70"
                  >
                    {isLoading ? "Sending reset link..." : "Submit"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-medium text-primary mb-2">Check your email</h2>
                <p className="text-muted-foreground mb-4">
                  If an account exists with the email {email}, we've sent a password reset link.
                </p>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again with a different email address.
                </p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>
                <Link href="/login" className="text-accent hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}