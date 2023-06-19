import { VerticalStack, HorizontalGrid, Box, Page, Text, AlphaCard, TextField, Checkbox, Collapsible, ChoiceList, ColorPicker } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { apiPath, apiParam } from '../../common-variable';

function InventoryStatusSettings() {
	const fetch = useAuthenticatedFetch();
	const metafieldsApiPath = apiPath.metafields;
	const namespace = apiParam.metafields.namespace;
	const key = apiParam.metafields.key;
	// initialize
	const [checkedInstock, setCheckedInStock] = useState(false);
	const [instockIconType, setInstockIconType] = useState(['icon']);
	const defaultColor = {
		hue: 120,
		brightness: 1,
		saturation: 1,
	};
	const [instockIconColor, setInstockIconColor] = useState(defaultColor);
	const [instockStatusMessage, setInstockStatusMessage] = useState('');

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
					return;
				}
				console.log('response data:', data);
				// set the data in form
				setCheckedInStock(value.showInstockFlg ?? false);
				setInstockIconType(value.instockIconType ?? ['icon']);
				setInstockIconColor(value.instockIconColor ?? defaultColor);
				setInstockStatusMessage(value.instockStatusMessage ?? '');
			} else {
				// handle error
				console.error('Error:', metafields);
			}
		} catch (err) {
			console.error('Catch Error:', err);

		}
	}

	useEffect(() => {
		init();
	}, []);

	const handleSubmitSave = async () => {
		let data = {};
		let value = {};
		data.namespace = namespace;
		data.key = key;
		value.showInstockFlg = checkedInstock;
		value.instockIconType = instockIconType;
		value.instockIconColor = instockIconColor;
		value.instockStatusMessage = instockStatusMessage;
		data.value = value;

		// call the api to save
		const response = await fetch(metafieldsApiPath, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			console.log('response:');
			console.log('response:', response);
		} else {
			// handle error
			console.error('Error:', response);
			console.error('statusText:', response.statusText);
		}
	};

	// render child colour picker
	const renderChildrenColorPicker = useCallback(
		(isSelected) =>
			isSelected && (
				<>
					<Text as="p">
						Pick The Icon Colour
					</Text>
					<ColorPicker onChange={setInstockIconColor} color={instockIconColor} />
				</>
			),
		[setInstockIconColor, instockIconColor],
	);

	return (
		<Page
			divider
			title={"Inventory Status Settings"}
			primaryAction={{
				content: "Save",
				onAction: handleSubmitSave,
				disabled: false,
				loading: false,
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
								label="Show In Stock Status"
								checked={checkedInstock}
								onChange={setCheckedInStock}
							/>
							<Collapsible open={checkedInstock}>
								<div style={{ margin: '0 var(--p-space-5)', }}>
									<ChoiceList
										title="In Stock Icon"
										choices={[
											{ label: 'Show', value: 'icon', renderChildren: renderChildrenColorPicker, },
											{ label: 'Hide', value: 'none' },
										]}
										allowMultiple={false}
										selected={instockIconType}
										onChange={setInstockIconType}
									/>
									<TextField
										label="In Stock Status Message"
										value={instockStatusMessage}
										onChange={setInstockStatusMessage}
									/>
								</div>
							</Collapsible>
						</VerticalStack>
					</AlphaCard>
				</HorizontalGrid>
				{/* <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
					<Box
						as="section"
						paddingInlineStart={{ xs: 4, sm: 0 }}
						paddingInlineEnd={{ xs: 4, sm: 0 }}
					>
						<VerticalStack gap="4">
							<Text as="h3" variant="headingMd">
								Dimensions
							</Text>
							<Text as="p" variant="bodyMd">
								Interjambs are the rounded protruding bits of your puzzlie piece
							</Text>
						</VerticalStack>
					</Box>
					<AlphaCard roundedAbove="sm">
						<VerticalStack gap="4">
							<TextField label="Horizontal" />
							<TextField label="Interjamb ratio" />
						</VerticalStack>
					</AlphaCard>
				</HorizontalGrid> */}
			</VerticalStack>
		</Page>
	);
}

export default InventoryStatusSettings;