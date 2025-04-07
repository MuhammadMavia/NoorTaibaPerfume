import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getCurrentCustomer, getCustomerOrders, customerLogout, updateCustomer, isLoggedIn, CUSTOMER_ACCESS_TOKEN_KEY } from "@/lib/shopify";
import { Customer, Order } from "@/types/shopify";
import { Loader2 } from "lucide-react";

export default function Account() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn()) {
        setLocation("/login");
        return;
      }

      try {
        // Fetch customer data
        const customerData = await getCurrentCustomer();
        if (customerData) {
          setCustomer(customerData);
          setFirstName(customerData.firstName || "");
          setLastName(customerData.lastName || "");
          setEmail(customerData.email || "");
          setPhone(customerData.phone || "");
        }

        // Fetch order data
        const orderData = await getCustomerOrders();
        if (orderData) {
          setOrders(orderData);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
        toast({
          title: "Error",
          description: "Failed to load account information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setLocation, toast]);

  const handleLogout = () => {
    customerLogout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    setLocation("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const getOrderStatusLabel = (status: string | null) => {
    if (!status) return "Processing";
    
    switch (status.toLowerCase()) {
      case "fulfilled":
        return "Fulfilled";
      case "paid":
        return "Paid";
      case "unfulfilled":
        return "Processing";
      case "partially_fulfilled":
        return "Partially Fulfilled";
      default:
        return status;
    }
  };

  const getOrderStatusStyle = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "fulfilled":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "unfulfilled":
        return "bg-yellow-100 text-yellow-800";
      case "partially_fulfilled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const validatePasswordForm = () => {
    const validationErrors = [];

    if (newPassword && newPassword.length < 8) {
      validationErrors.push("New password must be at least 8 characters long");
    }

    if (newPassword && newPassword !== confirmPassword) {
      validationErrors.push("New passwords do not match");
    }

    if (newPassword && !currentPassword) {
      validationErrors.push("Current password is required to set a new password");
    }

    return validationErrors;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    setErrors([]);

    try {
      if (!customer) {
        throw new Error("Customer data not available");
      }

      // Password update validation
      if (newPassword) {
        const validationErrors = validatePasswordForm();
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setIsUpdating(false);
          return;
        }
      }

      const accessToken = localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY) || "";
      const updateData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        password?: string;
      } = {};

      // Only include fields that have changed
      if (firstName !== customer.firstName) updateData.firstName = firstName;
      if (lastName !== customer.lastName) updateData.lastName = lastName;
      if (email !== customer.email) updateData.email = email;
      if (phone !== customer.phone) updateData.phone = phone;
      if (newPassword) updateData.password = newPassword;

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        const { customerUserErrors, customer: updatedCustomer } = await updateCustomer(
          accessToken,
          updateData
        );

        if (customerUserErrors && customerUserErrors.length > 0) {
          setErrors(customerUserErrors.map(error => error.message));
          setIsUpdating(false);
          return;
        }

        if (updatedCustomer) {
          setCustomer(updatedCustomer);
          
          // Reset password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "No changes",
          description: "No changes were made to your profile.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Account | Noor e Taiba Perfumers</title>
        <meta name="description" content="Manage your Noor e Taiba Perfumers account, view your orders, and update your profile." />
      </Helmet>

      <div className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div>
                <h1 className="font-playfair text-3xl text-primary">My Account</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {customer?.firstName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 md:mt-0 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                Log Out
              </button>
            </div>

            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="w-full border-b border-border grid grid-cols-2 md:flex rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary py-3 px-4"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary py-3 px-4"
                >
                  Orders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="bg-white p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-6">Profile Information</h2>
                
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <ul className="list-disc pl-5">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="(Optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="Confirm new password"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave password fields empty if you don't want to change it
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-primary text-white px-6 py-2 transition-colors hover:bg-primary/90 disabled:opacity-70"
                    >
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="orders" className="bg-white p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-6">Order History</h2>
                
                {orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border rounded-sm overflow-hidden">
                        <div className="p-4 bg-secondary/50 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Order Number</p>
                            <p className="font-medium">#{order.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p>{formatDate(order.processedAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p>{formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded ${getOrderStatusStyle(order.fulfillmentStatus)}`}>
                              {getOrderStatusLabel(order.fulfillmentStatus)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-medium mb-3">Items</h3>
                          <div className="space-y-3">
                            {order.lineItems.edges.map(({ node: item }) => (
                              <div key={item.title} className="flex items-center">
                                <div className="w-12 h-12 bg-secondary flex-shrink-0 mr-3 relative overflow-hidden">
                                  {item.variant?.image ? (
                                    <img 
                                      src={item.variant.image.url} 
                                      alt={item.variant.image.altText || item.title}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                      <span className="text-xs text-muted-foreground">No image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <p className="text-sm font-medium">{item.title}</p>
                                  {item.variant && (
                                    <p className="text-xs text-muted-foreground">{item.variant.title}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {formatPrice(
                                      item.originalTotalPrice.amount,
                                      item.originalTotalPrice.currencyCode
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-border rounded-sm">
                    <p className="text-lg text-muted-foreground">You haven't placed any orders yet</p>
                    <a 
                      href="/collections/all" 
                      className="mt-4 inline-block bg-primary text-white px-6 py-2 transition-colors hover:bg-primary/90"
                    >
                      Start Shopping
                    </a>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}