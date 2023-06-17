console.log('helloss');
// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {
	// target status element
	var targetInventoryElement = document.querySelector('.product__inventory');
	var targetInnerHTML = targetInventoryElement?.innerHTML;
	// inventory setting
	var inventorySetting = document.getElementById('inventorySetting_customize_order_app');
	inventorySetting = inventorySetting?.value;
	// pre order status
	var preOrderStatus = document.getElementById('preOrderStatus_customize_order_app');
	preOrderStatus = preOrderStatus?.value;
	// inventory quantity
	var inventoryQuantity = document.getElementById('inventoryQuantity_customize_order_app');
	inventoryQuantity = inventoryQuantity?.value;
	console.log('loaded');
	console.log(targetInventoryElement);
	console.log(inventorySetting);
	console.log(preOrderStatus);
	console.log(inventoryQuantity);

	// get close inner html tags
	var closeTagIndex = -1;
	if (targetInventoryElement) {
		closeTagIndex = targetInnerHTML ? targetInnerHTML.indexOf('</svg>') : -1;
	}
	var htmlTag = '';
	if (closeTagIndex > -1) {
		closeTagIndex += 6; // add close tag length
		htmlTag = targetInnerHTML.substr(0, closeTagIndex);
	}

	// set inventory status element
	if (inventoryQuantity !== undefined && Number(inventoryQuantity) === 0 && inventorySetting === 'continue' && preOrderStatus) {
		targetInventoryElement.innerHTML = htmlTag + preOrderStatus;
	}


	// // Check the inventory status and display a custom message
	// if (targetInventoryElement) {
	// 	if (targetInventoryElement.textContent.trim().toLowerCase() === 'in stock') {
	// 		targetInventoryElement.textContent = 'This product is in stock!';
	// 	} else {
	// 		targetInventoryElement.textContent = 'This product is currently out of stock.';
	// 	}
	// }
});