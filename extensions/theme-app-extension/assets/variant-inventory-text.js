

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

function installChangeEvent(variants, checkout_default_button_name=null, checkout_preorder_button_name=null, addcart_default_button_name=null, addcart_preorder_button_name=null) {
	if (!variants || (variants && variants.length <= 1)) {
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
	// console.log('variants', variants);
	console.log('1327');
	if (inputElements.length > 0) {
		inputElements.forEach(function (elm) {
			elm.addEventListener("input", (e) => {
				// let count = 0;
				let isPreorder = false;
				let variant = variants.filter(variant => e?.target?.value && variant.title.trim().toLowerCase() === e.target.value.trim().toLowerCase());
				if (
					variant
					&& variant.length > 0
					&& variant[0].inventory_quantity <= 0
					&& variant[0].inventory_policy == 'continue'
					&& variant[0].inventory_management == 'shopify'
				) {
					isPreorder = true;
				}
				setTimeout(function() {
					if (isPreorder) {
						// change to pre-order button
						changeInnerHTML(checkout_default_button_name, checkout_preorder_button_name, addcart_default_button_name, addcart_preorder_button_name);
					} else {
						// change to buy it now button
						changeInnerHTML(checkout_preorder_button_name, checkout_default_button_name, addcart_preorder_button_name, addcart_default_button_name);
						changeInnerHTML(checkout_default_button_name, checkout_default_button_name, addcart_default_button_name, addcart_default_button_name);
					}
				}, 10);
				// function childFunction() {
				// 	if (isPreorder) {
				// 		// change to pre-order button
				// 		changeInnerHTML(checkout_default_button_name, checkout_preorder_button_name, addcart_default_button_name, addcart_preorder_button_name);
				// 	} else {
				// 		// change to buy it now button
				// 		changeInnerHTML(checkout_preorder_button_name, checkout_default_button_name, addcart_preorder_button_name, addcart_default_button_name);
				// 	}
				// 	count++;
				
				// 	// Check if the function has been called 10 times (0 to 9).
				// 	if (count >= 2) {
				// 		clearInterval(intervalID); // Clear the interval after 10 calls.
				// 	}
				// }
				// let intervalID = setInterval(childFunction, 100);
			});
		});
	}
	if (otherElements.length > 0) {
		otherElements.forEach(function (elm) {
			elm.addEventListener("click", (e) => {
				// let count = 0;
				let isPreorder = false;
				let variant = variants.filter(variant => e?.target?.value && variant.title.trim().toLowerCase() === e.target.value.trim().toLowerCase());
				if (
					variant
					&& variant.length > 0
					&& variant[0].inventory_quantity <= 0
					&& variant[0].inventory_policy == 'continue'
					&& variant[0].inventory_management == 'shopify'
				) {
					isPreorder = true;
				}
				setTimeout(function() {
					if (isPreorder) {
						// change to pre-order button
						changeInnerHTML(checkout_default_button_name, checkout_preorder_button_name, addcart_default_button_name, addcart_preorder_button_name);
					} else {
						// change to buy it now button
						changeInnerHTML(checkout_preorder_button_name, checkout_default_button_name, addcart_preorder_button_name, addcart_default_button_name);
						changeInnerHTML(checkout_default_button_name, checkout_default_button_name, addcart_default_button_name, addcart_default_button_name);
					}
				}, 10);
				// function childFunction() {
				// 	if (isPreorder) {
				// 		// change to pre-order button
				// 		changeInnerHTML(checkout_default_button_name, checkout_preorder_button_name, addcart_default_button_name, addcart_preorder_button_name);
				// 	} else {
				// 		// change to buy it now button
				// 		changeInnerHTML(checkout_preorder_button_name, checkout_default_button_name, addcart_preorder_button_name, addcart_default_button_name);
				// 	}
				// 	count++;
				
				// 	// Check if the function has been called 10 times (0 to 9).
				// 	if (count >= 2) {
				// 		clearInterval(intervalID); // Clear the interval after 10 calls.
				// 	}
				// }
				// let intervalID = setInterval(childFunction, 100);
			});
		});
	}
	return;
}

function changeInnerHTML(checkout_default_button_name=null, checkout_preorder_button_name=null, addcart_default_button_name=null, addcart_preorder_button_name=null) {
	let elements = document.body.querySelectorAll('*');
	let checkout_elements = [];
	let addcart_elements = [];
	if (checkout_default_button_name || addcart_default_button_name) {
		elements.forEach(function (elm) {
			if (
				elm.innerHTML &&
				checkout_default_button_name &&
				elm.innerHTML.trim().toLowerCase() == checkout_default_button_name.trim().toLowerCase()
			) {
				checkout_elements.push(elm);
			}
			if (
				elm.innerHTML &&
				addcart_default_button_name &&
				elm.innerHTML.trim().toLowerCase() == addcart_default_button_name.trim().toLowerCase()
			) {
				addcart_elements.push(elm);
			}
		});
	}
	if (checkout_elements.length > 0) {
		checkout_elements.forEach(function (elm, index) {
		// console.log('elm:', checkout_elements[index].innerHTML);
		checkout_elements[index].innerHTML = checkout_preorder_button_name;
		});
	}
	if (addcart_elements.length > 0) {
		addcart_elements.forEach(function (elm, index) {

			addcart_elements[index].innerHTML = addcart_preorder_button_name;
		});
		// console.log('addcart_elements', addcart_elements);
	}
}
