import {
	VerticalStack, HorizontalGrid, Box, Page, Text, AlphaCard, TextField, Checkbox, Collapsible, ChoiceList, ColorPicker, RangeSlider, HorizontalStack, Button,
	hsbToHex, rgbToHsb
} from "@shopify/polaris";
import { TitleBar, Toast } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { apiPath, apiParam, ownerType } from '../../common-variable';
import { CustomColorPicker } from "../components";
import { hsbToRgb, hexToRgbObject } from "../utils/colorConvert";

function InventoryStatusSettings() {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);

	const emptyToastProps = { content: null };
	const [toastProps, setToastProps] = useState(emptyToastProps);
	const toastMarkup = toastProps.content && (
		<Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
	);

	const hexToHsb = (hex) => {
		return rgbToHsb(hexToRgbObject(hex));
	}
	const isValidHex = (hex) => {
		return hexToRgbObject(hex) ? true : false;
	}
	const handleHexChange = (value, setHsb, setHex) => {
		if (isValidHex(value)) {
			setHsb(hexToHsb(value));
		}
		setHex(value);
	}
	const handleHsbChange = (value, setHsb, setHex) => {
		setHsb(value);
		setHex(hsbToHex(value));
	}

	const fetch = useAuthenticatedFetch();
	const metafieldsApiPath = apiPath.metafields;
	const namespace = apiParam.metafields.namespace;
	const key = apiParam.metafields.key;
	const defaultColorGreen = '#32CD32';
	const defaultColorYellow = '#FFA500';
	const defaultColorGray = '#808080';
	const defaultColorBlack = '#000000';
	// initialize In stock status
	const [showInstockFlg, setShowInstockFlg] = useState(false);
	const [iconTypeInstock, setIconTypeInstock] = useState(['none']);
	const [colorIconInstock, setColorIconInstock] = useState(hexToHsb(defaultColorGreen));
	const [hexIconInstock, setHexIconInstock] = useState(defaultColorGreen);
	const [msgInstock, setMsgInstock] = useState('');
	const [colorMsgInstock, setColorMsgInstock] = useState(hexToHsb(defaultColorBlack));
	const [hexMsgInstock, setHexMsgInstock] = useState(defaultColorBlack);
	// initialize Low Invntory status
	const [showLowInventoryFlg, setShowLowInventoryFlg] = useState(false);
	const [iconTypeLowInventory, setIconTypeLowInventory] = useState(['none']);
	const [colorIconLowInventory, setColorIconLowInventory] = useState(hexToHsb(defaultColorYellow));
	const [hexIconLowInventory, setHexIconLowInventory] = useState(defaultColorYellow);
	const [rangeLowInventory, setRangeLowInventory] = useState(10);
	const [msgLowInventory, setMsgLowInventory] = useState('');
	const [colorMsgLowInventory, setColorMsgLowInventory] = useState(hexToHsb(defaultColorBlack));
	const [hexMsgLowInventory, setHexMsgLowInventory] = useState(defaultColorBlack);
	// initialize pre order status
	const [showPreorderFlg, setShowPreorderFlg] = useState(false);
	const [iconTypePreorder, setIconTypePreorder] = useState(['none']);
	const [colorIconPreorder, setColorIconPreorder] = useState(hexToHsb(defaultColorYellow));
	const [hexIconPreorder, setHexIconPreorder] = useState(defaultColorYellow);
	const [msgPreorder, setMsgPreorder] = useState('');
	const [colorMsgPreorder, setColorMsgPreorder] = useState(hexToHsb(defaultColorBlack));
	const [hexMsgPreorder, setHexMsgPreorder] = useState(defaultColorBlack);
	// initialize out of stock status
	const [showOutOfStockFlg, setShowOutOfStockFlg] = useState(false);
	const [iconTypeOutOfStock, setIconTypeOutOfStock] = useState(['none']);
	const [colorIconOutOfStock, setColorIconOutOfStock] = useState(hexToHsb(defaultColorGray));
	const [hexIconOutOfStock, setHexIconOutOfStock] = useState(defaultColorGray);
	const [msgOutOfStock, setMsgOutOfStock] = useState('');
	const [colorMsgOutOfStock, setColorMsgOutOfStock] = useState(hexToHsb(defaultColorBlack));
	const [hexMsgOutOfStock, setHexMsgOutOfStock] = useState(defaultColorBlack);

	const init = async () => {
		try {
			// console.log('fetch: ' + metafieldsApiPath + '?namespace=' + namespace + '&key=' + key);
			let metafields = await fetch(metafieldsApiPath + '?namespace=' + namespace + '&key=' + key);
			let value = {};
			if (metafields.ok) {
				let data = await metafields.json();
				if (data && data.data.length > 0 && data.data[0].value) {
					data = data.data[0];
					data.value = JSON.parse(data.value);
					value = data.value;
				} else {
					setIsLoading(false);
					return;
				}
				console.log('response data:', data);
				// set the data in form
				setShowInstockFlg(value.showInstockFlg ?? false);
				setIconTypeInstock(value.iconTypeInstock ?? ['icon']);
				setColorIconInstock(hexToHsb(value.hexIconInstock ? value.hexIconInstock : defaultColorGreen));
				setHexIconInstock(value.hexIconInstock ? value.hexIconInstock : defaultColorGreen);
				setMsgInstock(value.msgInstock ?? '');
				setColorMsgInstock(hexToHsb(value.hexMsgInstock ? value.hexMsgInstock : defaultColorBlack));
				setHexMsgInstock(value.hexMsgInstock ? value.hexMsgInstock : defaultColorBlack);

				setShowLowInventoryFlg(value.showLowInventoryFlg ?? false);
				setIconTypeLowInventory(value.iconTypeLowInventory ?? ['icon']);
				setColorIconLowInventory(hexToHsb(value.hexIconLowInventory ? value.hexIconLowInventory : defaultColorYellow));
				setHexIconLowInventory(value.hexIconLowInventory ? value.hexIconLowInventory : defaultColorYellow);
				setRangeLowInventory(value.rangeLowInventory ?? 3);
				setMsgLowInventory(value.msgLowInventory ?? '');
				setColorMsgLowInventory(hexToHsb(value.hexMsgLowInventory ? value.hexMsgLowInventory : defaultColorBlack));
				setHexMsgLowInventory(value.hexMsgLowInventory ? value.hexMsgLowInventory : defaultColorBlack);

				setShowPreorderFlg(value.showPreorderFlg ?? false);
				setIconTypePreorder(value.iconTypePreorder ?? ['icon']);
				setColorIconPreorder(hexToHsb(value.hexIconPreorder ? value.hexIconPreorder : defaultColorYellow));
				setHexIconPreorder(value.hexIconPreorder ? value.hexIconPreorder : defaultColorYellow);
				setMsgPreorder(value.msgPreorder ?? '');
				setColorMsgPreorder(hexToHsb(value.hexMsgPreorder ? value.hexMsgPreorder : defaultColorBlack));
				setHexMsgPreorder(value.hexMsgPreorder ? value.hexMsgPreorder : defaultColorBlack);

				setShowOutOfStockFlg(value.showOutOfStockFlg ?? false);
				setIconTypeOutOfStock(value.iconTypeOutOfStock ?? ['icon']);
				setColorIconOutOfStock(hexToHsb(value.hexIconOutOfStock ? value.hexIconOutOfStock : defaultColorGray));
				setHexIconOutOfStock(value.hexIconOutOfStock ? value.hexIconOutOfStock : defaultColorGray);
				setMsgOutOfStock(value.msgOutOfStock ?? '');
				setColorMsgOutOfStock(hexToHsb(value.hexMsgOutOfStock ? value.hexMsgOutOfStock : defaultColorBlack));
				setHexMsgOutOfStock(value.hexMsgOutOfStock ? value.hexMsgOutOfStock : defaultColorBlack);
			} else {
				// handle error
				console.error('Error:', metafields);
			}
			setIsLoading(false);
		} catch (err) {
			console.error('Catch Error:', err);
			let errData = await err.json();
			console.error('message', errData);
			setIsLoading(false);
		}
	}

	useEffect(() => {
		init();
	}, []);

	const getSaveData = () => {
		let data = {};
		let value = {};
		data.namespace = namespace;
		data.key = key;
		value.showInstockFlg = showInstockFlg;
		value.iconTypeInstock = iconTypeInstock;
		value.hexIconInstock = hexIconInstock;
		value.msgInstock = msgInstock;
		value.hexMsgInstock = hexMsgInstock;

		value.showLowInventoryFlg = showLowInventoryFlg;
		value.iconTypeLowInventory = iconTypeLowInventory;
		value.hexIconLowInventory = hexIconLowInventory;
		value.rangeLowInventory = rangeLowInventory;
		value.msgLowInventory = msgLowInventory;
		value.hexMsgLowInventory = hexMsgLowInventory;

		value.showPreorderFlg = showPreorderFlg;
		value.iconTypePreorder = iconTypePreorder;
		value.hexIconPreorder = hexIconPreorder;
		value.msgPreorder = msgPreorder;
		value.hexMsgPreorder = hexMsgPreorder;

		value.showOutOfStockFlg = showOutOfStockFlg;
		value.iconTypeOutOfStock = iconTypeOutOfStock;
		value.hexIconOutOfStock = hexIconOutOfStock;
		value.msgOutOfStock = msgOutOfStock;
		value.hexMsgOutOfStock = hexMsgOutOfStock;

		data.value = value;
		return data;
	};

	const callMetafieldVisiblities = async () => {
		let data = {};
		data.namespace = apiParam.metafields.namespace;

		let response = await fetch(apiPath.metafieldStorefrontVisibilities, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			const res_data = await response.json();
			const return_data = res_data.body?.data?.metafieldStorefrontVisibilities?.nodes;
			console.log('callMetafieldVisiblities success', response);
			console.log('callMetafieldVisiblities return_data', return_data);
			return return_data ?? [];
		} else {
			console.error('callMetafieldVisiblities error', response);
			return null;
		}
	};

	const callMetafieldVisibleCreate = async () => {
		let data = {};
		data.namespace = apiParam.metafields.namespace;
		data.key = apiParam.metafields.key;
		data.ownerType = ownerType.shop;
		let response = await fetch(apiPath.metafieldStorefrontVisibilityCreate, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		return response;
	};

	const isInvalidHexInputs = () => {
		if (!isValidHex(hexIconInstock)
			|| !isValidHex(hexMsgInstock)
			|| !isValidHex(hexIconLowInventory)
			|| !isValidHex(hexMsgLowInventory)
			|| !isValidHex(hexIconPreorder)
			|| !isValidHex(hexMsgPreorder)
			|| !isValidHex(hexIconOutOfStock)
			|| !isValidHex(hexMsgOutOfStock)
		) {
			return true;
		}
		return false;
	}

	const handleSubmitSave = async () => {
		if (isInvalidHexInputs()) {
			setToastProps({
				content: t("statusSetting.invaildHex"),
				error: true,
			});
			return;
		}
		setIsLoading(true);
		let data = getSaveData();
		// call the api to save
		const response = await fetch(metafieldsApiPath, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			setToastProps({
				content: t("statusSetting.saved"),
			});
		} else {
			setToastProps({
				content: t("statusSetting.FailedSave"),
				error: true,
			});
		}
		// 
		// I didnt need to call metafieldVisibility api...
		// 
		// let res_meta_visibilities = null;
		// // metafield
		// if (response.ok) {
		// 	console.log(`Response ${metafieldsApiPath}:`, response);
		// 	res_meta_visibilities = await callMetafieldVisiblities();
		// } else {
		// 	console.error(`Error: ${metafieldsApiPath}`, response);
		// 	setToastProps({
		// 		content: 'Failed save',
		// 		error: true,
		// 	});
		// }

		// let res_meta_visibility_create = null;
		// // metafield storefront visibilities
		// if (res_meta_visibilities !== null && res_meta_visibilities.length > 0) {
		// 	setToastProps({
		// 		content: 'Setting saved!',
		// 	});
		// } else if (res_meta_visibilities !== null && res_meta_visibilities.length === 0) {
		// 	res_meta_visibility_create = await callMetafieldVisibleCreate();
		// }

		// if (res_meta_visibility_create?.ok) {
		// 	setToastProps({
		// 		content: 'Setting saved!',
		// 	});
		// 	console.log('res_meta_visibility_create', res_meta_visibility_create);
		// } else if (res_meta_visibility_create !== null) {
		// 	console.error(`Error: ${apiPath.metafieldStorefrontVisibilityCreate}`, res_meta_visibility_create);
		// 	setToastProps({
		// 		content: 'Failed save in process',
		// 		error: true,
		// 	});
		// }
		setIsLoading(false);
	};

	// render child colour picker
	const renderChildrenColorPickerInstock = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={value => handleHsbChange(value, setColorIconInstock, setHexIconInstock)}
					color={colorIconInstock}
					setHex={value => handleHexChange(value, setColorIconInstock, setHexIconInstock)}
					hex={hexIconInstock}
					disabled={isLoading}
				/>
			),
		[
			setColorIconInstock,
			colorIconInstock,
			setHexIconInstock,
			hexIconInstock,
			isLoading
		],
	);
	const renderChildrenColorPickerLowInventory = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={value => handleHsbChange(value, setColorIconLowInventory, setHexIconLowInventory)}
					color={colorIconLowInventory}
					setHex={value => handleHexChange(value, setColorIconLowInventory, setHexIconLowInventory)}
					hex={hexIconLowInventory}
					disabled={isLoading}
				/>
			),
		[
			setColorIconLowInventory,
			colorIconLowInventory,
			setHexIconLowInventory,
			hexIconLowInventory,
			isLoading
		],
	);
	const renderChildrenColorPickerPreorder = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={value => handleHsbChange(value, setColorIconPreorder, setHexIconPreorder)}
					color={colorIconPreorder}
					setHex={value => handleHexChange(value, setColorIconPreorder, setHexIconPreorder)}
					hex={hexIconPreorder}
					disabled={isLoading}
				/>
			),
		[
			setColorIconPreorder,
			colorIconPreorder,
			setHexIconPreorder,
			hexIconPreorder,
			isLoading
		],
	);
	const renderChildrenColorPickerOutOfStock = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={value => handleHsbChange(value, setColorIconOutOfStock, setHexIconOutOfStock)}
					color={colorIconOutOfStock}
					setHex={value => handleHexChange(value, setColorIconOutOfStock, setHexIconOutOfStock)}
					hex={hexIconOutOfStock}
					disabled={isLoading}
				/>
			),
		[
			setColorIconOutOfStock,
			colorIconOutOfStock,
			setHexIconOutOfStock,
			hexIconOutOfStock,
			isLoading
		],
	);

	return (
		<>
			{toastMarkup}
			<Page
				backAction={{ content: 'App Top', url: '/' }}
				divider
				title={t("NavigationMenu.inventoryStatusSetting")}
				primaryAction={{
					content: t("statusSetting.saveButton"),
					onAction: handleSubmitSave,
					disabled: isLoading,
					loading: isLoading,
				}}
			>
				<VerticalStack gap={{ xs: "8", sm: "4" }}>
					<HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
						<Box
							as="section"
							paddingInlineStart={{ xs: 4, sm: 0 }}
							paddingInlineEnd={{ xs: 4, sm: 0 }}
						>
							<VerticalStack gap="4">
								<Text as="h3" variant="headingMd">
									{t("statusSetting.inStock.title")}
								</Text>
								<Text as="p" variant="bodyMd">

								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label={t("statusSetting.showFlgTitle")}
									checked={showInstockFlg}
									onChange={setShowInstockFlg}
									disabled={isLoading}
								/>
								<Collapsible open={showInstockFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title={t("statusSetting.iconTitle")}
												choices={[
													{ label: t("statusSetting.iconShow"), value: 'icon', renderChildren: renderChildrenColorPickerInstock, },
													{ label: t("statusSetting.iconHide"), value: 'none' },
												]}
												allowMultiple={false}
												selected={iconTypeInstock}
												onChange={setIconTypeInstock}
												disabled={isLoading}
											/>
											<TextField
												label={t("statusSetting.messageTitle")}
												value={msgInstock}
												onChange={setMsgInstock}
												placeholder={t("statusSetting.inStock.messagePlaceholder")}
												disabled={isLoading}
											/>
											<CustomColorPicker
												title={t("statusSetting.textColor")}
												setColor={useCallback(value => handleHsbChange(value, setColorMsgInstock, setHexMsgInstock), [])}
												color={colorMsgInstock}
												setHex={useCallback(value => handleHexChange(value, setColorMsgInstock, setHexMsgInstock), [])}
												hex={hexMsgInstock}
												disabled={isLoading}
											/>
										</VerticalStack>
									</div>
								</Collapsible>
							</VerticalStack>
						</AlphaCard>
					</HorizontalGrid>

					<HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
						<Box
							as="section"
							paddingInlineStart={{ xs: 4, sm: 0 }}
							paddingInlineEnd={{ xs: 4, sm: 0 }}
						>
							<VerticalStack gap="4">
								<Text as="h3" variant="headingMd">
									{t("statusSetting.lowStock.title")}
								</Text>
								<Text as="p" variant="bodyMd">

								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label={t("statusSetting.showFlgTitle")}
									checked={showLowInventoryFlg}
									onChange={setShowLowInventoryFlg}
									disabled={isLoading}
								/>
								<Collapsible open={showLowInventoryFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title={t("statusSetting.iconTitle")}
												choices={[
													{ label: t("statusSetting.iconShow"), value: 'icon', renderChildren: renderChildrenColorPickerLowInventory, },
													{ label: t("statusSetting.iconHide"), value: 'none' },
												]}
												allowMultiple={false}
												selected={iconTypeLowInventory}
												onChange={setIconTypeLowInventory}
												disabled={isLoading}
											/>
											<RangeSlider
												output
												label={t("statusSetting.lowStock.rangeTitle")}
												min={1}
												max={100}
												value={rangeLowInventory}
												onChange={setRangeLowInventory}
												// prefix={<p>Hue</p>}
												suffix={
													<p
														style={{
															minWidth: '24px',
															textAlign: 'right',
														}}
													>
														{rangeLowInventory}
													</p>
												}
												disabled={isLoading}
											/>
											<TextField
												label={t("statusSetting.messageTitle")}
												value={msgLowInventory}
												onChange={setMsgLowInventory}
												placeholder={t("statusSetting.lowStock.messagePlaceholder")}
												helpText={t("statusSetting.lowStock.messageHelp")}
												disabled={isLoading}
											/>
											<CustomColorPicker
												title={t("statusSetting.textColor")}
												setColor={useCallback(value => handleHsbChange(value, setColorMsgLowInventory, setHexMsgLowInventory), [])}
												color={colorMsgLowInventory}
												setHex={useCallback(value => handleHexChange(value, setColorMsgLowInventory, setHexMsgLowInventory), [])}
												hex={hexMsgLowInventory}
												disabled={isLoading}
											/>
										</VerticalStack>
									</div>
								</Collapsible>
							</VerticalStack>
						</AlphaCard>
					</HorizontalGrid>

					<HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
						<Box
							as="section"
							paddingInlineStart={{ xs: 4, sm: 0 }}
							paddingInlineEnd={{ xs: 4, sm: 0 }}
						>
							<VerticalStack gap="4">
								<Text as="h3" variant="headingMd">
									{t("statusSetting.preOrder.title")}
								</Text>
								<Text as="p" variant="bodyMd">
									{t("statusSetting.preOrder.description")}
								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label={t("statusSetting.showFlgTitle")}
									checked={showPreorderFlg}
									onChange={setShowPreorderFlg}
									disabled={isLoading}
								/>
								<Collapsible open={showPreorderFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title={t("statusSetting.iconTitle")}
												choices={[
													{ label: t("statusSetting.iconShow"), value: 'icon', renderChildren: renderChildrenColorPickerPreorder, },
													{ label: t("statusSetting.iconHide"), value: 'none' },
												]}
												allowMultiple={false}
												selected={iconTypePreorder}
												onChange={setIconTypePreorder}
												disabled={isLoading}
											/>
											<TextField
												label={t("statusSetting.messageTitle")}
												value={msgPreorder}
												onChange={setMsgPreorder}
												placeholder={t("statusSetting.preOrder.messagePlaceholder")}
												disabled={isLoading}
											/>
											<CustomColorPicker
												title={t("statusSetting.textColor")}
												setColor={useCallback(value => handleHsbChange(value, setColorMsgPreorder, setHexMsgPreorder), [])}
												color={colorMsgPreorder}
												setHex={useCallback(value => handleHexChange(value, setColorMsgPreorder, setHexMsgPreorder), [])}
												hex={hexMsgPreorder}
												disabled={isLoading}
											/>
										</VerticalStack>
									</div>
								</Collapsible>
							</VerticalStack>
						</AlphaCard>
					</HorizontalGrid>

					<HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
						<Box
							as="section"
							paddingInlineStart={{ xs: 4, sm: 0 }}
							paddingInlineEnd={{ xs: 4, sm: 0 }}
						>
							<VerticalStack gap="4">
								<Text as="h3" variant="headingMd">
									{t("statusSetting.outOfStock.title")}
								</Text>
								<Text as="p" variant="bodyMd">

								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label={t("statusSetting.showFlgTitle")}
									checked={showOutOfStockFlg}
									onChange={setShowOutOfStockFlg}
									disabled={isLoading}
								/>
								<Collapsible open={showOutOfStockFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title={t("statusSetting.iconTitle")}
												choices={[
													{ label: t("statusSetting.iconShow"), value: 'icon', renderChildren: renderChildrenColorPickerOutOfStock, },
													{ label: t("statusSetting.iconHide"), value: 'none' },
												]}
												allowMultiple={false}
												selected={iconTypeOutOfStock}
												onChange={setIconTypeOutOfStock}
												disabled={isLoading}
											/>
											<TextField
												label={t("statusSetting.messageTitle")}
												value={msgOutOfStock}
												onChange={setMsgOutOfStock}
												placeholder={t("statusSetting.outOfStock.messagePlaceholder")}
												disabled={isLoading}
											/>
											<CustomColorPicker
												title={t("statusSetting.textColor")}
												setColor={useCallback(value => handleHsbChange(value, setColorMsgOutOfStock, setHexMsgOutOfStock), [])}
												color={colorMsgOutOfStock}
												setHex={useCallback(value => handleHexChange(value, setColorMsgOutOfStock, setHexMsgOutOfStock), [])}
												hex={hexMsgOutOfStock}
												disabled={isLoading}
											/>
										</VerticalStack>
									</div>
								</Collapsible>
							</VerticalStack>
						</AlphaCard>
					</HorizontalGrid>
					<HorizontalStack align="end">
						<div style={{ margin: 'var(--p-space-5) 0', }}>
							<Button
								primary
								onClick={handleSubmitSave}
								disabled={isLoading}
								loading={isLoading}
							>{t("statusSetting.saveButton")}</Button>
						</div>
					</HorizontalStack>
				</VerticalStack>
			</Page>
		</>
	);
}

export default InventoryStatusSettings;