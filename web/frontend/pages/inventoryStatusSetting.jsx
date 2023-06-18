import { LegacyCard, Page, Layout, TextContainer, FormLayout, TextField, Button, Checkbox, Collapsible, ChoiceList, ColorPicker } from "@shopify/polaris";
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
	// const [metafieldId, setMetafieldId] = useState('');
	const [checkedInstock, setCheckedInStock] = useState(true);
	const [instockIconType, setInstockIconType] = useState(['icon']);
	const [instockIconColor, setInstockIconColor] = useState({
		hue: 120,
		brightness: 1,
		saturation: 1,
	});
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
				// setMetafieldId(String(data.id));
				// set the data in form
				setCheckedInStock(value.showInstockFlg);
				setInstockIconType(value.instockIconType);
				setInstockIconColor(value.instockIconColor);
				setInstockStatusMessage(value.instockStatusMessage);
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

		// call the api here
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

	return (
		<Page title="Inventory Status Settings">
			<Layout>
				<Layout.Section>
					<LegacyCard sectioned>
						<TextContainer>
							<FormLayout>
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
									</div>

								</Collapsible>

								<Button primary onClick={handleSubmitSave}>Save</Button>
							</FormLayout>
						</TextContainer>
					</LegacyCard>
				</Layout.Section>
			</Layout>
		</Page>
	);
}

export default InventoryStatusSettings;