
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'zr4ktm-7m.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '02dfdaf502b652bc60a75f20763f2304';

async function testQuery(name, query) {
  try {
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log(`--- ${name} ---`);
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`${name} error:`, error);
  }
}

async function run() {
  await testQuery('Products', '{ products(first: 1) { edges { node { title } } } }');
  await testQuery('Articles', '{ articles(first: 1) { edges { node { title } } } }');
}

run();
