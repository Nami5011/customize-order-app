import {
	Page,
	Text,
	AlphaCard,
} from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";

export default function HomePage() {
	const { t } = useTranslation();
	return (
		<Page
			backAction={{ content: 'App Top', url: '/' }}
			divider
			title={t("NavigationMenu.buyButton")}
		>
			<div style={{ "marginBottom": '20px' }}>
				<Text as="h3" variant="headingMd">
					{t("buyButton.textInstructionTitle")}
				</Text>
				<AlphaCard roundedAbove="sm">
					<ol>
						<li>{t("buyButton.textInstructions.1-1")}<strong>{t("buyButton.textInstructions.1-2")}</strong>{t("buyButton.textInstructions.1-3")}.</li>
						<li>{t("buyButton.textInstructions.2-1")}<strong>{t("buyButton.textInstructions.2-2")}</strong>{t("buyButton.textInstructions.2-3")}.</li>
						<li>{t("buyButton.textInstructions.3-1")}<strong>{t("buyButton.textInstructions.3-2")}</strong>{t("buyButton.textInstructions.3-3")}.</li>
						<li>{t("buyButton.textInstructions.4-1")}<strong>{t("buyButton.textInstructions.4-2")}</strong>{t("buyButton.textInstructions.4-3")}.</li>
						<li>{t("buyButton.textInstructions.5-1")}<strong>{t("buyButton.textInstructions.5-2")}</strong>{t("buyButton.textInstructions.5-3")}.</li>
						<li>{t("buyButton.textInstructions.6")}.</li>
						<li>{t("buyButton.textInstructions.7")}.</li>
						<li>{t("buyButton.textInstructions.8")}.</li>
					</ol>
				</AlphaCard>
			</div>
			<div style={{ "marginBottom": '20px' }}>
				<Text as="h3" variant="headingMd">
					{t("buyButton.colorInstructionTitle")}
				</Text>
				<AlphaCard roundedAbove="sm">
					<ol>
						<li>{t("buyButton.colorInstructions.1-1")}<strong>{t("buyButton.colorInstructions.1-2")}</strong>{t("buyButton.colorInstructions.1-3")}.</li>
						<li>{t("buyButton.colorInstructions.2-1")}<strong>{t("buyButton.colorInstructions.2-2")}</strong>{t("buyButton.colorInstructions.2-3")}.</li>
						<li>{t("buyButton.colorInstructions.3-1")}<strong>{t("buyButton.colorInstructions.3-2")}</strong>{t("buyButton.colorInstructions.3-3")}.</li>
						<li>{t("buyButton.colorInstructions.4-1")}<strong>{t("buyButton.colorInstructions.4-2")}</strong>{t("buyButton.colorInstructions.4-3")}.</li>
						<li>{t("buyButton.colorInstructions.5-1")}<strong>{t("buyButton.colorInstructions.5-2")}</strong>{t("buyButton.colorInstructions.5-3")}.</li>
						<li>{t("buyButton.colorInstructions.6")}.</li>
						<li>{t("buyButton.colorInstructions.7")}.</li>
						<li>{t("buyButton.colorInstructions.8")}.</li>
					</ol>
				</AlphaCard>
			</div>
			<div style={{ "marginBottom": '20px' }}>
				{t("contactUs")}
			</div>
		</Page>
	);
}
