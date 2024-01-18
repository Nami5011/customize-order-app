
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
	if (queryName === 'navigationSettings') {
		data = getNavigationSettings(reqBody, res);
	}
	return data;
}

function getNavigationSettings(reqBody, res=null) {
	let data;
	if (res === null) {
		// Get request
		let query = `{
			shop {
				navigationSettings {
					title
					url
				}
			}
		}`;
		data = {
			query: query
		};
	} else {
		// Get response
		data = res?.body?.data?.shop?.navigationSettings;
		if (!data) {
			data = res;
		}
	}
	return data;
};


