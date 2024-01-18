
export function getQueryData(req) {
	let data = getData(req);
	return data;
};

export function getResData(req, res) {
	let data = getData(req, res);
	return data;
};

function getData(req, res=null) {
	let reqBody = req.body;
	let queryName = req.body.queryName;

	let data;
	if (queryName === 'appSubscriptionCreate') {
		data = appSubscriptionCreate(reqBody, res);
	} else if (queryName === 'appInstallations' ) {
		data = appInstallations(reqBody, res);
	}
	return data;
}

function appSubscriptionCreate(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query = `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int, $test: Boolean) {
			appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays, test: $test) {
				userErrors {
					field
					message
				}
				appSubscription {
					id
				}
				confirmationUrl
			}
		}`;
		data = {
			query: query,
			variables: {
				name: "Pre-order Light Plan with a 14 Day Trial",
				returnUrl: reqBody.returnUrl,
				trialDays: 14,
				lineItems: [
					{
						plan: {
							appRecurringPricingDetails: {
								price: {
									amount: 12,
									currencyCode: "USD"
								}
							}
						}
					}
				],
				test: true,
			},
		};
	} else {
		// Get response
		data = res?.body?.data?.appSubscriptionCreate;
		if (!data) {
			data = res;
		}
	}
	return data;
};

function appInstallations(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query = `{
			currentAppInstallation {
			  allSubscriptions(first: 50) {
				nodes {
				  name
				  id
				  status
				}
			  }
			  app {
				id
				launchUrl
			  }
			}
		  }`;
		data = {
			query: query,
		};
	} else {
		// Get response
		data = res?.body?.data;
		if (!data) {
			data = res;
		}
	}
	return data;
};