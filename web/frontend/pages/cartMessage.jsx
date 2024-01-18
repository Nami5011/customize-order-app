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
			title={t("NavigationMenu.cartMessage")}
		>
			<div style={{ "marginBottom": '20px' }}>
				<Text as="h3" variant="headingMd">
					{t("cartMessage.instructionTitle")}
				</Text>
				<AlphaCard roundedAbove="sm">
					<ol>
						<li>{t("cartMessage.instructions.1-1")}<strong>{t("cartMessage.instructions.1-2")}</strong>{t("cartMessage.instructions.1-3")}.</li>
						<li>{t("cartMessage.instructions.2-1")}<strong>{t("cartMessage.instructions.2-2")}</strong>{t("cartMessage.instructions.2-3")}.</li>
						<li>{t("cartMessage.instructions.3-1")}<strong>{t("cartMessage.instructions.3-2")}</strong>{t("cartMessage.instructions.3-3")}.</li>
						<li>{t("cartMessage.instructions.4-1")}<strong>{t("cartMessage.instructions.4-2")}</strong>{t("cartMessage.instructions.4-3")}.</li>
						<li>{t("cartMessage.instructions.5-1")}<strong>{t("cartMessage.instructions.5-2")}</strong>{t("cartMessage.instructions.5-3")}.</li>
						<li>{t("cartMessage.instructions.6")}.</li>
						<li>{t("cartMessage.instructions.7")}.</li>
						<li>{t("cartMessage.instructions.8")}.</li>
					</ol>
				</AlphaCard>
			</div>
			<div style={{ "marginBottom": '20px' }}>
				{t("contactUs")}
			</div>
		</Page>
	);
}
