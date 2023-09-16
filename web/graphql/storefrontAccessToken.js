import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

/**
 * STOREFRONT_ACCESS_TOKEN_CREATE
 */
const STOREFRONT_ACCESS_TOKEN_CREATE = `
	mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
		storefrontAccessTokenCreate(input: $input) {
			shop {
				id
				name
				myshopifyDomain
			}
			storefrontAccessToken {
				id
				accessToken
				title
				accessScopes {
					description
					handle
				}
			}
			userErrors {
				field
				message
			}
		}
	}
`;
export async function storefrontAccessTokenCreate(
  session,
  title,
) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
	const res = await client.query({
        data: {
          query: STOREFRONT_ACCESS_TOKEN_CREATE,
          variables: {
			input: {
				title: title,
			},
          },
        },
      });
	return res;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
};
