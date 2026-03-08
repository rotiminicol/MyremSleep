// Shopify Storefront API Configuration
export const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = 'zr4ktm-7m.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '7c93b616232464ab54268c555d84f141';

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  content: string;
  contentHtml: string;
  publishedAt: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  blog: {
    handle: string;
  };
  tags: string[];
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    productType: string;
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    console.error('Shopify: Payment required - store needs billing plan');
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
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
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export async function fetchProducts(first: number = 10): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first });
  return data?.data?.products?.edges || [];
}

// Blog Articles Query
const BLOG_ARTICLES_QUERY = `
  query GetBlogArticles($first: Int!) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          excerpt
          content
          contentHtml
          publishedAt
          image {
            url
            altText
          }
          blog {
            handle
          }
          tags
        }
      }
    }
  }
`;

const BLOG_ARTICLE_BY_HANDLE_QUERY = `
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        handle
        excerpt
        content
        contentHtml
        publishedAt
        image {
          url
          altText
        }
        blog {
          handle
        }
        tags
      }
    }
  }
`;

export async function fetchBlogArticles(first: number = 20): Promise<ShopifyArticle[]> {
  const data = await storefrontApiRequest(BLOG_ARTICLES_QUERY, { first });
  return data?.data?.articles?.edges?.map((edge: { node: ShopifyArticle }) => edge.node) || [];
}

export async function fetchArticleByHandle(blogHandle: string, articleHandle: string): Promise<ShopifyArticle | null> {
  const data = await storefrontApiRequest(BLOG_ARTICLE_BY_HANDLE_QUERY, { blogHandle, articleHandle });
  return data?.data?.blog?.articleByHandle || null;
}
