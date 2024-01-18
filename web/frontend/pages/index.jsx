import {
	Card,
	Page,
	Layout,
	TextContainer,
	Image,
	Stack,
	Link,
	Text,
	HorizontalStack,
	Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useState, useEffect, useCallback } from 'react';
import { useAppBridge, Loading } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { Redirect } from '@shopify/app-bridge/actions';

export default function HomePage() {
	const { t } = useTranslation();
	const fetch = useAuthenticatedFetch();
	const app = useAppBridge();
	const redirect = Redirect.create(app);
	const [checkingSubscription, setCheckingSubscription] = useState(true);
	const appSubscriptionCheck = async () => {
		let activeSubscription;
		let returnUrl;
		try {
			let appInstallations = await fetch('/api/appSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'appInstallations',
				}),
			});
			// console.log('appInstallations', appInstallations);
			if (appInstallations.ok) {
				appInstallations = await appInstallations.json();
			}
			// console.log('appInstallations json', appInstallations);
			let subscriptions = appInstallations?.currentAppInstallation?.allSubscriptions?.nodes;
			if (subscriptions && subscriptions.length > 0) {
				activeSubscription = subscriptions.find((subscription) => subscription.name === 'Pre-order Light Plan with a 14 Day Trial' && subscription.status === 'ACTIVE');
			}
			returnUrl = appInstallations?.currentAppInstallation?.app?.launchUrl;
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		// console.log('activeSubscription', activeSubscription)
		// console.log('returnUrl', returnUrl)
		if (!activeSubscription && returnUrl) {
			try {
				let appSubscription = await fetch('/api/appSubscription', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						queryName: 'appSubscriptionCreate',
						returnUrl: returnUrl
					}),
				});
				console.log('appSubscription', appSubscription);
				if (appSubscription.ok) {
					appSubscription = await appSubscription.json();
				}
				console.log('appSubscription json', appSubscription);
				if (appSubscription?.confirmationUrl) {
					redirect.dispatch(Redirect.Action.REMOTE, appSubscription.confirmationUrl);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		setCheckingSubscription(false);
	};
	useEffect(() => {
		appSubscriptionCheck();
	}, []);

	if (checkingSubscription) {
		return <Loading />;
	}
	return (
		<Page narrowWidth>
			{/* <TitleBar title={t("HomePage.title")} primaryAction={null} /> */}
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<TextContainer spacing="loose">
							<Text as="h2" variant="headingMd">
								{t("CustomizeInventoryStatus.title")}
							</Text>
							<p>{t("CustomizeInventoryStatus.discription")}</p>
							<dl>
								<dt>{t("CustomizeInventoryStatus.continueSelling")}</dt>
							</dl>
							<dl>
								<dt>{t("CustomizeInventoryStatus.inventoryStatus")}</dt>
								{/* <HorizontalStack align="end"> */}
								<div style={{ margin: '10px', }}>
									<Button
										primary
										url="/inventoryStatusSetting"
									>{t("CustomizeInventoryStatus.inventoryStatusBtn")}</Button>
								</div>
								{/* </HorizontalStack> */}
							</dl>
							<dl>
								<dt>{t("CustomizeInventoryStatus.buyButton")}</dt>
								<div style={{ margin: '10px', }}>
									<Button
										primary
										url="/buyButton"
									>{t("CustomizeInventoryStatus.buyButtonBtn")}</Button>
								</div>
							</dl>
							<dl>
								<dt>{t("CustomizeInventoryStatus.cartMessage")}</dt>
								<div style={{ margin: '10px', }}>
									<Button
										primary
										url="/cartMessage"
									>{t("CustomizeInventoryStatus.cartMessageBtn")}</Button>
								</div>
							</dl>
							<dl>
								<dt>{t("CustomizeInventoryStatus.deliveryOption")}</dt>
								<div style={{ margin: '10px', }}>
									<Button
										primary
										url="/deliveryOption"
									>{t("CustomizeInventoryStatus.deliveryOptionBtn")}</Button>
								</div>
							</dl>
						</TextContainer>
					</Card>
					{/* <Card sectioned>
						<Stack
							wrap={false}
							spacing="extraTight"
							distribution="trailing"
							alignment="center"
						>
							<Stack.Item fill>
								<TextContainer spacing="loose">
									<Text as="h2" variant="headingMd">
										{t("HomePage.heading")}
									</Text>
									<p>
										<Trans
											i18nKey="HomePage.yourAppIsReadyToExplore"
											components={{
												PolarisLink: (
													<Link url="https://polaris.shopify.com/" external />
												),
												AdminApiLink: (
													<Link
														url="https://shopify.dev/api/admin-graphql"
														external
													/>
												),
												AppBridgeLink: (
													<Link
														url="https://shopify.dev/apps/tools/app-bridge"
														external
													/>
												),
											}}
										/>
									</p>
									<p>{t("HomePage.startPopulatingYourApp")}</p>
									<p>
										<Trans
											i18nKey="HomePage.learnMore"
											components={{
												ShopifyTutorialLink: (
													<Link
														url="https://shopify.dev/apps/getting-started/add-functionality"
														external
													/>
												),
											}}
										/>
									</p>
								</TextContainer>
							</Stack.Item>
							<Stack.Item>
								<div style={{ padding: "0 20px" }}>
									<Image
										source={trophyImage}
										alt={t("HomePage.trophyAltText")}
										width={120}
									/>
								</div>
							</Stack.Item>
						</Stack>
					</Card> */}
				</Layout.Section>
				{/* <Layout.Section>
					<ProductsCard />
				</Layout.Section> */}
			</Layout>
		</Page>
	);
}
