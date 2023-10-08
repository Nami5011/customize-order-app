import { useState, useEffect, useCallback } from "react";
import {
	AlphaCard,
	Page,
	TextField,
	ResourceList,
	ResourceItem,
	Text,
	ChoiceList,
	Modal,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import {
	useParams,
} from "react-router-dom";
import { Toast } from "@shopify/app-bridge-react";
// import { Buffer } from 'buffer';
import axios from "axios";
import * as common from '../../../../common-variable.js';
// import { getSessionToken } from "@shopify/app-bridge/utilities";

const ALWAYS = 'ALWAYS';
const INSTOCK_ONLY = 'INSTOCK_ONLY';
const PREORDER = 'PREORDER';
const CHOICELIST = [
	{ label: 'Always display', value: ALWAYS },
	{ label: 'Display when customer has only in-stock-products in cart', value: INSTOCK_ONLY },
	{ label: 'Display when customer has pre-order-products in cart', value: PREORDER },
];

export default function DeliveryCustomization() {
	const fetch = useAuthenticatedFetch();
	const params = useParams();
	const { functionId, id } = params;
	// console.log(params)
	// inputs
	const [stateProvinceCode, setStateProvinceCode] = useState('');
	const [message, setMessage] = useState('');
	const [domain, setDmain] = useState('');
	const [storefront, setStorefront] = useState('');
	const [storefrontId, setStorefrontId] = useState('');
	const [resourceListKey, setResourceListKey] = useState(Date.now());
	// Delivery options form delivery profile API
	const [deliveryOptions, setDeliveryOptions] = useState([]);
	// Custom delivery options from delivery customization API
	const [customDeliveryOptions, setCustomDeliveryOptions] = useState([]);
	// choice select
	const [selectedConditionModal, setSelectedConditionModal] = useState([]);
	// Bulk list
	const [selectedItems, setSelectedItems] = useState([]);
	// Update message
	const [updated, setUpdated] = useState('');
	// Loading
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingBtn, setIsLoadingBtn] = useState(true);
	// toast prop
	const emptyToastProps = { content: null };
	const [toastProps, setToastProps] = useState(emptyToastProps);
	const toastMarkup = toastProps.content && (
		<Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
	);
	var shopify_domain = '';

	const loader = async () => {
		// Get exist delivery customization
		var customOptions = [];
		try {
			if (id != "new") {
				const deliveryCustomizationResponse = await fetch("/api/deliveryCustomization?gid=" + id);
				const deliveryCustomization = await deliveryCustomizationResponse.json();
				// console.log('exist deliveryCustomization', deliveryCustomization);
				const metafieldValue = JSON.parse(deliveryCustomization.metafield.value);
				setStateProvinceCode(metafieldValue.stateProvinceCode);
				setMessage(metafieldValue.message);
				if (metafieldValue.customDeliveryOptions && metafieldValue.customDeliveryOptions.length > 0) {
					setCustomDeliveryOptions(metafieldValue.customDeliveryOptions);
					customOptions = metafieldValue.customDeliveryOptions;
				}
			}
		} catch (e) {
			console.error(e);
		}
		// Get delivery profiles
		// https://shopify.dev/docs/apps/selling-strategies/purchase-options/deferred/shipping-delivery/delivery-profiles#step-4-optional-remove-a-delivery-profile
		let deliveryProfiles;
		try {
			const deliveryProfilesResponse = await fetch('/api/deliveryProfile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'deliveryProfiles',
				}),
			});
			// console.log('deliveryProfilesResponse', deliveryProfilesResponse);
			deliveryProfiles = await deliveryProfilesResponse.json();
			// console.log('deliveryProfiles', deliveryProfiles);
		} catch (e) {
			console.error(e);
		}
		let defaultProfileId;
		if (deliveryProfiles && deliveryProfiles.length > 0) {
			deliveryProfiles = deliveryProfiles.filter(profile => profile.default === true);
		}
		if (deliveryProfiles && deliveryProfiles.length > 0) {
			defaultProfileId = deliveryProfiles[0].id;
		}
		console.log('defaultProfileId', defaultProfileId);

		// Get delivery options
		let methodDefinitions;
		if (defaultProfileId) {
			try {
				const deliveryOptionsResponse = await fetch('/api/deliveryProfile', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						queryName: 'deliveryProfileById',
						id: defaultProfileId,
					}),
				});
				methodDefinitions = await deliveryOptionsResponse.json();
			} catch (e) {
				console.error(e);
			}
		}
		if (methodDefinitions && methodDefinitions.length > 0) {
			let updateMessage = '';
			methodDefinitions.forEach((option, index) => {
				let condition = ALWAYS;
				let target = customOptions.filter(customOption => customOption.id == option.id);
				if (target && target.length > 0) {
					condition = target[0].condition ? target[0].condition : condition;
					if (option.name != target[0].name) {
						updateMessage = 'Shipping rates have been changed. Press Save button to update the customization.'
					}
				}
				methodDefinitions[index].condition = condition;
			});
			setUpdated(updateMessage);
			setDeliveryOptions(methodDefinitions);
		}

		setIsLoading(false);
	};

	const getToken = async () => {
		// Get Storefront Access Token
		try {
			const storefrontAccessTokenResponse = await fetch("/api/shop/storefrontAccessTokens?type=create&title=" + common.storefrontTitle);
			const shop = await storefrontAccessTokenResponse.json();
			const token = shop?.storefrontAccessTokens ? shop?.storefrontAccessTokens[0] : {};
			if (token.length === 0) {
				throw 'Unable to get/create storefront access token.';
			}
			setStorefront(token.accessToken);
			setStorefrontId(token.id);
			shopify_domain = shop?.primaryDomain?.url;
			setDmain(shopify_domain);

			const reqestBody = {};
			reqestBody.app_name = common.appNameForLambda;
			reqestBody.shopify_domain = shop?.primaryDomain?.url;
			reqestBody.storefront_key_id = token.id;
			reqestBody.storefront_key = token.accessToken;
			// Call lambda api to save token
			try {
				let res = await axios.post(common.apiPathLambda.saveStoreFront, reqestBody);
				if (res?.data?.statusCode !== 200) {
					throw res?.data;
				}
				// console.log('response: ', res);
			} catch (error) {
				console.error('failed: ', error);
			}

			// encrtpt to base64
			// let encryptedToken = Buffer.from(token.accessToken).toString('base64');
			// let decodedToken = Buffer.from(encryptedToken, 'base64').toString();
		} catch (e) {
			console.error(e);
		}
	};
	const savePreorderProducts = async () => {
		// Get Storefront Access Token
		let productVariantResponse = {};
		let hasNextPage = true;
		let isIncludeContinue = true;
		let cursor = null;
		let targetProducts = [];
		let productVariants = [];
		let requestProduts = [];
		let reqestBody = {};
		let res = {};

		while (hasNextPage && isIncludeContinue) {
			targetProducts = [];
			try {
				productVariantResponse = await fetch('/api/productVariant', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						queryName: 'productVariantInventoryPolicy',
						first: 5,
						after: cursor ? cursor : null,
					}),
				});
				productVariantResponse = await productVariantResponse.json();
			} catch (e) {
				console.error(e);
			}
			productVariants = productVariantResponse?.edges;
			hasNextPage = productVariantResponse?.pageInfo?.hasNextPage;
			// filter to preorder products
			if (productVariants && productVariants.length > 0) {
				targetProducts = productVariants.filter(variant => variant?.node?.inventoryPolicy == 'CONTINUE' && variant?.node?.inventoryManagement == 'SHOPIFY');
			}
			// check if Graphql result includes preorder products
			isIncludeContinue = targetProducts.length > 0;
			if (isIncludeContinue) {
				requestProduts = [];
				targetProducts.forEach(target => {
					requestProduts.push({
						variant_id: target?.node?.id,
						product_id: target?.node?.product?.id,
					});
				});
				// cursor for after argument
				cursor = productVariants[productVariants.length - 1]?.cursor;
				// Call lambda api to save token
				try {
					reqestBody = {};
					reqestBody.shopify_domain = shopify_domain;
					reqestBody.products = requestProduts;

					res = await axios.post(common.apiPathLambda.savePreorderProductBulk, reqestBody);
					if (res?.data?.statusCode !== 200) {
						throw res?.data;
					}
					// console.log('response: ', res);
				} catch (error) {
					console.error('failed: ', error);
				}
			}
		}
	};
	const init = async () => {
		// Get Storefront Access Token
		await getToken();
		await savePreorderProducts();
		setIsLoadingBtn(false);
	};
	useEffect(() => {
		loader();
		init();
	}, []);

	const checkWebhooks = async () => {
		// Create subscription in case there isn't registered ones
		let webhooks = await getWebhookId();
		let carts_create_id = searchWebhookId(webhooks, 'CARTS_CREATE', common.lambdaArn.CARTS_UPDATE);
		let promiseArray = [];
		if (!carts_create_id) {
			// await webhookCreate('CARTS_CREATE', common.lambdaArn.CARTS_UPDATE);
			promiseArray.push(webhookCreate('CARTS_CREATE', common.lambdaArn.CARTS_UPDATE));
		}
		let carts_update_id = searchWebhookId(webhooks, 'CARTS_UPDATE', common.lambdaArn.CARTS_UPDATE);
		if (!carts_update_id) {
			// await webhookCreate('CARTS_UPDATE', common.lambdaArn.CARTS_UPDATE);
			promiseArray.push(webhookCreate('CARTS_UPDATE', common.lambdaArn.CARTS_UPDATE));
		}
		let products_create_id = searchWebhookId(webhooks, 'PRODUCTS_CREATE', common.lambdaArn.PRODUCTS_UPDATE);
		if (!products_create_id) {
			// await webhookCreate('PRODUCTS_CREATE', common.lambdaArn.PRODUCTS_UPDATE);
			promiseArray.push(webhookCreate('PRODUCTS_CREATE', common.lambdaArn.PRODUCTS_UPDATE));
		}
		let products_update_id = searchWebhookId(webhooks, 'PRODUCTS_UPDATE', common.lambdaArn.PRODUCTS_UPDATE);
		if (!products_update_id) {
			// await webhookCreate('PRODUCTS_UPDATE', common.lambdaArn.PRODUCTS_UPDATE);
			promiseArray.push(webhookCreate('PRODUCTS_UPDATE', common.lambdaArn.PRODUCTS_UPDATE));
		}
		if (promiseArray.length > 0) {
			await Promise.allSettled(promiseArray);
		}
		return;
	};
	const getWebhookId = async () => {
		var return_data = [];
		try {
			const response = await fetch('/api/webhookSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'webhookSubscriptions',
				}),
			});
			return_data = await response.json();
		} catch (e) {
			console.error('Failed get webhooks', e);
		}
		console.log('webhookSubscriptions response', return_data);
		return return_data;
	};
	const searchWebhookId = (webhooks, topic, arn) => {
		let id = null;
		webhooks.forEach(webhook => {
			if (webhook?.topic === topic
				&& webhook?.endpoint?.__typename === "WebhookEventBridgeEndpoint"
				&& webhook?.endpoint?.arn === arn) {
				id = webhook.id;
			}
		});
		console.log('the id :', id);
		return id;
	};
	const webhookCreate = async (topic, arn) => {
		let return_data;
		try {
			let response = await fetch('/api/webhookSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'eventBridgeWebhookSubscriptionCreate',
					topic: topic,
					arn: arn,
				}),
			});
			return_data = await response.json();
			console.log(topic + ': WebhookSubscriptionCreate response', return_data);
			return return_data ?? [];
		} catch (e) {
			console.error(topic + ': WebhookSubscriptionCreate error', e);
			return null;
		}
	};

	// Save
	const action = async () => {
		setIsLoading(true);
		setIsLoadingBtn(true);
		const deliveryCustomizationInput = {
			functionId: functionId,
			title: `Change ${stateProvinceCode} delivery message`,
			enabled: true,
			metafields: [
				{
					namespace: "$app:delivery-customization",
					key: "function-configuration",
					type: "json",
					value: {
						stateProvinceCode: stateProvinceCode,
						message: message,
						domain: domain,
						storefront: storefront,
						customDeliveryOptions: deliveryOptions,
					},
				},
			],
		};
		const createData = {
			id: id,
			deliveryCustomization: deliveryCustomizationInput,
		}
		console.log('deliveryCustomizationInput', deliveryCustomizationInput);
		try {
			if (id != "new") {
				// update
				let response = await fetch('/api/deliveryCustomizationUpdate', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(createData),
				});
				const responseJson = await response.json();
				console.log('updated responce', responseJson)
				const errors = responseJson?.userErrors;
				if (errors?.length && errors.length > 0) {
					setToastProps({
						content: 'Failed Save',
						error: true,
					});
				} else {
					setToastProps({
						content: 'Saved',
					});
				}
			} else {
				// create
				let response = await fetch('/api/deliveryCustomizationCreate', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(deliveryCustomizationInput),
				});
				const responseJson = await response.json();
				const errors = responseJson?.userErrors;
				if (errors?.length && errors.length > 0) {
					setToastProps({
						content: 'Failed Save',
						error: true,
					});
				} else {
					setToastProps({
						content: 'Saved',
					});
				}
				console.log(responseJson);
				// console.log(errors);
			}
			// Register webhooks
			await checkWebhooks();
		} catch (e) {
			setToastProps({
				content: 'Failed Save',
				error: true,
			});
			console.log(e);
		}
		setIsLoading(false);
		setIsLoadingBtn(false);
		setUpdated('');
	};

	const deleteDeliveryCustom = async () => {
		if (!window.confirm('Are you sure you wanna delete?\nThis action can not be undone.')) {
			return;
		}
		setIsLoading(true);
		try {
			const deleteResponse = await fetch("/api/deliveryCustomizationDelete?gid=" + id);
			const responseJson = await deleteResponse.json();
			const errors = responseJson?.userErrors;
			await deleteWebhooks();
			if (errors?.length && errors.length > 0) {
				setToastProps({
					content: 'Failed Delete',
					error: true,
				});
				setIsLoading(false);
			} else {
				goback();
			}
		} catch (e) {
			setToastProps({
				content: 'Failed Delete',
				error: true,
			});
			setIsLoading(false);
		}
	};

	const deleteWebhooks = async () => {
		// Create subscription in case there isn't registered ones
		let webhooks = await getWebhookId();
		let carts_create_id = searchWebhookId(webhooks, 'CARTS_CREATE', common.lambdaArn.CARTS_UPDATE);
		let promiseArray = [];
		if (carts_create_id) {
			// await webhookDelete(carts_create_id);
			promiseArray.push(webhookDelete(carts_create_id));
		}
		let carts_update_id = searchWebhookId(webhooks, 'CARTS_UPDATE', common.lambdaArn.CARTS_UPDATE);
		if (carts_update_id) {
			// await webhookDelete(carts_update_id);
			promiseArray.push(webhookDelete(carts_update_id));
		}
		let products_create_id = searchWebhookId(webhooks, 'PRODUCTS_CREATE', common.lambdaArn.PRODUCTS_UPDATE);
		if (products_create_id) {
			// await webhookDelete(products_create_id);
			promiseArray.push(webhookDelete(products_create_id));
		}
		let products_update_id = searchWebhookId(webhooks, 'PRODUCTS_UPDATE', common.lambdaArn.PRODUCTS_UPDATE);
		if (products_update_id) {
			// await webhookDelete(products_update_id);
			promiseArray.push(webhookDelete(products_update_id));
		}
		if (promiseArray.length > 0) {
			await Promise.allSettled(promiseArray);
		}
		return;
	};
	const webhookDelete = async (id) => {
		return await fetch('/api/webhookSubscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				queryName: 'webhookSubscriptionDelete',
				id: id
			}),
		});
	};
	const goback = () => {
		window.history.back();
	};
	const deleteToken = async () => {
		try {
			const id = storefrontId.substring(storefrontId.lastIndexOf('/') + 1);
			const storefrontAccessDeleteResponse = await fetch("/api/storefrontAccessTokenDelete?id=" + id);
			const storefrontAccessDelete = await storefrontAccessDeleteResponse.json();
			console.log('deleted token', storefrontAccessDelete);
		} catch (e) {
			console.error('failed delete', e);
		}

	};

	// Modal
	const [modalActive, setModalActive] = useState(false);
	const openModal = useCallback(() => {
		console.log('selectedItems', selectedItems)
		setSelectedItems([...selectedItems]); // Prevent from resetting bulk selected items
		setSelectedConditionModal([ALWAYS]);
		setModalActive(true);
	}, [selectedItems]);
	const closeModal = useCallback(() => setModalActive(false), []);

	const setDisplayCondition = useCallback(() => {
		// Done button
		let updateFlg = false;
		let selectedList = selectedItems;
		let methodDefinitions = deliveryOptions;
		methodDefinitions.forEach((option, index) => {
			let target = selectedList.filter(targetOptionId => targetOptionId == option.id);
			if (target && target.length > 0) {
				if (!updateFlg && methodDefinitions[index].condition != selectedConditionModal[0]) {
					updateFlg = true;
				}
				methodDefinitions[index].condition = selectedConditionModal[0];
			}
		});
		console.log('methodDefinitions', methodDefinitions);

		if (updateFlg && id != "new") {
			setUpdated("The change hasn't been saved yet. Press Save to update.");
		}
		setDeliveryOptions(methodDefinitions);
		setModalActive(false);
		setResourceListKey(Date.now()); // to make bulk list rerender
	}, [selectedConditionModal, selectedItems, deliveryOptions, setDeliveryOptions, setUpdated]);

	// Bulk list
	const resourceName = {
		singular: 'Shipping rate',
		plural: 'Shipping rates',
	};
	const promotedBulkActions = [
		{
			content: 'Edit conditions',
			onAction: openModal,
		},
	];
	const bulkActions = [
		{
			content: 'Edit shipping rates',
			onAction: () => window.open('https://admin.shopify.com/store/sample-store-200/settings/shipping/profiles/104451408180', '_blank'),
		},
	];
	// const prevPage = document.referrer;
	// const backBtnTxt = prevPage.match(/\/settings\/shipping\/customizations/g) !== null ? 'Delivery customizations' : 'Back';
	return (
		<>
			{toastMarkup}
			<Page
				title="Change delivery message"
				backAction={{
					content: 'Delivery customizations',
					onAction: goback,
				}}
				primaryAction={{
					content: "Save",
					loading: isLoading || isLoadingBtn,
					onAction: action,
				}}
				secondaryActions={[
					{
						content: 'Delete',
						destructive: true,
						disabled: id == 'new',
						onAction: deleteDeliveryCustom,
					},
				]}
			>
				{/* <AlphaCard roundedAbove="sm">
					<TextField
						name="stateProvinceCode"
						type="text"
						label="State/Province code"
						value={stateProvinceCode}
						onChange={setStateProvinceCode}
						disabled={isLoading}
						requiredIndicator
						autoComplete="on"
					/>
					<TextField
						name="message"
						type="text"
						label="Message"
						value={message}
						onChange={setMessage}
						disabled={isLoading}
						requiredIndicator
						autoComplete="off"
					/>
					<button onClick={deleteToken}>delete storefront access token</button>
				</AlphaCard> */}
				<AlphaCard roundedAbove="sm">
					<Text as="p" color="critical">
						{updated}
					</Text>
					<ResourceList
						key={resourceListKey}
						resourceName={resourceName}
						items={deliveryOptions}
						renderItem={renderItem}
						selectedItems={selectedItems}
						onSelectionChange={setSelectedItems}
						promotedBulkActions={promotedBulkActions}
						bulkActions={bulkActions}
					/>
				</AlphaCard>
				<Modal
					instant
					open={modalActive}
					onClose={closeModal}
					title="Change display condition"
					primaryAction={{
						content: 'Done',
						onAction: setDisplayCondition,
					}}
					secondaryActions={[
						{
							content: 'Cancel',
							onAction: closeModal,
						},
					]}
				>
					<Modal.Section>
						<ChoiceList
							title="Display condition"
							choices={CHOICELIST}
							selected={selectedConditionModal}
							onChange={setSelectedConditionModal}
						/>
					</Modal.Section>
				</Modal>
			</Page>
		</>
	);

	function renderItem(item) {
		let { id, name, condition } = item;
		const url = 'https://admin.shopify.com/store/sample-store-200/settings/shipping/profiles/104451408180';
		let condition_info = [];
		if (condition) {
			condition_info = CHOICELIST.filter(choice => choice.value == condition);
		}
		let condition_title = condition_info && condition_info.length ? condition_info[0].label : CHOICELIST[0].label;
		return (
			<ResourceItem
				id={id}
				// url={url}
				// media={media}
				accessibilityLabel={`View details for ${name}`}
			>
				<Text variant="bodyMd" fontWeight="bold" as="h3">
					{name}
				</Text>
				<div>{condition_title}</div>
			</ResourceItem>
		);
	}
}
