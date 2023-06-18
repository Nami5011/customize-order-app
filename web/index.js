// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

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
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
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
app.post("/api/metafields", async (req, res) => {
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

app.get("/api/metafields", async (req, res) => {
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

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
