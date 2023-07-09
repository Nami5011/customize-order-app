import { VerticalStack, HorizontalGrid, Box, Page, Text, AlphaCard, TextField, Checkbox, Collapsible, ChoiceList, ColorPicker, RangeSlider, HorizontalStack, Button } from "@shopify/polaris";
import { TitleBar, Toast } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { apiPath, apiParam, ownerType } from '../../common-variable';
import { CustomColorPicker } from "../components";
import { hsbToRgb } from "../utils/colorConvert";

function InventoryStatusSettings() {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);

	const emptyToastProps = { content: null };
	const [toastProps, setToastProps] = useState(emptyToastProps);
	const toastMarkup = toastProps.content && (
		<Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
	);

	const fetch = useAuthenticatedFetch();
	const metafieldsApiPath = apiPath.metafields;
	const namespace = apiParam.metafields.namespace;
	const key = apiParam.metafields.key;
	const defaultColorGreen = {
		hue: 120,
		brightness: 1,
		saturation: 1,
	};
	const defaultColorYellow = {
		hue: 60,
		brightness: 1,
		saturation: 1,
	};
	const defaultColorGray = {
		hue: 240,
		brightness: 0.5,
		saturation: 0,
	};
	const defaultColorBlack = {
		hue: 240,
		brightness: 0,
		saturation: 0,
	};
	// initialize In stock status
	const [showInstockFlg, setShowInstockFlg] = useState(false);
	const [instockIconType, setInstockIconType] = useState(['none']);
	const [colorInstockIcon, setColorInstockIcon] = useState(defaultColorGreen);
	const [msgInstock, setMsgInstock] = useState('');
	const [msgColorInstock, setMsgColorInstock] = useState(defaultColorBlack);
	// initialize Low Invntory status
	const [showLowInventoryFlg, setShowLowInventoryFlg] = useState(false);
	const [lowInventoryIconType, setLowInventoryType] = useState(['none']);
	const [colorLowInventoryIcon, setColorLowInventoryIcon] = useState(defaultColorYellow);
	const [rangeLowInventory, setRangeLowInventory] = useState(10);
	const [msgLowInventory, setMsgLowInventory] = useState('');
	const [msgColorLowInventory, setMsgColorLowInventory] = useState(defaultColorBlack);
	// initialize pre order status
	const [showPreorderFlg, setShowPreorderFlg] = useState(false);
	const [preorderIconType, setPreorderIconType] = useState(['none']);
	const [colorPreorderIcon, setColorPreorderIcon] = useState(defaultColorYellow);
	const [msgPreorder, setMsgPreorder] = useState('');
	const [msgColorPreorder, setMsgColorPreorder] = useState(defaultColorBlack);
	// initialize out of stock status
	const [showOutOfStockFlg, setShowOutOfStockFlg] = useState(false);
	const [outOfStockIconType, setOutOfStockIconType] = useState(['none']);
	const [colorOutOfStockIcon, setColorOutOfStockIcon] = useState(defaultColorGray);
	const [msgOutOfStock, setMsgOutOfStock] = useState('');
	const [msgColorOutOfStock, setMsgColorOutOfStock] = useState(defaultColorBlack);

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
				setInstockIconType(value.instockIconType ?? ['icon']);
				setColorInstockIcon(value.colorInstockIcon ?? defaultColorGreen);
				setMsgInstock(value.msgInstock ?? '');
				setMsgColorInstock(value.msgColorInstock ?? defaultColorBlack);

				setShowLowInventoryFlg(value.showLowInventoryFlg ?? false);
				setLowInventoryType(value.lowInventoryIconType ?? ['icon']);
				setColorLowInventoryIcon(value.colorLowInventoryIcon ?? defaultColorYellow);
				setRangeLowInventory(value.rangeLowInventory ?? 10);
				setMsgLowInventory(value.msgLowInventory ?? '');
				setMsgColorLowInventory(value.msgColorLowInventory ?? defaultColorBlack);

				setShowPreorderFlg(value.showPreorderFlg ?? false);
				setPreorderIconType(value.preorderIconType ?? ['icon']);
				setColorPreorderIcon(value.colorPreorderIcon ?? defaultColorYellow);
				setMsgPreorder(value.msgPreorder ?? '');
				setMsgColorPreorder(value.msgColorPreorder ?? defaultColorBlack);

				setShowOutOfStockFlg(value.showOutOfStockFlg ?? false);
				setOutOfStockIconType(value.outOfStockIconType ?? ['icon']);
				setColorOutOfStockIcon(value.colorOutOfStockIcon ?? defaultColorGray);
				setMsgOutOfStock(value.msgOutOfStock ?? '');
				setMsgColorOutOfStock(value.msgColorOutOfStock ?? defaultColorBlack);
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
		value.instockIconType = instockIconType;
		value.colorInstockIcon = colorInstockIcon;
		value.rgbColorInstockIcon = hsbToRgb(colorInstockIcon.hue, colorInstockIcon.saturation, colorInstockIcon.brightness);
		value.msgInstock = msgInstock;
		value.msgColorInstock = msgColorInstock;
		value.rgbMsgColorInstock = hsbToRgb(msgColorInstock.hue, msgColorInstock.saturation, msgColorInstock.brightness);

		value.showLowInventoryFlg = showLowInventoryFlg;
		value.lowInventoryIconType = lowInventoryIconType;
		value.colorLowInventoryIcon = colorLowInventoryIcon;
		value.rgbColorLowInventoryIcon = hsbToRgb(colorLowInventoryIcon.hue, colorLowInventoryIcon.saturation, colorLowInventoryIcon.brightness);
		value.rangeLowInventory = rangeLowInventory;
		value.msgLowInventory = msgLowInventory;
		value.msgColorLowInventory = msgColorLowInventory;
		value.rgbMsgColorLowInventory = hsbToRgb(msgColorLowInventory.hue, msgColorLowInventory.saturation, msgColorLowInventory.brightness);

		value.showPreorderFlg = showPreorderFlg;
		value.preorderIconType = preorderIconType;
		value.colorPreorderIcon = colorPreorderIcon;
		value.rgbColorPreorderIcon = hsbToRgb(colorPreorderIcon.hue, colorPreorderIcon.saturation, colorPreorderIcon.brightness);
		value.msgPreorder = msgPreorder;
		value.msgColorPreorder = msgColorPreorder;
		value.rgbMsgColorPreorder = hsbToRgb(msgColorPreorder.hue, msgColorPreorder.saturation, msgColorPreorder.brightness);

		value.showOutOfStockFlg = showOutOfStockFlg;
		value.outOfStockIconType = outOfStockIconType;
		value.colorOutOfStockIcon = colorOutOfStockIcon;
		value.rgbColorOutOfStockIcon = hsbToRgb(colorOutOfStockIcon.hue, colorOutOfStockIcon.saturation, colorOutOfStockIcon.brightness);
		value.msgOutOfStock = msgOutOfStock;
		value.msgColorOutOfStock = msgColorOutOfStock;
		value.rgbMsgColorOutOfStock = hsbToRgb(msgColorOutOfStock.hue, msgColorOutOfStock.saturation, msgColorOutOfStock.brightness);

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

	const handleSubmitSave = async () => {
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
					setColor={setColorInstockIcon}
					color={colorInstockIcon}
					disabled={isLoading}
				/>
			),
		[setColorInstockIcon, colorInstockIcon],
	);
	const renderChildrenColorPickerLowInventory = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={setColorLowInventoryIcon}
					color={colorLowInventoryIcon}
					disabled={isLoading}
				/>
			),
		[setColorLowInventoryIcon, colorLowInventoryIcon],
	);
	const renderChildrenColorPickerPreorder = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={setColorPreorderIcon}
					color={colorPreorderIcon}
					disabled={isLoading}
				/>
			),
		[setColorPreorderIcon, colorPreorderIcon],
	);
	const renderChildrenColorPickerOutOfStock = useCallback(
		(isSelected) =>
			isSelected && (
				<CustomColorPicker
					title={t("statusSetting.iconColorTitle")}
					setColor={setColorOutOfStockIcon}
					color={colorOutOfStockIcon}
					disabled={isLoading}
				/>
			),
		[setColorOutOfStockIcon, colorOutOfStockIcon],
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
												selected={instockIconType}
												onChange={setInstockIconType}
												disabled={isLoading}
											/>
											<TextField
												label={t("statusSetting.messageTitle")}
												value={msgInstock}
												onChange={setMsgInstock}
												placeholder={t("statusSetting.inStock.messagePlaceholder")}
												helpText={t("statusSetting.inStock.messageHelp")}
												disabled={isLoading}
											/>
											<CustomColorPicker
												title={t("statusSetting.textColor")}
												setColor={setMsgColorInstock}
												color={msgColorInstock}
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
												selected={lowInventoryIconType}
												onChange={setLowInventoryType}
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
												setColor={setMsgColorLowInventory}
												color={msgColorLowInventory}
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
												selected={preorderIconType}
												onChange={setPreorderIconType}
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
												setColor={setMsgColorPreorder}
												color={msgColorPreorder}
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
												selected={outOfStockIconType}
												onChange={setOutOfStockIconType}
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
												setColor={setMsgColorOutOfStock}
												color={msgColorOutOfStock}
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