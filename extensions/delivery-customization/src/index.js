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

export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
(input) => {
	// Define a type for your configuration, and parse it from the metafield
	/**
	 * @type {{
	 *  stateProvinceCode: string
	 *  message: number
	 * }}
	 */

	// metafield
	const configuration = JSON.parse(
		input?.deliveryCustomization?.metafield?.value ?? "{}"
	);
	if (!configuration.stateProvinceCode || !configuration.message) {
		return NO_CHANGES;
	}

	const cartline = input?.cart?.deliveryGroups[0]?.cartLines;
	console.log('CARTLINE', cartline);

	let toRename = input.cart.deliveryGroups
	.filter(group => group.deliveryAddress?.provinceCode &&
		// Use the configured province code instead of a hardcoded value
		group.deliveryAddress.provinceCode == "NC")
		// group.deliveryAddress.provinceCode == configuration.stateProvinceCode)
	.flatMap(group => group.deliveryOptions)
	.map(option => /** @type {Operation} */({
		rename: {
			deliveryOptionHandle: option.handle,
			// Use the configured message instead of a hardcoded value
			title: option.title ? `${option.title} - custom message` : 'custom message'
			//   title: option.title ? `${option.title} - ${configuration.message}` : configuration.message
		}
	}));

	return {
		operations: toRename
	};
	return NO_CHANGES;
};
  