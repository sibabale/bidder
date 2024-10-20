import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SHOPIFY_STORE_NAME = process.env.SHOPIFY_STORE_NAME;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

const ShopifyGQL = async (query: any, payload?: any) => {
    const queryConfig = payload ? { query, variables: payload } : { query };
    return await axios.post(
        `https://${SHOPIFY_STORE_NAME}.myshopify.com/api/${SHOPIFY_API_VERSION}/graphql.json`,
        queryConfig,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
            },
        }
    );
};

const ShopifyRest = async (request: string, method: any, data: any) => {
    return await axios(`https://${process.env.STORE}.myshopify.com/admin/api/2023-07/${request}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_REST,
        },
        data,
    });
};

export { ShopifyGQL, ShopifyRest };
