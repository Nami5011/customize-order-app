import { useState, useEffect } from "react";
import {
	AlphaCard,
	Page,
	TextField,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import {
	useParams,
} from "react-router-dom";
import { Toast } from "@shopify/app-bridge-react";
// import { Buffer } from 'buffer';
import axios from "axios";
import { storefrontTitle } from "../../../../common-variable.js";
import { getSessionToken } from "@shopify/app-bridge/utilities";
// to do 
// delete

export default function DeliveryCustomization() {
	const fetch = useAuthenticatedFetch();
	const params = useParams();
	const { functionId, id } = params;
	console.log(params)
	// inputs
	const [stateProvinceCode, setStateProvinceCode] = useState('');
	const [message, setMessage] = useState('');
	const [domain, setDmain] = useState('');
	const [storefront, setStorefront] = useState('');
	const [storefrontId, setStorefrontId] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingBtn, setIsLoadingBtn] = useState(true);
	// toast prop
	const emptyToastProps = { content: null };
	const [toastProps, setToastProps] = useState(emptyToastProps);
	const toastMarkup = toastProps.content && (
		<Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
	);

	const loader = async () => {
		try {
			if (id != "new") {
				const deliveryCustomizationResponse = await fetch("/api/deliveryCustomization?gid=" + id);
				const deliveryCustomization = await deliveryCustomizationResponse.json();
				console.log('exist deliveryCustomization', deliveryCustomization);
				const metafieldValue = JSON.parse(deliveryCustomization.metafield.value);
				setStateProvinceCode(metafieldValue.stateProvinceCode);
				setMessage(metafieldValue.message);
			}
		} catch (e) {
			console.error(e);
		}
		setIsLoading(false);
	};

	const getToken = async () => {
		try {
			// const domainResponse = await fetch("/api/shop/primaryDomain");
			// const primaryDomain = await domainResponse.json();
			// console.log('shop domain', primaryDomain);
			// setDmain(primaryDomain?.url);
			// const storefrontAccessTokenResponse = await fetch("/api/shop/storefrontAccessTokens");
			const storefrontAccessTokenResponse = await fetch("/api/shop/storefrontAccessTokens?type=create&title=" + storefrontTitle);
			console.log("/api/shop/storefrontAccessTokens response", storefrontAccessTokenResponse);
			const shop = await storefrontAccessTokenResponse.json();
			console.log("shop", shop);
			const token = shop?.storefrontAccessTokens ? shop?.storefrontAccessTokens[0] : {};
			if (token.length === 0) {
				throw 'Unable to get/create storefront access token.';
			}
			console.log('accessToken', token.accessToken);
			console.log('accessToken id', token.id);
			console.log('primaryDomain', shop?.primaryDomain?.url);
			setStorefront(token.accessToken);
			// setStorefrontId(token.id);
			setDmain(shop?.primaryDomain?.url);

			setStorefrontId('gid://shopify/StorefrontAccessToken/81817567540');

			// encrtpt to base64
			// let encryptedToken = Buffer.from(token.accessToken).toString('base64');
			// let decodedToken = Buffer.from(encryptedToken, 'base64').toString();
			// console.log('encryptedToken', encryptedToken)
			// console.log('decodedToken', decodedToken)
		} catch (e) {
			console.error(e);
		}
		setIsLoadingBtn(false);
	};

	useEffect(() => {
		loader();
		getToken();
	}, []);

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
		} catch (e) {
			setToastProps({
				content: 'Failed Save',
				error: true,
			});
			console.log(e);
		}
		setIsLoading(false);
		setIsLoadingBtn(false);
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
					loading: isLoading && isLoadingBtn,
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
				<AlphaCard roundedAbove="sm">
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
				</AlphaCard>
			</Page>
		</>
	);
}
