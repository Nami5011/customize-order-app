import { Card, Page, Layout, TextContainer, FormLayout, TextField, Button, Checkbox, Collapsible, ChoiceList, ColorPicker } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

function InventoryStatusSettings() {
	const fetch = useAuthenticatedFetch();
	const [checkedInstock, setCheckedInStock] = useState(true);
	const [instockIconType, setInstockIconType] = useState(['icon']);
	const [instockIconColor, setInstockIconColor] = useState({
		hue: 120,
		brightness: 1,
		saturation: 1,
	});
	const [instockStatusMessage, setInstockStatusMessage] = useState('');
	const handleSubmitSave = async () => {
		let data = {};
		let value = {};
		data.namespace = "customize-order-app";
		data.key = "inventoryStatusSettings";
		value.showInstockFlg = checkedInstock;
		value.instockIconType = instockIconType;
		value.instockIconColor = instockIconColor;
		value.instockStatusMessage = instockStatusMessage;
		data.value = JSON.stringify(value);

		// call the api here
		const response = await fetch('/api/metafields', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			// handle error
			console.error('Error:', response);
			console.error('statusText:', response.statusText);
		} else {
			console.log('response:', response);
		}
	};

	return (
		<Page title="Inventory Status Settings">
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<TextContainer>
							<FormLayout>
								<Checkbox
									label="Show In Stock Status"
									checked={checkedInstock}
									onChange={setCheckedInStock}
								/>
								<Collapsible open={checkedInstock}>
									<ChoiceList
										title="In Stock Icon"
										choices={[
											{ label: 'Show', value: 'icon' },
											{ label: 'Hide', value: 'none' },
										]}
										allowMultiple={false}
										selected={instockIconType}
										onChange={setInstockIconType}
									/>
									<Collapsible open={instockIconType == 'icon'}>
										<ColorPicker onChange={setInstockIconColor} color={instockIconColor} />
									</Collapsible>
									<TextField
										label="In Stock Status Message"
										value={instockStatusMessage}
										onChange={setInstockStatusMessage}
									/>
								</Collapsible>

								<Button onClick={handleSubmitSave}>Save</Button>
							</FormLayout>
						</TextContainer>
					</Card>
				</Layout.Section>
			</Layout>
		</Page>
	);
}

export default InventoryStatusSettings;