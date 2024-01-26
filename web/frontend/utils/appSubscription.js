

/**
 * checkAppSubscription
 */
export async function checkAppSubscription(fetch, createSubscriptionFlg = false) {
	let result = {
		existBillFlg: false,
		errors: [],
	};
	let appInstallations;
	try {
		appInstallations = await getAppInstallations(fetch);
		if (appInstallations?.name === 'Alt Japansk') {
			// Don't charge Alt Japansk
			result.existBillFlg = true;
			return result;
		}
		if (appInstallations?.activeSubscriptions === undefined || appInstallations?.launchUrl === undefined) {
			throw new Error('AppInstallations empty');
		}
	} catch(e) {
		console.error('AppInstallations failed (checkAppSubscription)', e);
		result.errors.push(e);
		return result;
	}
	let subscriptions = appInstallations?.activeSubscriptions;
	// If activeSubscription is defined, it means already created the bill
	let activeSubscription;
	if (subscriptions && subscriptions.length > 0) {
		activeSubscription = subscriptions.find((subscription) => subscription.status === 'ACTIVE');
	}
	// Callback URL
	let returnUrl = appInstallations?.launchUrl;
	
	result.returnUrl = returnUrl;
	result.existBillFlg = activeSubscription ? true : false;

	// console.log('activeSubscription', activeSubscription)
	// console.log('returnUrl', returnUrl)
	if (!activeSubscription && createSubscriptionFlg) {
		try {
			let appSubscription = await createAppSubscription(fetch, returnUrl);
			if (appSubscription?.confirmationUrl) {
				// redirect.dispatch(Redirect.Action.REMOTE, appSubscription.confirmationUrl);
				result.confirmationUrl = appSubscription.confirmationUrl;
			} else {
				throw new Error('redirect fail: confirmationUrl is empty');
			}
		} catch (e) {
			console.error('createAppSubscription failed (checkAppSubscription)', e);
			result.errors.push(e);
		}
	}

	return result;
}

/**
 * getAppInstallations
 */
 export async function getAppInstallations(fetch) {
	let appInstallations;
	try {
		appInstallations = await fetch('/api/appSubscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				queryName: 'appInstallations',
			}),
		});
		if (appInstallations.ok) {
			appInstallations = await appInstallations.json();
		}
	} catch(e) {
		console.error('AppInstallations failed (getAppInstallations)');
		return e;
	}
	return appInstallations;
}

/**
 * createAppSubscription
 */
async function createAppSubscription(fetch, returnUrl) {
	let appSubscription;
	try {
		appSubscription = await fetch('/api/appSubscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				queryName: 'appSubscriptionCreate',
				returnUrl: returnUrl
			}),
		});
		if (appSubscription.ok) {
			appSubscription = await appSubscription.json();
		}
	} catch(e) {
		console.error('createAppSubscription failed (createAppSubscription)');
		return e;
	}
	// console.log('appSubscription json', appSubscription);
	return appSubscription;
}
