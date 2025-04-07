import { Product, Collection, Cart, Customer, Order } from "@/types/shopify";

// Shopify Storefront API endpoint
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = '2023-10'; // Update to the current version

// Base URL for the Shopify Storefront API
const shopifyApiUrl = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Customer access token storage key
export const CUSTOMER_ACCESS_TOKEN_KEY = 'shopify_customer_access_token';

// Helper function to make GraphQL requests to Shopify
async function shopifyFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    };

    // Add customer access token if it exists and is not already provided in variables
    if (!variables?.customerAccessToken) {
      const customerAccessToken = localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
      if (customerAccessToken && query.includes('customer')) {
        variables = {
          ...variables,
          customerAccessToken,
        };
      }
    }

    const response = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers,
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

// Customer Authentication Functions

// Customer Sign Up / Create Account
export async function customerCreate(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ customerUserErrors: any[]; customerAccessToken?: { accessToken: string; expiresAt: string } }> {
  // First, create customer account
  const createMutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const createResponse = await shopifyFetch<{
    customerCreate: {
      customer: Customer | null;
      customerUserErrors: any[];
    }
  }>({
    query: createMutation,
    variables: {
      input: {
        firstName,
        lastName,
        email,
        password,
        acceptsMarketing: true,
      },
    },
  });
  
  const { customerCreate: { customerUserErrors } } = createResponse;
  
  // If there are errors during account creation, return them
  if (customerUserErrors && customerUserErrors.length > 0) {
    return { customerUserErrors };
  }
  
  // If account creation is successful, generate access token (login)
  const loginMutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const loginResponse = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: any[];
    }
  }>({
    query: loginMutation,
    variables: {
      input: {
        email,
        password,
      },
    },
  });
  
  const { customerAccessTokenCreate: { customerAccessToken, customerUserErrors: loginErrors } } = loginResponse;
  
  if (customerAccessToken) {
    localStorage.setItem(CUSTOMER_ACCESS_TOKEN_KEY, customerAccessToken.accessToken);
    
    // Set token expiry
    const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
    localStorage.setItem(`${CUSTOMER_ACCESS_TOKEN_KEY}_expires_at`, expiresAt.toString());
  }
  
  return {
    customerUserErrors: loginErrors,
    customerAccessToken: customerAccessToken || undefined,
  };
}

// Customer Login
export async function customerLogin(
  email: string,
  password: string
): Promise<{ customerUserErrors: any[]; customerAccessToken?: { accessToken: string; expiresAt: string } }> {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const response = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: any[];
    }
  }>({
    query: mutation,
    variables: {
      input: {
        email,
        password,
      },
    },
  });
  
  const { customerAccessTokenCreate: { customerAccessToken, customerUserErrors } } = response;
  
  if (customerAccessToken) {
    localStorage.setItem(CUSTOMER_ACCESS_TOKEN_KEY, customerAccessToken.accessToken);
    
    // Set token expiry
    const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
    localStorage.setItem(`${CUSTOMER_ACCESS_TOKEN_KEY}_expires_at`, expiresAt.toString());
  }
  
  return {
    customerUserErrors,
    customerAccessToken: customerAccessToken || undefined,
  };
}

// Customer Logout
export function customerLogout(): void {
  localStorage.removeItem(CUSTOMER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(`${CUSTOMER_ACCESS_TOKEN_KEY}_expires_at`);
}

// Check if customer is logged in
export function isLoggedIn(): boolean {
  const token = localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
  const expiresAt = localStorage.getItem(`${CUSTOMER_ACCESS_TOKEN_KEY}_expires_at`);
  
  if (!token || !expiresAt) {
    return false;
  }
  
  const now = new Date().getTime();
  const expiry = parseInt(expiresAt, 10);
  
  if (now >= expiry) {
    // Token is expired, clean up
    customerLogout();
    return false;
  }
  
  return true;
}

// Get current customer
export async function getCurrentCustomer(): Promise<Customer | null> {
  if (!isLoggedIn()) {
    return null;
  }
  
  const customerAccessToken = localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
  
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        displayName
        defaultAddress {
          id
          address1
          address2
          city
          country
          province
          zip
          firstName
          lastName
          phone
        }
        addresses(first: 5) {
          edges {
            node {
              id
              address1
              address2
              city
              country
              province
              zip
              firstName
              lastName
              phone
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await shopifyFetch<{ customer: Customer | null }>({
      query,
      variables: { customerAccessToken },
    });
    
    return response.customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    // If there's an error (like invalid token), logout
    customerLogout();
    return null;
  }
}

// Get customer orders
export async function getCustomerOrders(first: number = 10): Promise<Order[] | null> {
  if (!isLoggedIn()) {
    return null;
  }
  
  const customerAccessToken = localStorage.getItem(CUSTOMER_ACCESS_TOKEN_KEY);
  
  const query = `
    query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              currentTotalPrice {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    originalTotalPrice {
                      amount
                      currencyCode
                    }
                    variant {
                      title
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await shopifyFetch<{ 
      customer: { 
        orders: { 
          edges: { 
            node: Order 
          }[] 
        } 
      } | null 
    }>({
      query,
      variables: { customerAccessToken, first },
    });
    
    if (!response.customer) {
      return null;
    }
    
    return response.customer.orders.edges.map(({ node }) => node);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return null;
  }
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<{ customerUserErrors: any[] }> {
  const mutation = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const response = await shopifyFetch<{
    customerRecover: {
      customerUserErrors: any[];
    }
  }>({
    query: mutation,
    variables: { email },
  });
  
  return {
    customerUserErrors: response.customerRecover.customerUserErrors,
  };
}

// Reset password with reset token (from email link)
export async function resetPassword(
  resetToken: string,
  password: string
): Promise<{ customerUserErrors: any[]; customerAccessToken?: { accessToken: string; expiresAt: string } }> {
  const mutation = `
    mutation customerResetByUrl($resetToken: String!, $password: String!) {
      customerResetByUrl(resetToken: $resetToken, password: $password) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const response = await shopifyFetch<{
    customerResetByUrl: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: any[];
    }
  }>({
    query: mutation,
    variables: { resetToken, password },
  });
  
  const { customerResetByUrl: { customerAccessToken, customerUserErrors } } = response;
  
  if (customerAccessToken) {
    localStorage.setItem(CUSTOMER_ACCESS_TOKEN_KEY, customerAccessToken.accessToken);
    
    // Set token expiry
    const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
    localStorage.setItem(`${CUSTOMER_ACCESS_TOKEN_KEY}_expires_at`, expiresAt.toString());
  }
  
  return {
    customerUserErrors,
    customerAccessToken: customerAccessToken || undefined,
  };
}

// Update customer information
export async function updateCustomer(
  customerAccessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    acceptsMarketing?: boolean;
  }
): Promise<{ customerUserErrors: any[]; customer?: Customer }> {
  const mutation = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          firstName
          lastName
          email
          phone
          displayName
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const response = await shopifyFetch<{
    customerUpdate: {
      customer: Customer | null;
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: any[];
    }
  }>({
    query: mutation,
    variables: {
      customerAccessToken,
      customer,
    },
  });
  
  const { customerUpdate: { customer: updatedCustomer, customerAccessToken: newToken, customerUserErrors } } = response;
  
  if (newToken) {
    localStorage.setItem(CUSTOMER_ACCESS_TOKEN_KEY, newToken.accessToken);
    
    // Set token expiry
    const expiresAt = new Date(newToken.expiresAt).getTime();
    localStorage.setItem(`${CUSTOMER_ACCESS_TOKEN_KEY}_expires_at`, expiresAt.toString());
  }
  
  return {
    customerUserErrors,
    customer: updatedCustomer || undefined,
  };
}
