// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { DeliveryMethod } from "@shopify/shopify-api";
import { apiPath } from "./common-variable.js";
import { metafieldStorefrontVisibilities, metafieldStorefrontVisibilityCreate } from "./graphql/metafieldStorefrontVisibilities.js";
import { storefrontAccessTokenCreate } from "./graphql/storefrontAccessToken.js";
import * as webhook from "./graphql/webhookSubscription.js";
import * as deliveryProfile from './graphql/deliveryProfile.js';
import * as deliveryCustomization from './graphql/deliveryCustomization.js';
import * as productVariant from './graphql/productVariant.js';
import * as shop from './graphql/shop.js';
import * as appSubscription from './graphql/appSubscription.js';
import { GraphqlQueryError, DataType } from '@shopify/shopify-api';
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers }),
);
// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.post('/api/deliveryProfile', async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Get data here
		const queryData = deliveryProfile.getQueryData(req);
		const response = await graphqlClient.query({
			data: queryData,
		});
		// Get response data here
		let result = deliveryProfile.getResData(req, response);
		// if (handleUserError(result?.userErrors, res)) {
		// 	return;
		// }
		return res.status(200).send(result);
	} catch (error) {
	console.error('response error', error)

		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
			throw res.status(500).send('GraphqlQueryError');
		}
		return res.status(500).send({ error: error.response });
	}
});

// webhook subscription query/mutation
app.post('/api/webhookSubscription', async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Get data here
		const queryData = webhook.getQueryData(req);
		const response = await graphqlClient.query({
			data: queryData,
		});
		// Get response data here
		let result = webhook.getResData(req, response);
		return res.status(200).send(result);
	} catch (error) {
	console.error('response error', error)
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
			throw res.status(500).send('GraphqlQueryError');
		}
		return res.status(500).send({ error: error.response });
	}
});

// productVariant query/mutation
app.post('/api/productVariant', async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Get data here
		const queryData = productVariant.getQueryData(req);
		const response = await graphqlClient.query({
			data: queryData,
		});
		// Get response data here
		let result = productVariant.getResData(req, response);
		return res.status(200).send(result);
	} catch (error) {
		console.error('response error', error);
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
			throw res.status(500).send('GraphqlQueryError');
		}
		return res.status(500).send({ error: error.response });
	}
});

// shop query
app.post('/api/shop', async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Get data here
		const queryData = shop.getQueryData(req);
		const response = await graphqlClient.query({
			data: queryData,
		});
		// Get response data here
		let result = shop.getResData(req, response);
		return res.status(200).send(result);
	} catch (error) {
		console.error('response error', error);
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
			throw res.status(500).send('GraphqlQueryError');
		}
		return res.status(500).send({ error: error.response });
	}
});

// appSubscription query
app.post('/api/appSubscription', async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Get data here
		const queryData = appSubscription.getQueryData(req);
		const response = await graphqlClient.query({
			data: queryData,
		});
		// Get response data here
		let result = appSubscription.getResData(req, response);
		return res.status(200).send(result);
	} catch (error) {
		console.error('response error', error);
		console.error('response errors', error?.response?.errors);
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
			throw res.status(500).send('GraphqlQueryError');
		}
		return res.status(500).send({ error: error.response });
	}
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});
// app.post("/api/products/count/:wildcard", async (req, res) => {
// 	const wildcardData = req.params.wildcard;
// 	const countData = await shopify.api.rest.Product.count({
// 	  session: req.body.session,
// 	  // You can use the captured wildcard data as needed in your code
// 	  wildcardData: wildcardData,
// 	});
// 	res.status(200).send(countData);
//   });

// Create Shop Metafields 
app.post(apiPath.metafields, async (req, res) => {
	try {
		const metafield = new shopify.api.rest.Metafield(
			{session: res.locals.shopify.session}
		);
		metafield.namespace = req.body.namespace;
		metafield.key = req.body.key;
		metafield.value = JSON.stringify(req.body.value);
		metafield.type = "json";
		const response = await metafield.save({
			update: true,
		});
		res.status(200).json(response);
	} catch(err) {
		console.error(err);
		res.status(500).json(err);
	}
});

app.get(apiPath.metafields, async (req, res) => {
	const { namespace, key } = req.query;
	try {
		let metafield = await shopify.api.rest.Metafield.all({
			session: res.locals.shopify.session,
			namespace, // Pass the namespace parameter to the Shopify API
			key, // Pass the key parameter to the Shopify API
		});
		res.status(200).send(metafield);
	} catch(err) {
		console.error(err);
		res.status(500).json(err);
	}
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post(apiPath.metafieldStorefrontVisibilities, async (_req, res) => {
	let status = 200;
	let error = null;

	try {
		const data = await metafieldStorefrontVisibilities(
			res.locals.shopify.session,
			_req.body.namespace
			);
		res.status(200).send(data);
	} catch (e) {
		console.log(`Failed to process ${apiPath.metafieldStorefrontVisibilities}: ${e.message}`);
		// status = 500;
		// error = e.message;
		res.status(500).send(error);
	}
	// res.status(status).send({ success: status === 200, error });
});

app.post(apiPath.metafieldStorefrontVisibilityCreate, async (_req, res) => {
	let status = 200;
	let error = null;

	try {
		const data = await metafieldStorefrontVisibilityCreate(
			res.locals.shopify.session,
			_req.body.namespace,
			_req.body.key,
			_req.body.ownerType
			);
		res.status(200).send(data);
	} catch (e) {
		console.log(`Failed to process ${apiPath.metafieldStorefrontVisibilityCreate}: ${e.message}`);
		// status = 500;
		// error = e.message;
		res.status(500).send(e);
	}
	// res.status(status).send({ success: status === 200, error });
});

app.post(apiPath.storefrontAccessTokenCreate, async (_req, res) => {
	try {
		const data = await storefrontAccessTokenCreate(
			res.locals.shopify.session,
			_req.body.title,
			);
		res.status(200).send(data);
	} catch (e) {
		console.log(`Failed to process ${apiPath.storefrontAccessTokenCreate}: ${e.message}`);
		res.status(500).send(e);
	}
});

function handleUserError(userErrors, res) {
	if (userErrors && userErrors.length > 0) {
		const message = userErrors.map((error) => error.message).join(' ');
		res.status(500).send({ error: message });
		return true;
	}
	return false;
}

// deliveryCustomization
app.post('/api/deliveryCustomization', async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Get data here
		const queryData = deliveryCustomization.getQueryData(req);
		const response = await graphqlClient.query({
			data: queryData,
		});
		// Get response data here
		let result = deliveryCustomization.getResData(req, response);
		return res.status(200).send(result);
	} catch (error) {
		console.error('response error', error)
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
			throw res.status(500).send('GraphqlQueryError');
		}
		return res.status(500).send({ error: error.response });
	}
});

// app.get("/api/shop/primaryDomain", async (req, res) => {
// 	const graphqlClient = new shopify.api.clients.Graphql({
// 		session: res.locals.shopify.session
// 	});
// 	let result = {};
// 	try {
// 		// Create the delivery customization for the provided function ID
// 		const response = await graphqlClient.query({
// 			data: {
// 				query: `{
// 					shop {
// 						primaryDomain {
// 							url
// 						}
// 					}
// 				}`,
// 			},
// 		});
// 		result = response.body.data.shop?.primaryDomain;

// 	} catch (error) {
// 		// Handle errors thrown by the graphql client
// 		if (!(error instanceof GraphqlQueryError)) {
// 		throw error;
// 		}
// 		return res.status(500).send({ error: error.response });
// 	}
// 	return res.status(200).send(result);

// });

// // get storefrontAccessTokens
// app.get("/api/shop/storefrontAccessTokens", async (req, res) => {
// 	const graphqlClient = new shopify.api.clients.Graphql({
// 		session: res.locals.shopify.session
// 	});
// 	const { type, title } = req.query;
// 	let result = {};
// 	let storefrontAccessTokens = [];
// 	try {
// 		// Create the delivery customization for the provided function ID
// 		const response = await graphqlClient.query({
// 			data: {
// 				query: `{
// 					shop {
// 						primaryDomain {
// 							url
// 						}
// 						storefrontAccessTokens(first: 5) {
// 							nodes {
// 								id
// 								accessToken
// 								title
// 								accessScopes {
// 									description
// 									handle
// 								}
// 							}
// 						}
// 					}
// 				}`,
// 			},
// 		});
// 		result = response.body.data.shop;
// 		storefrontAccessTokens = result?.storefrontAccessTokens?.nodes;
// 		storefrontAccessTokens = storefrontAccessTokens ? storefrontAccessTokens : [];
// 		if (title && storefrontAccessTokens.length > 0) {
// 			storefrontAccessTokens = storefrontAccessTokens.filter((storefront) => storefront?.title === title);
// 		}
// 		if (title && type == 'create' && storefrontAccessTokens.length === 0) {
// 			const newToken = await storefrontAccessTokenCreate(
// 				res.locals.shopify.session,
// 				title,
// 			);
// 			storefrontAccessTokens = [newToken?.body?.data?.storefrontAccessTokenCreate?.storefrontAccessToken];
// 		}
// 		result.storefrontAccessTokens = storefrontAccessTokens;
// 	} catch (error) {
// 		// Handle errors thrown by the graphql client
// 		if (!(error instanceof GraphqlQueryError)) {
// 		throw error;
// 		}
// 		return res.status(500).send({ error: error.response });
// 	}
// 	return res.status(200).send(result);
// });
// // delete storefrontAccessTokens
// app.get("/api/storefrontAccessTokenDelete", async (req, res) => {
// 	const graphqlClient = new shopify.api.clients.Graphql({
// 		session: res.locals.shopify.session
// 	});
// 	const { id } = req.query;
// 	let result = {};
// 	try {
// 		// Create the delivery customization for the provided function ID
// 		const response = await graphqlClient.query({
// 			data: {
// 				query: `
// 					mutation storefrontAccessTokenDelete($input: StorefrontAccessTokenDeleteInput!) {
// 						storefrontAccessTokenDelete(input: $input) {
// 							deletedStorefrontAccessTokenId
// 							userErrors {
// 								field
// 								message
// 							}
// 						}
// 					}
// 				`,
// 				variables: {
// 					input: {
// 						id: `gid://shopify/StorefrontAccessToken/${id}`,
// 					}
// 				},
// 			},
// 		});
// 		result = response.body.data.storefrontAccessTokenDelete;
// 	} catch (error) {
// 		// Handle errors thrown by the graphql client
// 		if (!(error instanceof GraphqlQueryError)) {
// 		throw error;
// 		}
// 		return res.status(500).send({ error: error.response });
// 	}
// 	return res.status(200).send(result);
// });
app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
