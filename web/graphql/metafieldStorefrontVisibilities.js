import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
// import apiParam from "../common-variable.js";

/**
 * METAFIELD_STOREFRONT_VISIBILITYIES
 */
export async function metafieldStorefrontVisibilities(
	session,
	namespace
) {
	const client = new shopify.api.clients.Graphql({ session });
	const METAFIELD_STOREFRONT_VISIBILITYIES = `
		query {
			metafieldStorefrontVisibilities(
				first:1
				namespace: "${namespace}"
			) {
				nodes {
					id
				}
			}
		}
	`;
	try {
		const res = await client.query({
			data: {
				query: METAFIELD_STOREFRONT_VISIBILITYIES,
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

/**
 * METAFIELD_STOREFRONT_VISIBILITY_CREATE
 */
const METAFIELD_STOREFRONT_VISIBILITY_CREATE = `
	mutation metafieldStorefrontVisibilityCreate($input: MetafieldStorefrontVisibilityInput!) {
		metafieldStorefrontVisibilityCreate(input: $input) {
			metafieldStorefrontVisibility {
				id
			}
			userErrors {
				field
				message
			}
		}
	}
`;

export async function metafieldStorefrontVisibilityCreate(
  session,
  namespace,
  key,
  ownerType
) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
	const res = await client.query({
        data: {
          query: METAFIELD_STOREFRONT_VISIBILITY_CREATE,
          variables: {
            input: {
				namespace: namespace,
				key: key,
				ownerType: ownerType,
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
