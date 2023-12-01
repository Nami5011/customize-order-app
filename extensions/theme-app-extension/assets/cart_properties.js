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

function cartProperties_dB3v2jY9Itp3(variants=null, selectedVariant=null, cart_msg_preorder='') {
	if (!variants) {
		return;
	}
	let elements = [];
	let inputElements = [];
	let quantityElements = [];
	let currentVariant = selectedVariant ? [selectedVariant] : [];
	let formElm = getAddCartFormElement_B3v2jY9Itp3();
	elements = document.body.querySelectorAll('input');
	elements.forEach(function (elm) {
		let variant = variants.filter(variant => elm?.value && variant.title.trim().toLowerCase() === elm.value.trim().toLowerCase());
		if (variant && variant.length > 0) {
			inputElements.push(elm);
		}
		let nameAttribute = elm.getAttribute('name');
		if (nameAttribute === 'quantity') {
			quantityElements.push(elm);
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
	
	// variant change event
	if (inputElements.length > 0) {
		inputElements.forEach(function (elm) {
			elm.addEventListener("input", (e) => {
				let variant = variants.filter(variant => e?.target?.value && variant.title.trim().toLowerCase() === e.target.value.trim().toLowerCase());
				if (variant && variant.length > 0) {
					currentVariant = variant;
					let quantity = quantityElements.length > 0 ? quantityElements[0].value : 1;
					setTimeout(function() {
						changeCartMsgPreorderdB3v2jY9Itp3(variant, formElm, cart_msg_preorder, quantity);
					});
				}
			});
		});
	}
	if (otherElements.length > 0) {
		otherElements.forEach(function (elm) {
			elm.addEventListener("click", (e) => {
				let variant = variants.filter(variant => e?.target?.value && variant.title.trim().toLowerCase() === e.target.value.trim().toLowerCase());
				if (variant && variant.length > 0) {
					currentVariant = variant;
					let quantity = quantityElements.length > 0 ? quantityElements[0].value : 1;
					setTimeout(function() {
						changeCartMsgPreorderdB3v2jY9Itp3(variant, formElm, cart_msg_preorder, quantity);
					});
				}
			});
		});
	}

	// quantity change event
	if (quantityElements.length > 0) {
		// quantityElements.forEach(function (elm) {
		// 	let changeEvent = (e) => {
		// 		console.log('quantity changed');
		// 		console.log('currentVariant', currentVariant);
		// 		let quantity = e.target.value;
		// 		let variant = [];
		// 		if (currentVariant && currentVariant.length > 0) {
		// 			variant = currentVariant;
		// 			console.log('currentVariant', currentVariant);
		// 			setTimeout(function() {
		// 				changeCartMsgPreorderdB3v2jY9Itp3(variant, formElm, cart_msg_preorder, quantity);
		// 			});
		// 		}
		// 	}
		// 	elm.addEventListener("input", changeEvent);
		// 	elm.addEventListener("click", changeEvent);
		// 	elm.addEventListener("change", changeEvent);
		// });
		// console.log('quantity element length', quantityElements.length);
		setInterval(() => {
			quantityElements.forEach((elm) => {
				let quantity = elm.value;
				let variant = [];
				if (currentVariant && currentVariant.length > 0) {
					variant = currentVariant;
					changeCartMsgPreorderdB3v2jY9Itp3(variant, formElm, cart_msg_preorder, quantity);
				}
			});
		}, 500);
	}
}

function changeCartMsgPreorderdB3v2jY9Itp3(variant, formElm=null, cart_msg_preorder='', quantity=1) {
	if (!variant || (variant && variant.length === 0)) return;

	let propertyElements = document.body.querySelectorAll('#pre-order-properties-dB3v2jY9Itp3');
	// console.log('propertyElements', propertyElements);
	if (
		variant[0].inventory_quantity < Number(quantity)
		&& variant[0].inventory_policy == 'continue'
		&& variant[0].inventory_management == 'shopify'
	) {
		// preorder
		if (propertyElements && propertyElements.length > 0) {
			propertyElements.forEach((elm, index) => {
				if (index !== 0) {
					elm.remove();
				}
			});
		} else {
			addPropElm_B3v2jY9Itp3(formElm, cart_msg_preorder);
		}
	} else {
		propertyElements.forEach((elm, index) => {
			elm.remove();
		});
	}

}

function getAddCartFormElement_B3v2jY9Itp3() {
	// Get all form elements on the page
	var forms = document.forms;
	// Define a regular expression to match "/add/cart" in the action attribute
	var regex = new RegExp('/cart/add');
	let form = null;
	// Iterate through the forms collection using forEach
	for (var i = 0; i < forms.length; i++) {
		// console.log(forms[i].action);
		// Check if the action attribute matches the regular expression
		if (regex.test(String(forms[i].action))) {
			// Get all elements within the current form
			form = forms[i];
		}
	}
	return form;
}

function addPropElm_B3v2jY9Itp3(form, cart_msg_preorder) {
	if (!form) return;

	// Create a new input element
	let newInputElement = document.createElement('input');
	// Set attributes for the input element
	newInputElement.type = 'hidden';
	newInputElement.value = cart_msg_preorder;
	newInputElement.id = 'pre-order-properties-dB3v2jY9Itp3';
	newInputElement.name = 'properties[Pre-order]';
	// Append the new input element to the form

	form.appendChild(newInputElement);
}