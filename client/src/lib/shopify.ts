import { Product, Collection, Cart } from "@/types/shopify";

// Shopify Storefront API endpoint
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = '2023-10'; // Update to the current version

// Base URL for the Shopify Storefront API
const shopifyApiUrl = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Helper function to make GraphQL requests to Shopify
async function shopifyFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<T> {
  try {
    const response = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();
    
    if (errors) {
      throw new Error(errors.map((e: any) => e.message).join('\n'));
    }

    return data;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}

// Fetch all products
export async function getAllProducts(): Promise<Product[]> {
  const query = `
    query GetAllProducts {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            collections(first: 1) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ products: { edges: { node: Product }[] } }>({ query });
  return response.products.edges.map(({ node }) => node);
}

// Fetch a product by handle
export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              image {
                id
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
        collections(first: 3) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ productByHandle: Product | null }>({ 
    query, 
    variables: { handle } 
  });
  
  return response.productByHandle;
}

// Fetch all collections
export async function getAllCollections(): Promise<Collection[]> {
  const query = `
    query GetAllCollections {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ collections: { edges: { node: Collection }[] } }>({ query });
  return response.collections.edges.map(({ node }) => node);
}

// Fetch a collection by handle with its products
export async function getCollectionByHandle(handle: string): Promise<{ collection: Collection; products: Product[] } | null> {
  const query = `
    query GetCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ 
    collectionByHandle: { 
      id: string; 
      title: string; 
      handle: string; 
      description: string; 
      image: { id: string; url: string; altText: string | null; width: number; height: number; } | null;
      products: { 
        edges: { 
          node: Product;
        }[];
      };
    } | null;
  }>({ query, variables: { handle } });
  
  if (!response.collectionByHandle) {
    return null;
  }
  
  const { products, ...collection } = response.collectionByHandle;
  return {
    collection: collection as Collection,
    products: products.edges.map(({ node }) => node)
  };
}

// Create a new cart
export async function createCart(): Promise<Cart> {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2: price {
                      amount
                      currencyCode
                    }
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartCreate: { cart: Cart } }>({ query });
  return response.cartCreate.cart;
}

// Get cart by ID
export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2: price {
                    amount
                    currencyCode
                  }
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                  product {
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<{ cart: Cart }>({ query, variables: { cartId } });
    return response.cart;
  } catch {
    return null;
  }
}

// Add items to cart
export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2: price {
                      amount
                      currencyCode
                    }
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({ 
    query, 
    variables: { cartId, lines } 
  });
  
  return response.cartLinesAdd.cart;
}

// Update items in cart
export async function updateCartItems(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart> {
  const query = `
    mutation UpdateCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2: price {
                      amount
                      currencyCode
                    }
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({ 
    query, 
    variables: { cartId, lines } 
  });
  
  return response.cartLinesUpdate.cart;
}

// Remove items from cart
export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2: price {
                      amount
                      currencyCode
                    }
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({ 
    query, 
    variables: { cartId, lineIds } 
  });
  
  return response.cartLinesRemove.cart;
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const gqlQuery = `
    query SearchProducts($query: String!) {
      products(first: 20, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ products: { edges: { node: Product }[] } }>({ 
    query: gqlQuery, 
    variables: { query } 
  });
  
  return response.products.edges.map(({ node }) => node);
}
