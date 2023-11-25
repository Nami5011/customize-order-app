function mapVariants(variants, quantity, policy) {
	if (
		!variants
		|| variants.length === 0
		|| !quantity
		|| quantity.length === 0
		|| !policy
		|| policy.length === 0
	) {
		return variants;
	}
	variants.forEach((variant, index) => {
		variants[index]['inventory_quantity'] = quantity[index];
		variants[index]['inventory_policy'] = policy[index];
	});
	return variants;
}

function addEventInventoryStatusPreorderdB3v2jY9Itp3(variants=null, blockId=null, rangeLowInventory=null, message_lowinventory='') {
	if (!variants || (variants && variants.length <= 1) || !blockId) {
		// console.log('no variants');
		return;
	}

	let elements = [];
	let inputElements = [];
	elements = document.body.querySelectorAll('input');
	elements.forEach(function (elm) {
		let variant = variants.filter(variant => elm?.value && variant.title.trim().toLowerCase() === elm.value.trim().toLowerCase());
		if (variant && variant.length > 0) {
			inputElements.push(elm);
		}
	});
	let otherElements = [];
	if (inputElements.length === 0) {
		elements = document.body.querySelectorAll('*');
		elements.forEach(function (elm) {
			let variant = variants.filter(variant => elm?.innerHTML && variant.title.trim().toLowerCase() === elm.innerHTML.trim().toLowerCase());
			if (variant && variant.length > 0) {
				otherElements.push(elm);
			}
		});
	}
	
	if (inputElements.length > 0) {
		inputElements.forEach(function (elm) {
			elm.addEventListener("input", (e) => {
				let variant = variants.filter(variant => e?.target?.value && variant.title.trim().toLowerCase() === e.target.value.trim().toLowerCase());
				setTimeout(function() {
					changeInventoryStatusPreorderdB3v2jY9Itp3(variant, blockId, rangeLowInventory, message_lowinventory);
				});
			});
		});
	}
	if (otherElements.length > 0) {
		otherElements.forEach(function (elm) {
			elm.addEventListener("click", (e) => {
				// console.log('click');
				let variant = variants.filter(variant => e?.target?.value && variant.title.trim().toLowerCase() === e.target.value.trim().toLowerCase());
				setTimeout(function() {
					changeInventoryStatusPreorderdB3v2jY9Itp3(variant, blockId, rangeLowInventory, message_lowinventory);
				});
			});
		});
	}
	return;
}

function changeInventoryStatusPreorderdB3v2jY9Itp3(variant, blockId, rangeLowInventory=null, message_lowinventory='') {
	if (!variant || (variant && variant.length === 0)) return;
	let inStockElement = document.getElementById('status_stock' + blockId);
	let stockLowElement = document.getElementById('status_low' + blockId);
	let preorderElement = document.getElementById('status_preorder' + blockId);
	let soldoutElement = document.getElementById('status_soldout' + blockId);
	let textElement = null;
	let hide_class = 'hide_inventory__custom';
	if (
		(variant[0].inventory_quantity > 0
		&& variant[0].inventory_quantity > rangeLowInventory
		&& variant[0].inventory_management == 'shopify')
		|| (variant[0].inventory_quantity > 0 && rangeLowInventory == null && variant[0].inventory_management == 'shopify')
		|| (variant[0].inventory_management != 'shopify')
	) {
		// in stock
		if (inStockElement && inStockElement.classList.contains(hide_class)) {
			inStockElement.classList.remove(hide_class);
		}
		if (stockLowElement && !stockLowElement.classList.contains(hide_class)) {
			stockLowElement.classList.add(hide_class);
		}
		if (preorderElement && !preorderElement.classList.contains(hide_class)) {
			preorderElement.classList.add(hide_class);
		}
		if (soldoutElement && !soldoutElement.classList.contains(hide_class)) {
			soldoutElement.classList.add(hide_class);
		}
	} else if(
		variant[0].inventory_quantity > 0
		&& rangeLowInventory !== null
		&& rangeLowInventory >= variant[0].inventory_quantity
		&& variant[0].inventory_management == 'shopify'
	) {
		// low stock
		if (inStockElement && !inStockElement.classList.contains(hide_class)) {
			inStockElement.classList.add(hide_class);
		}
		if (stockLowElement && stockLowElement.classList.contains(hide_class)) {
			stockLowElement.classList.remove(hide_class);
		}
		if (preorderElement && !preorderElement.classList.contains(hide_class)) {
			preorderElement.classList.add(hide_class);
		}
		if (soldoutElement && !soldoutElement.classList.contains(hide_class)) {
			soldoutElement.classList.add(hide_class);
		}
		textElement = stockLowElement.querySelector('#text');
		textElement.textContent = message_lowinventory.replace(/{number}/g, variant[0].inventory_quantity);
	} else if (
		variant[0].inventory_quantity <= 0
		&& variant[0].inventory_policy == 'continue'
		&& variant[0].inventory_management == 'shopify'
	) {
		// preorder
		if (inStockElement && !inStockElement.classList.contains(hide_class)) {
			inStockElement.classList.add(hide_class);
		}
		if (stockLowElement && !stockLowElement.classList.contains(hide_class)) {
			stockLowElement.classList.add(hide_class);
		}
		if (preorderElement && preorderElement.classList.contains(hide_class)) {
			preorderElement.classList.remove(hide_class);
		}
		if (soldoutElement && !soldoutElement.classList.contains(hide_class)) {
			soldoutElement.classList.add(hide_class);
		}
	} else if (
		variant[0].inventory_quantity <= 0
		&& variant[0].inventory_policy == 'deny'
		&& variant[0].inventory_management == 'shopify'
	) {
		// soldout
		if (inStockElement && !inStockElement.classList.contains(hide_class)) {
			inStockElement.classList.add(hide_class);
		}
		if (stockLowElement && !stockLowElement.classList.contains(hide_class)) {
			stockLowElement.classList.add(hide_class);
		}
		if (preorderElement && !preorderElement.classList.contains(hide_class)) {
			preorderElement.classList.add(hide_class);
		}
		if (soldoutElement && soldoutElement.classList.contains(hide_class)) {
			soldoutElement.classList.remove(hide_class);
		}
	}

}