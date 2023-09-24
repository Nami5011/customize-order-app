
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
	if (queryName === 'deliveryProfiles') {
		data = getDeliveryProfiles(reqBody, res);
	} else if (queryName === 'deliveryProfileById') {
		data = getDeliveryProfileById(reqBody, res);
	}
	return data;
}

function getDeliveryProfiles(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query = `{
			deliveryProfiles(first: 10) {
				nodes {
					id
					name
					default
				}
			}
		}`;
		data = {
			query: query
		};
	} else {
		// Get response
		data = res?.body?.data?.deliveryProfiles?.nodes;
		if (!data) {
			data = res;
		}
	}
	return data;
};

function getDeliveryProfileById(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let id = reqBody.id;
		let query = `{
			deliveryProfile(id: "${id}") {
				profileLocationGroups {
					locationGroupZones(first: 40) {
						nodes {
							methodDefinitions(first: 10) {
								nodes {
									active
									id
									name
								}
							}
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
		let profileLocationGroups = res?.body?.data?.deliveryProfile?.profileLocationGroups;
		if (!profileLocationGroups) {
			return res;
		}
		data = [];
		profileLocationGroups.forEach(group => {
			if (!group?.locationGroupZones?.nodes) {
				return;
			};
			group.locationGroupZones.nodes.forEach(zone => {
				if (!zone?.methodDefinitions?.nodes) {
					return;
				};
				zone?.methodDefinitions?.nodes.forEach(method => {
					if (method?.active === true) {
						let activeMethod = {
							id: method?.id,
							name: method?.name,
						};
						data.push(activeMethod);
					}
				});
			});
		});
	}
	return data;
};

