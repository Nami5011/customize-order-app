// define common variable here

export const apiPath = {
	metafields: '/api/metafields',
	metafieldStorefrontVisibilities: '/api/metafieldStorefrontVisibilities',
	metafieldStorefrontVisibilityCreate: '/api/metafieldStorefrontVisibility/create',
	storefrontAccessTokenCreate: '/api/storefrontAccessTokenCreate',
	webhookCartsUptateCreate: '/api/webhookCartsUptateCreate',
	webhookCartsUptateDelete: '/api/webhookCartsUptateDelete',
	getWebhooks: '/api/getWebhooks'
}
export const apiPathLambda = {
	saveStoreFront: 'https://ke5ie7fajk.execute-api.ap-northeast-1.amazonaws.com/saveStoreFrontDev',
}
export const apiParam = {
	metafields: {
		// namespace: 'test_namespace',
		// key: 'test_key',
		namespace: 'customize-order-app',
		key: 'inventoryStatusSettings',
	},
}

export const ownerType = {
	shop: 'SHOP',
}

export const storefrontTitle ='preorder-dB3v2jY9Itp3';
export const appNameForLambda ='pre-order';
