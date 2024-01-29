
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
	if (queryName === 'deliveryCustomizationUpdate') {
		data = deliveryCustomizationUpdate(reqBody, res);
	} else if (queryName === 'deliveryCustomizationDelete' ) {
		data = deliveryCustomizationDelete(reqBody, res);
	} else if (queryName === 'deliveryCustomization' ) {
		data = deliveryCustomization(reqBody, res);
	} else if (queryName === 'deliveryCustomizationCreate' ) {
		data = deliveryCustomizationCreate(reqBody, res);
	}
	return data;
}

function deliveryCustomizationCreate(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		const metafield = reqBody.metafields[0];
		let query = `mutation createDeliveryCustomization($input: DeliveryCustomizationInput!) {
			deliveryCustomizationCreate(deliveryCustomization: $input) {
				deliveryCustomization {
					id
					functionId
				}
				userErrors {
					message
				}
			}
		}`;
		data = {
			query: query,
			variables: {
				input: {
					functionId: reqBody.functionId,
					title: reqBody.title,
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
								storefront: metafield.value.storefront,
								customDeliveryOptions: metafield.value.customDeliveryOptions,
							}),
						}
					],
				},
			},
		};
	} else {
		// Get response
		data = res?.body?.data?.deliveryCustomizationCreate;
		if (!data) {
			data = res;
		}
	}
	return data;
};

function deliveryCustomizationUpdate(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		const metafield = reqBody.deliveryCustomization.metafields[0];
		let query = `mutation updateDeliveryCustomization($id: ID!, $input: DeliveryCustomizationInput!) {
			deliveryCustomizationUpdate(id: $id, deliveryCustomization: $input) {
				deliveryCustomization {
					id
					functionId
				}
				userErrors {
					message
				}
			}
		}`;
		data = {
			query: query,
			variables: {
				id: reqBody.gid,
				input: {
					functionId: reqBody.deliveryCustomization.functionId,
					title: reqBody.deliveryCustomization.title,
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
								storefront: metafield.value.storefront,
								customDeliveryOptions: metafield.value.customDeliveryOptions,
							}),
						}
					],
				},
			},
		};
	} else {
		// Get response
		data = res?.body?.data?.deliveryCustomizationUpdate;
		if (!data) {
			data = res;
		}
	}
	return data;
};

function deliveryCustomizationDelete(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query = `mutation deliveryCustomizationDelete($id: ID!) {
			deliveryCustomizationDelete(id: $id) {
				deletedId
				userErrors {
					field
					message
				}
			}
		}`;
		data = {
			query: query,
			variables: {
				id: reqBody.gid,
			},
		};
	} else {
		// Get response
		data = res?.body?.data?.deliveryCustomizationDelete;
		if (!data) {
			data = res;
		}
	}
	return data;
};

function deliveryCustomization(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query;
		if (reqBody?.gid) {
			query = `query getDeliveryCustomization($id: ID!) {
				deliveryCustomization(id: $id) {
					id
					title
					functionId
					metafield(namespace: "$app:delivery-customization", key: "function-configuration") {
						id
						value
					}
				}
			}`;
			data = {
				query: query,
				variables: {
					id: reqBody.gid,
				},
			};
		} else {
			query = `{
				deliveryCustomizations(first: 100) {
					nodes {
						id
						title
						functionId
						metafield(namespace: "$app:delivery-customization", key: "function-configuration") {
							id
							value
						}
					}
				}
			}`;
			data = {
				query: query,
			};
		}
	} else {
		// Get response
		let deliveryCustomizationResponse = res?.body?.data?.deliveryCustomization || res?.body?.data?.deliveryCustomizations;
		// console.log('deliveryCustomizationResponse', deliveryCustomizationResponse)
		if (!deliveryCustomizationResponse) {
			data = res;
			return data;
		}
		if (deliveryCustomizationResponse?.nodes) {
			data = deliveryCustomizationResponse?.nodes.find((node) => node.title === reqBody?.title);
			data = data ? data : {};
		} else {
			data = deliveryCustomizationResponse;
		}
	}
	return data;
};
