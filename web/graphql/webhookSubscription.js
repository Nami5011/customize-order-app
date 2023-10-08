
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
	if (queryName === 'webhookSubscriptions') {
		data = webhookSubscriptions(reqBody, res);
	} else if (queryName === 'eventBridgeWebhookSubscriptionCreate') {
		data = eventBridgeWebhookSubscriptionCreate(reqBody, res);
	} else if (queryName === 'webhookSubscriptionDelete') {
		data = webhookSubscriptionDelete(reqBody, res);
	}
	return data;
}

/**
 * webhookの取得
 */
function webhookSubscriptions(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		const query = `{
			webhookSubscriptions(first: 50) {
				nodes {
					id
					topic
					format
					endpoint {
						__typename
						... on WebhookHttpEndpoint {
							callbackUrl
						}
						... on WebhookEventBridgeEndpoint {
							arn
						}
						... on WebhookPubSubEndpoint {
							pubSubProject
							pubSubTopic
						}
					}
				}
			}
		}`;
		data = {
			query: query
		};
	} else {
		// Get response
		data = res?.body?.data?.webhookSubscriptions?.nodes;
		if (!data) {
			data = res;
		}
	}
	return data;
};

/**
 * Event bridge webhookの登録
 * eventBridgeWebhookSubscriptionCreate
 */
function eventBridgeWebhookSubscriptionCreate(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		if (!reqBody?.topic || !reqBody?.arn) {
			return null;
		}
		const query = `
			mutation eventBridgeWebhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: EventBridgeWebhookSubscriptionInput!) {
				eventBridgeWebhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
					webhookSubscription {
						id
						topic
						format
						endpoint {
							__typename
							... on WebhookEventBridgeEndpoint {
								arn
							}
						}
					}
					userErrors {
						field
						message
					}
				}
			}
		`;
		data = {
			query: query,
			variables: {
				topic: reqBody.topic,
				webhookSubscription: {
					arn: reqBody.arn,
					format: 'JSON'
				}
			},
		};
	} else {
		// Get response
		data = res?.body?.data?.eventBridgeWebhookSubscriptionCreate;
		if (!data) {
			data = res;
		}
	}
	return data;
};

/**
 * webhookの削除
 * webhookSubscriptionDelete
 */
function webhookSubscriptionDelete(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		if (!reqBody?.id) {
			return null;
		}
		const query = `
		mutation webhookSubscriptionDelete($id: ID!) {
			webhookSubscriptionDelete(id: $id) {
				deletedWebhookSubscriptionId
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
		data = res?.body?.data?.webhookSubscriptionDelete;
		if (!data) {
			data = res;
		}
	}
	return data;
};