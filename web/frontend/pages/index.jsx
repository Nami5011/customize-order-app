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
import { checkAppSubscription } from "../utils/appSubscription";

export default function HomePage() {
	const { t } = useTranslation();
	const fetch = useAuthenticatedFetch();
	const app = useAppBridge();
	const appRedirect = Redirect.create(app);

	const [checkingSubscription, setCheckingSubscription] = useState(true);
	const appSubscriptionCheck = async () => {
		let subscription = await checkAppSubscription(fetch, appRedirect, Redirect);
		// console.log('subscription', subscription);
		if (subscription?.existBillFlg === true && subscription.errors.length === 0) {
			setCheckingSubscription(false);
		} else if (subscription?.errors && subscription.errors.length > 0) {
			// error
			console.error('Subscription Error', subscription.errors);
		}
	};
	if (checkingSubscription) {
		return <Loading />;
	}

	useEffect(() => {
		appSubscriptionCheck();
	}, []);

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
