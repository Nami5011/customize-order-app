import {
	Page,
	Text,
	AlphaCard,
	Link,
} from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useState, useEffect, useCallback } from 'react';
export default function HomePage() {
	const { t } = useTranslation();
	const fetch = useAuthenticatedFetch();
	const [deliveryOptionUrl, setDeliveryOptionUrl] = useState('/');
	const fetchData = async () => {
		try {
			let navigationSettings = await fetch('/api/shop', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'navigationSettings',
				}),
			});
			console.log('navigationSettings', navigationSettings);
			if (navigationSettings.ok) {
				navigationSettings = await navigationSettings.json();
			}
			const deliveryOption = navigationSettings.find((setting) => setting.title === 'Shipping and delivery');
			console.log('deliveryOption', deliveryOption);
			let url = deliveryOption?.url ? deliveryOption?.url + '/customizations' : '/';
			setDeliveryOptionUrl(url);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<Page
			backAction={{ content: 'App Top', url: '/' }}
			divider
			title={t("NavigationMenu.deliveryOption")}
		>
			<div style={{ "marginBottom": '20px' }}>
				<Text as="h3" variant="headingMd">
					{t("deliveryOption.instructionTitle")}
				</Text>
				<AlphaCard roundedAbove="sm">
					<ol>
						<li>{t("deliveryOption.instructions.1-1")}<Link url="/cartMessage">{t("deliveryOption.instructions.1-2")}</Link>{t("deliveryOption.instructions.1-3")}.</li>
						<li>{t("deliveryOption.instructions.2-1")}<strong>{t("deliveryOption.instructions.2-2")}</strong>{t("deliveryOption.instructions.2-3")}<Link url={deliveryOptionUrl} external>{t("deliveryOption.instructions.2-4")}</Link>{t("deliveryOption.instructions.2-5")}.</li>
						<li>{t("deliveryOption.instructions.3-1")}<strong>{t("deliveryOption.instructions.3-2")}</strong>{t("deliveryOption.instructions.3-3")}.</li>
						<li>{t("deliveryOption.instructions.4-1")}<strong>{t("deliveryOption.instructions.4-2")}</strong>{t("deliveryOption.instructions.4-3")}.</li>
						<li>{t("deliveryOption.instructions.5")}.</li>
						<li>{t("deliveryOption.instructions.6")}.</li>
					</ol>
				</AlphaCard>
			</div>
			<div style={{ "marginBottom": '20px' }}>
				{t("contactUs")}
			</div>
		</Page>
	);
}
