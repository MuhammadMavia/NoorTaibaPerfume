import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductByHandle } from "@/lib/shopify";
import { Link, useRoute } from "wouter";
import { useCart } from "@/context/CartContext";
import { Helmet } from "react-helmet";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productHandle = params?.id || "";
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${productHandle}`],
    queryFn: () => getProductByHandle(productHandle)
  });
  
  const { addItem } = useCart();
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    if (product && product.variants.edges.length > 0) {
      const variantId = product.variants.edges[selectedVariantIndex].node.id;
      addItem(variantId, quantity);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
          <div className="lg:w-1/2">
            <div className="bg-secondary h-[600px] w-full"></div>
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="h-8 bg-secondary w-3/4"></div>
            <div className="h-6 bg-secondary w-1/2"></div>
            <div className="h-4 bg-secondary w-1/3"></div>
            <div className="h-24 bg-secondary w-full"></div>
            <div className="h-12 bg-secondary w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
        <p className="mb-8">We couldn't find the product you're looking for.</p>
        <Link href="/collections" className="inline-block px-6 py-3 bg-accent text-white">
          Browse Our Collections
        </Link>
      </div>
    );
  }
  
  const { title, description, images, variants, priceRange } = product;
  const variantOptions = variants.edges.map(edge => edge.node);
  const selectedVariant = variants.edges[selectedVariantIndex].node;
  const price = selectedVariant.price || priceRange.minVariantPrice;
  
  const formattedPrice = `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}`;
  const imageUrls = images.edges.map(edge => edge.node.url);
  
  return (
    <>
      <Helmet>
        <title>{`${title} | Noor e Taiba Perfumers`}</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="mb-4">
              <img 
                src={imageUrls[0] || "https://images.unsplash.com/photo-1623605931891-d5b95ee98459?auto=format&fit=crop&q=80&w=800&h=1000"} 
                alt={title}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {imageUrls.slice(0, 4).map((url, i) => (
                  <img 
                    key={i}
                    src={url}
                    alt={`${title} view ${i+1}`}
                    className="w-full h-24 object-cover cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <nav className="text-sm mb-4">
              <Link href="/collections" className="text-foreground/70 hover:text-accent transition-colors">
                Shop
              </Link>
              <span className="mx-2">/</span>
              {product.collections.edges[0] && (
                <>
                  <Link 
                    href={`/collections/${product.collections.edges[0].node.handle}`}
                    className="text-foreground/70 hover:text-accent transition-colors"
                  >
                    {product.collections.edges[0].node.title}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
              <span className="text-foreground">{title}</span>
            </nav>
            
            <h1 className="font-playfair text-3xl md:text-4xl text-primary mb-4">{title}</h1>
            <p className="text-accent text-2xl font-medium mb-6">{formattedPrice}</p>
            
            <div className="mb-8">
              <p className="whitespace-pre-line text-foreground mb-6">{description}</p>
              
              {variantOptions.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-primary font-medium mb-3">Size</h3>
                  <div className="flex space-x-4">
                    {variantOptions.map((variant, i) => (
                      <button 
                        key={variant.id}
                        onClick={() => setSelectedVariantIndex(i)}
                        className={`px-4 py-2 border ${
                          selectedVariantIndex === i 
                            ? 'border-accent text-accent' 
                            : 'border-foreground/30 text-foreground'
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-8 h-8 flex items-center justify-center border border-foreground/30 text-foreground hover:border-accent hover:text-accent transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="w-8 h-8 flex items-center justify-center border border-foreground/30 text-foreground hover:border-accent hover:text-accent transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-primary hover:bg-primary/90 text-white px-6 py-3 uppercase tracking-wider text-sm transition-colors"
                >
                  Add to Cart
                </button>
              </div>
              
              <div className="border-t border-foreground/10 pt-8">
                <div className="mb-4">
                  <h3 className="text-primary font-medium mb-2">Free Shipping</h3>
                  <p className="text-foreground/70 text-sm">On all orders over $100</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-primary font-medium mb-2">Secure Payment</h3>
                  <p className="text-foreground/70 text-sm">All major credit cards accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
