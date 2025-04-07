export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: MoneyV2;
  availableForSale: boolean;
  image: ShopifyImage;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  collections: {
    edges: {
      node: Collection;
    }[];
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: MoneyV2;
    image: ShopifyImage;
    product: {
      handle: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount: MoneyV2;
  };
}

export interface CustomerAddress {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  country: string;
  province: string | null;
  zip: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string | null;
  defaultAddress: CustomerAddress | null;
  addresses: {
    edges: {
      node: CustomerAddress;
    }[];
  };
}

export interface OrderLineItem {
  title: string;
  quantity: number;
  originalTotalPrice: MoneyV2;
  variant: {
    title: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    price: MoneyV2;
  } | null;
}

export interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  currentTotalPrice: MoneyV2;
  lineItems: {
    edges: {
      node: OrderLineItem;
    }[];
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount: MoneyV2;
  };
}
