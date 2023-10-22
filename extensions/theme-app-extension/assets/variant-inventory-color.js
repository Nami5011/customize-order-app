

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

function changeButtonColorPreorderdB3v2jY9Itp3(target=null, additionalCssClass=null, removeFlg=false) {
	if (!target || !additionalCssClass) {
		return;
	}
	let elements = [];
	if (target.includes('#')) {
		elements = document.body.getElementById(target.replace(/^#/, ''));
	} else {
		elements = document.body.querySelectorAll('.' + target);
	}
	if (!elements || (elements && elements.length === 0)) {
		return;
	}
	if (!removeFlg) {
		elements.forEach(function (elm) {
			elm.classList.add(additionalCssClass);
		});
	} else {
		elements.forEach(function (elm) {
			elm.classList.remove(additionalCssClass);
		});
	}

}

function addEventButtonColorPreorderdB3v2jY9Itp3(variants=null, target=null, additionalCssClass=null) {
	if (!variants || (variants && variants.length <= 1)) {
		// console.log('no variants');
		return;
	}
	if (!target || !additionalCssClass) {
		return;
	}

	// Get variants form elements
	// let elements = document.body.querySelectorAll('*');
	// let variantElements = [];
	// elements.forEach(function (elm) {
	// 	let variant = variants.filter(variant => elm?.innerHTML && variant.title.trim().toLowerCase() === elm.innerHTML.trim().toLowerCase());
	// 	if (variant && variant.length > 0) {
	// 		variantElements.push(elm);
	// 	}
	// });
	// elements = document.body.querySelectorAll('input');
	// elements.forEach(function (elm) {
	// 	let variant = variants.filter(variant => elm?.value && variant.title.trim().toLowerCase() === elm.value.trim().toLowerCase());
	// 	if (variant && variant.length > 0) {
	// 		variantElements.push(elm);
	// 	}
	// });
	// // console.log('variants', variants);
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
				// console.log('input');
				let count = 0;
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
						// change to pre-order button color
						changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass);
					} else {
						// back to default
						changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass, true);
					}
				});
				// let intervalID = setInterval(function() {
				// 	if (isPreorder) {
				// 		// change to pre-order button color
				// 		changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass);
				// 	} else {
				// 		// back to default
				// 		changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass, true);
				// 	}
				// 	count++;
				
				// 	if (count >= 2) {
				// 		clearInterval(intervalID); // Clear the interval
				// 	}
				// }, 100);
			});
		});
	}
	if (otherElements.length > 0) {
		otherElements.forEach(function (elm) {
			elm.addEventListener("click", (e) => {
				// console.log('click');
				let count = 0;
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
						// change to pre-order button color
						changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass);
					} else {
						// back to default
						changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass, true);
					}
				});
				// let intervalID = setInterval(function() {
				// 	if (isPreorder) {
				// 		// change to pre-order button color
				// 		changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass);
				// 	} else {
				// 		// back to default
				// 		changeButtonColorPreorderdB3v2jY9Itp3(target, additionalCssClass, true);
				// 	}
				// 	count++;
				
				// 	if (count >= 2) {
				// 		clearInterval(intervalID); // Clear the interval
				// 	}
				// }, 100);
			});
		});
	}
	return;
}