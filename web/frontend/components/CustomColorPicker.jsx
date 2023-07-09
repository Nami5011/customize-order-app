import { useState } from "react";
import { ColorPicker, Text, VerticalStack } from "@shopify/polaris";

export function CustomColorPicker(props) {

	// const handle = async () => {

	// };

	return (
		<>
			<VerticalStack gap="1">
				<label>{props.title}</label>
				<ColorPicker onChange={props.setColor} color={props.color} disabled={props.disabled} />
			</VerticalStack>
		</>
	);
}
