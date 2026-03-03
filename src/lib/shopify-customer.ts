import { storefrontApiRequest } from './shopify';

// ── Mutations ──────────────────────────────────────────────────────────────

const CUSTOMER_CREATE = `
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

const CUSTOMER_ACCESS_TOKEN_CREATE = `
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

const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_UPDATE = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_CREATE = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER = `
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

// ── Queries ────────────────────────────────────────────────────────────────

const CUSTOMER_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      createdAt
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
      }
      addresses(first: 5) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            zip
            country
          }
        }
      }
      orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            lineItems(first: 20) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                    }
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
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

// ── API Functions ──────────────────────────────────────────────────────────

export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  defaultAddress: ShopifyAddress | null;
  addresses: { edges: Array<{ node: ShopifyAddress }> };
  orders: { edges: Array<{ node: ShopifyOrder }> };
}

export interface ShopifyAddress {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string | null;
  statusUrl: string;
  totalPrice: { amount: string; currencyCode: string };
  subtotalPrice: { amount: string; currencyCode: string };
  totalShippingPrice: { amount: string; currencyCode: string };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          image: { url: string } | null;
          price: { amount: string; currencyCode: string };
          selectedOptions: Array<{ name: string; value: string }>;
        } | null;
      };
    }>;
  };
}

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{ success: boolean; error?: string }> {
  const data = await storefrontApiRequest(CUSTOMER_CREATE, { input });
  const errors = data?.data?.customerCreate?.customerUserErrors || [];
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  return { success: true };
}

export async function createAccessToken(
  email: string,
  password: string
): Promise<{ accessToken: string; expiresAt: string } | { error: string }> {
  const data = await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password },
  });
  const errors = data?.data?.customerAccessTokenCreate?.customerUserErrors || [];
  if (errors.length > 0) {
    return { error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  const token = data?.data?.customerAccessTokenCreate?.customerAccessToken;
  if (!token) return { error: 'Failed to create access token' };
  return { accessToken: token.accessToken, expiresAt: token.expiresAt };
}

export async function deleteAccessToken(accessToken: string): Promise<void> {
  await storefrontApiRequest(CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: accessToken });
}

export async function fetchCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const data = await storefrontApiRequest(CUSTOMER_QUERY, { customerAccessToken: accessToken });
  return data?.data?.customer || null;
}

export async function updateCustomer(
  accessToken: string,
  input: { firstName?: string; lastName?: string; email?: string; phone?: string }
): Promise<{ success: boolean; error?: string }> {
  const data = await storefrontApiRequest(CUSTOMER_UPDATE, {
    customerAccessToken: accessToken,
    customer: input,
  });
  const errors = data?.data?.customerUpdate?.customerUserErrors || [];
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  return { success: true };
}

export async function createAddress(
  accessToken: string,
  address: { address1: string; city: string; province?: string; zip: string; country: string }
): Promise<{ success: boolean; error?: string }> {
  const data = await storefrontApiRequest(CUSTOMER_ADDRESS_CREATE, {
    customerAccessToken: accessToken,
    address,
  });
  const errors = data?.data?.customerAddressCreate?.customerUserErrors || [];
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  return { success: true };
}

export async function updateAddress(
  accessToken: string,
  addressId: string,
  address: { address1: string; city: string; province?: string; zip: string; country: string }
): Promise<{ success: boolean; error?: string }> {
  const data = await storefrontApiRequest(CUSTOMER_ADDRESS_UPDATE, {
    customerAccessToken: accessToken,
    id: addressId,
    address,
  });
  const errors = data?.data?.customerAddressUpdate?.customerUserErrors || [];
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  return { success: true };
}

export async function recoverCustomer(email: string): Promise<{ success: boolean; error?: string }> {
  const data = await storefrontApiRequest(CUSTOMER_RECOVER, { email });
  const errors = data?.data?.customerRecover?.customerUserErrors || [];
  if (errors.length > 0) {
    return { success: false, error: errors.map((e: { message: string }) => e.message).join(', ') };
  }
  return { success: true };
}
