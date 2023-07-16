import { ColorPicker, VerticalStack, LegacyStack, TextField } from "@shopify/polaris";
import { hexToRgbObject } from "../utils/colorConvert";

export function CustomColorPicker(props) {

	const isInvalid = () => {
		if (props.hex == '') {
			return true;
		}
		let obj = hexToRgbObject(props.hex);
		return !obj;
	}
	return (
		<>
			<VerticalStack gap="1">
				<label>{props.title}</label>
				<ColorPicker
					onChange={props.setColor}
					color={props.color}
					disabled={props.disabled}
				/>
				<LegacyStack>
					<TextField
						label="Hex Color"
						labelHidden
						selectTextOnFocus
						value={props.hex}
						error={isInvalid()}
						onChange={props.setHex}
						placeholder="#000000"
						maxLength={7}
						disabled={props.disabled}
					/>
				</LegacyStack>
			</VerticalStack>
		</>
	);
}
