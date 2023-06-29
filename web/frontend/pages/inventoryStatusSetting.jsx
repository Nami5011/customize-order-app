import { VerticalStack, HorizontalGrid, Box, Page, Text, AlphaCard, TextField, Checkbox, Collapsible, ChoiceList, ColorPicker, RangeSlider, HorizontalStack, Button } from "@shopify/polaris";
import { TitleBar, Toast } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { apiPath, apiParam, ownerType } from '../../common-variable';

function InventoryStatusSettings() {
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
	// initialize In stock status
	const [showInstockFlg, setShowInstockFlg] = useState(false);
	const [instockIconType, setInstockIconType] = useState(['icon']);
	const [colorInstockIcon, setColorInstockIcon] = useState(defaultColorGreen);
	const [msgInstock, setMsgInstock] = useState('');
	// initialize Low Invntory status
	const [showLowInventoryFlg, setShowLowInventoryFlg] = useState(false);
	const [lowInventoryIconType, setLowInventoryType] = useState(['icon']);
	const [colorLowInventoryIcon, setColorLowInventoryIcon] = useState(defaultColorYellow);
	const [rangeLowInventory, setRangeLowInventory] = useState(10);
	const [msgLowInventory, setMsgLowInventory] = useState('');
	// initialize pre order status
	const [showPreorderFlg, setShowPreorderFlg] = useState(false);
	const [preorderIconType, setPreorderIconType] = useState(['icon']);
	const [colorPreorderIcon, setColorPreorderIcon] = useState(defaultColorYellow);
	const [msgPreorder, setMsgPreorder] = useState('');
	// initialize out of stock status
	const [showOutOfStockFlg, setShowOutOfStockFlg] = useState(false);
	const [outOfStockIconType, setOutOfStockIconType] = useState(['icon']);
	const [colorOutOfStockIcon, setColorOutOfStockIcon] = useState(defaultColorGray);
	const [msgOutOfStock, setMsgOutOfStock] = useState('');

	const init = async () => {
		try {
			console.log('fetch: ' + metafieldsApiPath + '?namespace=' + namespace + '&key=' + key);
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

				setShowLowInventoryFlg(value.showLowInventoryFlg ?? false);
				setLowInventoryType(value.lowInventoryIconType ?? ['icon']);
				setColorLowInventoryIcon(value.colorLowInventoryIcon ?? defaultColorYellow);
				setRangeLowInventory(value.rangeLowInventory ?? 10);
				setMsgLowInventory(value.msgLowInventory ?? '');

				setShowPreorderFlg(value.showPreorderFlg ?? false);
				setPreorderIconType(value.preorderIconType ?? ['icon']);
				setColorPreorderIcon(value.colorPreorderIcon ?? defaultColorYellow);
				setMsgPreorder(value.msgPreorder ?? '');

				setShowOutOfStockFlg(value.showOutOfStockFlg ?? false);
				setOutOfStockIconType(value.outOfStockIconType ?? ['icon']);
				setColorOutOfStockIcon(value.colorOutOfStockIcon ?? defaultColorGray);
				setMsgOutOfStock(value.msgOutOfStock ?? '');
			} else {
				// handle error
				console.error('Error:', metafields);
			}
			setIsLoading(false);
		} catch (err) {
			console.error('Catch Error:', err);
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
		value.msgInstock = msgInstock;

		value.showLowInventoryFlg = showLowInventoryFlg;
		value.lowInventoryIconType = lowInventoryIconType;
		value.colorLowInventoryIcon = colorLowInventoryIcon;
		value.rangeLowInventory = rangeLowInventory;
		value.msgLowInventory = msgLowInventory;

		value.showPreorderFlg = showPreorderFlg;
		value.preorderIconType = preorderIconType;
		value.colorPreorderIcon = colorPreorderIcon;
		value.msgPreorder = msgPreorder;

		value.showOutOfStockFlg = showOutOfStockFlg;
		value.outOfStockIconType = outOfStockIconType;
		value.colorOutOfStockIcon = colorOutOfStockIcon;
		value.msgOutOfStock = msgOutOfStock;

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
		let res_meta_visibilities = null;
		// metafield
		if (response.ok) {
			console.log(`Response ${metafieldsApiPath}:`, response);
			res_meta_visibilities = await callMetafieldVisiblities();
		} else {
			console.error(`Error: ${metafieldsApiPath}`, response);
			setToastProps({
				content: 'Failed save',
				error: true,
			});
		}

		let res_meta_visibility_create = null;
		// metafield storefront visibilities
		if (res_meta_visibilities !== null && res_meta_visibilities.length > 0) {
			setToastProps({
				content: 'Setting saved!',
			});
		} else if (res_meta_visibilities !== null && res_meta_visibilities.length === 0) {
			res_meta_visibility_create = await callMetafieldVisibleCreate();
		}

		if (res_meta_visibility_create?.ok) {
			setToastProps({
				content: 'Setting saved!',
			});
			console.log('res_meta_visibility_create', res_meta_visibility_create);
		} else if (res_meta_visibility_create !== null) {
			console.error(`Error: ${apiPath.metafieldStorefrontVisibilityCreate}`, res_meta_visibility_create);
			setToastProps({
				content: 'Failed save in process',
				error: true,
			});
		}
		setIsLoading(false);
	};

	// render child colour picker
	const renderChildrenColorPickerInstock = useCallback(
		(isSelected) =>
			isSelected && (
				<>
					<Text as="p">
						Pick The Icon Colour
					</Text>
					<ColorPicker onChange={setColorInstockIcon} color={colorInstockIcon} />
				</>
			),
		[setColorInstockIcon, colorInstockIcon],
	);
	const renderChildrenColorPickerLowInventory = useCallback(
		(isSelected) =>
			isSelected && (
				<>
					<Text as="p">
						Pick The Icon Colour
					</Text>
					<ColorPicker onChange={setColorLowInventoryIcon} color={colorLowInventoryIcon} />
				</>
			),
		[setColorLowInventoryIcon, colorLowInventoryIcon],
	);
	const renderChildrenColorPickerPreorder = useCallback(
		(isSelected) =>
			isSelected && (
				<>
					<Text as="p">
						Pick The Icon Colour
					</Text>
					<ColorPicker onChange={setColorPreorderIcon} color={colorPreorderIcon} />
				</>
			),
		[setColorPreorderIcon, colorPreorderIcon],
	);
	const renderChildrenColorPickerOutOfStock = useCallback(
		(isSelected) =>
			isSelected && (
				<>
					<Text as="p">
						Pick The Icon Colour
					</Text>
					<ColorPicker onChange={setColorOutOfStockIcon} color={colorOutOfStockIcon} />
				</>
			),
		[setColorOutOfStockIcon, colorOutOfStockIcon],
	);

	return (
		<>
			{toastMarkup}
			<Page
				backAction={{ content: 'App Top', url: '/' }}
				divider
				title={"Inventory Status Settings"}
				primaryAction={{
					content: "Save setting",
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
									In Stock Status
								</Text>
								<Text as="p" variant="bodyMd">
									In Stock Status's discription
								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label="Show Status"
									checked={showInstockFlg}
									onChange={setShowInstockFlg}
								/>
								<Collapsible open={showInstockFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title="Status Icon"
												choices={[
													{ label: 'Show', value: 'icon', renderChildren: renderChildrenColorPickerInstock, },
													{ label: 'Hide', value: 'none' },
												]}
												allowMultiple={false}
												selected={instockIconType}
												onChange={setInstockIconType}
											/>
											<TextField
												label="Status Message"
												value={msgInstock}
												onChange={setMsgInstock}
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
									Low Inventory Status
								</Text>
								<Text as="p" variant="bodyMd">
									Low Inventory's discription
								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label="Show Status"
									checked={showLowInventoryFlg}
									onChange={setShowLowInventoryFlg}
								/>
								<Collapsible open={showLowInventoryFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title="Status Icon"
												choices={[
													{ label: 'Show', value: 'icon', renderChildren: renderChildrenColorPickerLowInventory, },
													{ label: 'Hide', value: 'none' },
												]}
												allowMultiple={false}
												selected={lowInventoryIconType}
												onChange={setLowInventoryType}
											/>
											<RangeSlider
												output
												label="Low inventory threshold"
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
											/>
											<TextField
												label="Status Message"
												value={msgLowInventory}
												onChange={setMsgLowInventory}
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
									Pre Order Status
								</Text>
								<Text as="p" variant="bodyMd">
									Pre Order Status's discription
								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label="Show Status"
									checked={showPreorderFlg}
									onChange={setShowPreorderFlg}
								/>
								<Collapsible open={showPreorderFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title="Status Icon"
												choices={[
													{ label: 'Show', value: 'icon', renderChildren: renderChildrenColorPickerPreorder, },
													{ label: 'Hide', value: 'none' },
												]}
												allowMultiple={false}
												selected={preorderIconType}
												onChange={setPreorderIconType}
											/>
											<TextField
												label="Status Message"
												value={msgPreorder}
												onChange={setMsgPreorder}
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
									Out Of Stock Status
								</Text>
								<Text as="p" variant="bodyMd">
									Out Of Stock Status's discription
								</Text>
							</VerticalStack>
						</Box>
						<AlphaCard roundedAbove="sm">
							<VerticalStack gap="4">
								<Checkbox
									label="Show Status"
									checked={showOutOfStockFlg}
									onChange={setShowOutOfStockFlg}
								/>
								<Collapsible open={showOutOfStockFlg}>
									<div style={{ margin: '0 var(--p-space-5)', }}>
										<VerticalStack gap="4">
											<ChoiceList
												title="Status Icon"
												choices={[
													{ label: 'Show', value: 'icon', renderChildren: renderChildrenColorPickerOutOfStock, },
													{ label: 'Hide', value: 'none' },
												]}
												allowMultiple={false}
												selected={outOfStockIconType}
												onChange={setOutOfStockIconType}
											/>
											<TextField
												label="Status Message"
												value={msgOutOfStock}
												onChange={setMsgOutOfStock}
											/>
										</VerticalStack>
									</div>
								</Collapsible>
							</VerticalStack>
						</AlphaCard>
					</HorizontalGrid>
					<HorizontalStack align="end">
						<Button
							primary
							onClick={handleSubmitSave}
							disabled={isLoading}
							loading={isLoading}
						>Save setting</Button>
					</HorizontalStack>
				</VerticalStack>
			</Page>
		</>
	);
}

export default InventoryStatusSettings;