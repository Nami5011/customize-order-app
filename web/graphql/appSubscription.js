
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
	} else if (queryName === 'appSubscriptionCancel' ) {
		data = appSubscriptionCancel(reqBody, res);
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
				activeSubscriptions {
					name
					id
					status
				}
				launchUrl
			}
		}`;
		data = {
			query: query,
		};
	} else {
		// Get response
		data = res?.body?.data?.currentAppInstallation;
		if (!data) {
			data = res;
		}
	}
	return data;
};

function appSubscriptionCancel(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query = `mutation appSubscriptionCancel($id: ID!) {
			appSubscriptionCancel(id: $id) {
				appSubscription {
					name
					id
					status
				}
				userErrors {
					field
					message
				}
			}
		}`;
		data = {
			query: query,
			variables: {
				id: reqBody.id,
			},
		};
	} else {
		// Get response
		data = res?.body?.data?.appSubscriptionCancel;
		console.log(res)
		if (!data) {
			data = res;
		}
	}
	return data;
};
