// @ts-check

/**
* @typedef {import("../generated/api").InputQuery} InputQuery
* @typedef {import("../generated/api").FunctionResult} FunctionResult
* @typedef {import("../generated/api").Operation} Operation
*/

/**
* @type {FunctionResult}
*/
const NO_CHANGES = {
	operations: [],
};
// import { Buffer } from 'buffer';

export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
(input) => {
	// Define a type for your configuration, and parse it from the metafield
	/**
	 * @type {{
	 *  stateProvinceCode: string
	 *  message: string
	 *  domain: string
	 *  storefront: string
	 *  customDeliveryOptions: Array
	 * }}
	 */
	// metafield
	const configuration = JSON.parse(
		input?.deliveryCustomization?.metafield?.value ?? "{}"
	);
	// No setting
	if (!configuration.customDeliveryOptions || (configuration.customDeliveryOptions && configuration.customDeliveryOptions.length === 0)) {
		return NO_CHANGES;
	}
	
	const customDeliveryOptions = configuration.customDeliveryOptions;
	var preOrders = input.cart.lines.filter((line) => Number(line.attribute?.value) > 0);
	var preOrderFlg = preOrders && preOrders.length > 0 ? true : false;

	let hideOperations = input.cart.deliveryGroups
	.flatMap(group => group.deliveryOptions)
	.filter(option => {
		let conditions = customDeliveryOptions.filter(customOption => customOption.name == option.code);
		if (conditions && conditions.length > 0) {
			let condition = conditions[0]?.condition;
			if (condition == 'INSTOCK_ONLY' && preOrderFlg) {
				return true; // hide the option
			} else if (condition == 'PREORDER' && !preOrderFlg) {
				return true; // hide the option
			}
			return false;
		}
	})
	.map(option => /** @type {Operation} */({
		hide: {
			deliveryOptionHandle: option.handle,
		}
	}));
	
	if (hideOperations && hideOperations.length > 0) {
		return {
			operations: hideOperations
		};
	}
	return NO_CHANGES;

};
  