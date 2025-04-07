import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/shopify";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Extract the reset token from the URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    
    if (token) {
      setResetToken(token);
    } else {
      setErrors(["Invalid reset token. Please try requesting a new password reset link."]);
    }
  }, []);

  const validateForm = () => {
    const validationErrors = [];

    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long");
    }

    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match");
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
      if (!resetToken) {
        throw new Error("Reset token is missing");
      }

      const { customerUserErrors, customerAccessToken } = await resetPassword(
        resetToken,
        password
      );

      if (customerUserErrors && customerUserErrors.length > 0) {
        setErrors(customerUserErrors.map(error => error.message));
        setIsLoading(false);
        return;
      }

      if (customerAccessToken) {
        toast({
          title: "Password reset successful",
          description: "Your password has been reset successfully and you are now logged in.",
          variant: "default",
        });
        
        // Redirect to account page after successful reset
        setLocation("/account");
      }
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
        <title>Reset Password | Noor e Taiba Perfumers</title>
        <meta name="description" content="Reset your password for your Noor e Taiba Perfumers account." />
      </Helmet>

      <div className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
            <h1 className="font-playfair text-3xl text-primary mb-6 text-center">Reset Password</h1>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <ul className="list-disc pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {resetToken ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Create a new password"
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
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 transition-colors hover:bg-primary/90 disabled:opacity-70"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-foreground">
                  Invalid or expired reset link. Please request a new password reset link.
                </p>
                <a
                  href="/forgot-password"
                  className="mt-4 inline-block text-accent hover:underline"
                >
                  Request new reset link
                </a>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>
                <a href="/login" className="text-accent hover:underline">
                  Back to login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}