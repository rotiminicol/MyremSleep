const fs = require('fs');

const SHOPIFY_STOREFRONT_URL = 'https://zr4ktm-7m.myshopify.com/api/2025-07/graphql.json';
const SHOPIFY_STOREFRONT_TOKEN = '7c93b616232464ab54268c555d84f141';

const query = `
  query {
    products(first: 5) {
      edges {
        node {
          title
          handle
          options {
            name
            values
          }
          variants(first: 5) {
            edges {
              node {
                title
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

fetch(SHOPIFY_STOREFRONT_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
  },
  body: JSON.stringify({ query }),
})
  .then(res => res.json())
  .then(json => fs.writeFileSync('variants.json', JSON.stringify(json.data.products.edges, null, 2), 'utf-8'))
  .catch(err => console.error(err));
