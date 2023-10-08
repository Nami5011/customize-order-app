
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
	if (queryName === 'productVariantInventoryPolicy') {
		data = productVariantInventoryPolicy(reqBody, res);
	}
	return data;
}

/**
 * productVariants inventoryPolicyの取得
 */
function productVariantInventoryPolicy(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let first = 10;
		if (reqBody?.first) {
			first = reqBody.first;
		}
		let after = '';
		if (reqBody?.after) {
			after = `after: "${reqBody.after}"`;
		}
		// Get request
		const query = `{
			productVariants(
				first: ${first}
				sortKey: INVENTORY_POLICY
				${after}
			) {
				edges {
					cursor
					node {
						id
						inventoryManagement
						inventoryPolicy
						product {
							id
						}
					}
				}
				pageInfo {
					hasNextPage
				}
			}
		}`;
		data = {
			query: query
		};
	} else {
		// Get response
		data = res?.body?.data?.productVariants;
		if (!data) {
			data = res;
		}
	}
	return data;
};
