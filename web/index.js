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
import { getWebhooks, webhookCartsUptateCreate, webhookCartsUptateDelete } from "./graphql/webhookSubscription.js";
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

app.post(apiPath.webhookCartsUptateCreate, async (_req, res) => {
	try {
		const data = await webhookCartsUptateCreate(
			res.locals.shopify.session,
			);
		res.status(200).send(data);
	} catch (e) {
		console.log(`Failed to process ${apiPath.webhookCartsUptateCreate}: ${e.message}`);
		res.status(500).send(e);
	}
});
app.get(apiPath.getWebhooks, async (_req, res) => {
	try {
		const data = await getWebhooks(
			res.locals.shopify.session,
			);
		res.status(200).send(data);
	} catch (e) {
		console.log(`Failed to process ${apiPath.getWebhooks}: ${e.message}`);
		res.status(500).send(e);
	}
});
app.post(apiPath.webhookCartsUptateDelete, async (_req, res) => {
	try {
		const data = await webhookCartsUptateDelete(
			res.locals.shopify.session,
			);
		res.status(200).send(data);
	} catch (e) {
		console.log(`Failed to process ${apiPath.webhookCartsUptateDelete}: ${e.message}`);
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
// deliveryCustomizationCreate
app.post("/api/deliveryCustomizationCreate", async (req, res) => {
	const payload = req.body;
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	const metafield = payload.metafields[0];
	try {
		// Create the delivery customization for the provided function ID
		const response = await graphqlClient.query({
			data: {
				query: `#graphql
				mutation createDeliveryCustomization($input: DeliveryCustomizationInput!) {
					deliveryCustomizationCreate(deliveryCustomization: $input) {
						deliveryCustomization {
							id
						}
						userErrors {
							message
						}
					}
				}`,
				variables: {
					input: {
						functionId: payload.functionId,
						title: payload.title,
						enabled: true,
						metafields: [
							{
								namespace: "$app:delivery-customization",
								key: "function-configuration",
								type: "json",
								value: JSON.stringify({
									stateProvinceCode: metafield.value.stateProvinceCode,
									message: metafield.value.message,
									domain: metafield.value.domain,////////////////////
								}),
							}
						],
					},
				}
			},
		});
		let updateResult = response.body.data.deliveryCustomizationCreate;
		if (handleUserError(updateResult.userErrors, res)) {
			return;
		}
		return res.status(200).send(updateResult);
	} catch (error) {
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
		throw error;
		}
		return res.status(500).send({ error: error.response });
	}
});

// deliveryCustomizationUpdate
app.post("/api/deliveryCustomizationUpdate", async (req, res) => {
	const payload = req.body;
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	const metafield = payload.deliveryCustomization.metafields[0];
	try {
		// Create the delivery customization for the provided function ID
		const response = await graphqlClient.query({
			data: {
				query: `#graphql
				mutation updateDeliveryCustomization($id: ID!, $input: DeliveryCustomizationInput!) {
					deliveryCustomizationUpdate(id: $id, deliveryCustomization: $input) {
						deliveryCustomization {
							id
						}
						userErrors {
							message
						}
					}
				}`,
				variables: {
					id: `gid://shopify/DeliveryCustomization/${payload.id}`,
					input: {
						functionId: payload.deliveryCustomization.functionId,
						title: payload.deliveryCustomization.title,
						enabled: true,
						metafields: [
							{
								namespace: "$app:delivery-customization",
								key: "function-configuration",
								type: "json",
								value: JSON.stringify({
									stateProvinceCode: metafield.value.stateProvinceCode,
									message: metafield.value.message,
									domain: metafield.value.domain,
								}),
							}
						],
					},
				}
			},
		});
		let result = response.body.data.deliveryCustomizationUpdate;
		if (handleUserError(result.userErrors, res)) {
			return;
		}
		return res.status(200).send(result);
	} catch (error) {
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
		throw error;
		}
		return res.status(500).send({ error: error.response });
	}
});

// deliveryCustomizationDelete
app.get("/api/deliveryCustomizationDelete", async (req, res) => {
	const { gid } = req.query;
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	try {
		// Create the delivery customization for the provided function ID
		const response = await graphqlClient.query({
			data: {
				query: `#graphql
				mutation deliveryCustomizationDelete($id: ID!) {
					deliveryCustomizationDelete(id: $id) {
						deletedId
						userErrors {
							field
							message
						}
					}
				}`,
				variables: {
					id: `gid://shopify/DeliveryCustomization/${gid}`,
				}
			},
		});
		let result = response.body.data.deliveryCustomizationDelete;
		if (handleUserError(result.userErrors, res)) {
			return;
		}
		return res.status(200).send(result);
	} catch (error) {
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
		throw error;
		}
		return res.status(500).send({ error: error.response });
	}
});

// get deliveryCustomization
app.get("/api/deliveryCustomization", async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	const { gid } = req.query;
	console.log(gid)
	let result = [];
	try {
		// Create the delivery customization for the provided function ID
		if (gid) {
			const response = await graphqlClient.query({
				data: {
				query: `#graphql
				query getDeliveryCustomization($id: ID!) {
					deliveryCustomization(id: $id) {
					id
					title
					enabled
					metafield(namespace: "$app:delivery-customization", key: "function-configuration") {
						id
						value
					}
					}
				}`,
					variables: {
					id: `gid://shopify/DeliveryCustomization/${gid}`,
					},
				},
			});
			result = response.body.data.deliveryCustomization;
		} else {
			const response = await graphqlClient.query({
				data: {
				query: `{
					deliveryCustomizations(first: 100) {
						edges {
						node {
							id
							title
							metafields(first: 1) {
							nodes {
								id
								value
							}
							}
						}
						}
					}
					}`,
				},
			});
			result = response.body.data.deliveryCustomizations?.edges;
		}


	} catch (error) {
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
		throw error;
		}
		return res.status(500).send({ error: error.response });
	}
	return res.status(200).send(result);

});

// get deliveryCustomization
app.get("/api/shop/primaryDomain", async (req, res) => {
	const graphqlClient = new shopify.api.clients.Graphql({
		session: res.locals.shopify.session
	});
	let result = {};
	try {
		// Create the delivery customization for the provided function ID
		const response = await graphqlClient.query({
			data: {
				query: `{
					shop {
						primaryDomain {
							url
						}
					}
				}`,
			},
		});
		result = response.body.data.shop?.primaryDomain;

	} catch (error) {
		// Handle errors thrown by the graphql client
		if (!(error instanceof GraphqlQueryError)) {
		throw error;
		}
		return res.status(500).send({ error: error.response });
	}
	return res.status(200).send(result);

});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
