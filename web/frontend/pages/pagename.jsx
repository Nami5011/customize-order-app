import { Card, Page, Layout, TextContainer, Text, Box } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { apiPath, apiParam, ownerType } from '../../common-variable';
import { useState, useEffect, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function PageName() {
	const { t } = useTranslation();
	const [token, setToken] = useState({});
	const fetch = useAuthenticatedFetch();
	const storefrontAccessTokenCreate = async () => {
		let data = {};
		data.title = 'Preorder Storefront access token - Test';
		let response = await fetch(apiPath.storefrontAccessTokenCreate, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			const res_data = await response.json();
			const return_data = res_data?.body?.data;
			setToken(return_data);
			console.log('callMetafieldVisiblities response', return_data);
			return return_data ?? [];
		} else {
			console.error('callMetafieldVisiblities error', response);
			return null;
		}
	};
	const webhookCartsUptateCreate = async () => {
		let return_data;
		try {
			let response = await fetch('/api/webhookSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'eventBridgeWebhookSubscriptionCreate',
					topic: 'CARTS_UPDATE',
					arn: 'arn:aws:events:ap-northeast-1::event-source/aws.partner/shopify.com/49716232193/preorder-test',
				}),
			});
			return_data = await response.json();
			setToken(return_data);
			console.log('eventBridgeWebhookSubscriptionCreate response', return_data);
			return return_data ?? [];
		} catch (e) {
			console.error('eventBridgeWebhookSubscriptionCreate error', e);
			return null;
		}
	};

	const [webhookId, setWebhookId] = useState('');
	const getWebhooks = async () => {
		var return_data = [];
		try {
			const response = await fetch('/api/webhookSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'webhookSubscriptions',
				}),
			});
			return_data = await response.json();
		} catch (e) {
			console.error('Failed get webhooks', e);
		}
		setToken(return_data);
		console.log('webhookSubscriptions response', return_data);
		let id = '';
		return_data.forEach(webhook => {
			if (webhook?.endpoint?.__typename === "WebhookEventBridgeEndpoint"
				&& webhook?.endpoint?.arn === 'arn:aws:events:ap-northeast-1::event-source/aws.partner/shopify.com/49716232193/preorder-test') {
				id = webhook.id;
			}
		});
		console.log('the id :', id);
		setWebhookId(id)
		return return_data ?? [];
	};
	const webhookCartsUptateDelete = async () => {
		let return_data;
		try {
			let response = await fetch('/api/webhookSubscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					queryName: 'webhookSubscriptionDelete',
					id: webhookId,
				}),
			});
			return_data = await response.json();
			setToken(return_data);
		} catch (e) {
			console.error('webhookCartsUptateDelete error', e);
			return null;
		}
	};
	return (
		<Page>
			<TitleBar
				title={t("PageName.title")}
				primaryAction={{
					content: t("PageName.primaryAction"),
					onAction: storefrontAccessTokenCreate,
				}}
				secondaryActions={[
					{
						content: t("PageName.secondaryAction"),
						onAction: storefrontAccessTokenCreate,
					},
				]}
			/>
			<Layout>
				<Layout.Section>
					<button
						onClick={webhookCartsUptateCreate}
					>create cart update webhook</button>
					{/* <button
						onClick={webhookOrderCreate}
					>create orders create webhook</button> */}
					<button
						onClick={getWebhooks}
					>get webhooks</button>
					<button
						onClick={webhookCartsUptateDelete}
					>Delete webhook</button>
					{token && (
						<Box
							padding="4"
							background="bg-subdued"
							borderColor="border"
							borderWidth="1"
							borderRadius="2"
							overflowX="scroll"
						>
							<pre style={{ margin: 0 }}>
								<code>{JSON.stringify(token, null, 2)}</code>
							</pre>
						</Box>
					)}
				</Layout.Section>
				<Layout.Section secondary>
					<Card sectioned>
						<Text variant="headingMd" as="h2">
							{t("PageName.heading")}
						</Text>
						<TextContainer>
							<p>{t("PageName.body")}</p>
						</TextContainer>
					</Card>
				</Layout.Section>
			</Layout>
		</Page>
	);
}
