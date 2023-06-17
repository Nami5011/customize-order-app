import { Card, Page, Layout, TextContainer, FormLayout, TextField, Button, Checkbox, Collapsible, ChoiceList, ColorPicker } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useCallback } from 'react';

function InventoryStatusSettings() {
	const [instockStatusMessage, setInstockStatusMessage] = useState('');
	const [checkedInstock, setCheckedInStock] = useState(true);
	const [selectedIconType, setSelectedIconType] = useState(['icon']);
	const [instockIconColor, setInstockIconColor] = useState({
		hue: 120,
		brightness: 1,
		saturation: 1,
	});
	const { t } = useTranslation();

	// const handleChange = useCallback(() => setSelectedIconType(value), []);
	// useEffect(() => {
	// }, []);

	// const handleInputChange = (value) => {
	// 	setInstockStatusMessage(value);
	// };
	const handleSubmit = async () => {
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
										selected={selectedIconType}
										onChange={setSelectedIconType}
									/>
									<Collapsible open={selectedIconType == 'icon'}>
										<ColorPicker onChange={setInstockIconColor} color={instockIconColor} />
									</Collapsible>
									<TextField
										label="In Stock Status Message"
										value={instockStatusMessage}
										onChange={setInstockStatusMessage}
									/>
								</Collapsible>

								<Button onClick={handleSubmit}>Save</Button>
							</FormLayout>
						</TextContainer>
					</Card>
				</Layout.Section>
			</Layout>
		</Page>
	);
}

export default InventoryStatusSettings;