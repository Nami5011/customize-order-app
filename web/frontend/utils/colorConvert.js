/**
 * Convert hsb to rgb.
 *
 * @param {object}
 * @returns {string} rgb(ZZZ, ZZZ, ZZZ)
 */
export function hsbToRgb(_h = null, _s = null, _b = null) {
	if (_h === null || _s === null || _b === null) {
		return 'rgb(255, 255, 255)';
	}
	// _s /= 100;
	// _b /= 100;
	const k = (n) => (n + _h / 60) % 6;
	const f = (n) => _b * (1 - _s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
	let r = 255 * f(5);
	let g = 255 * f(3);
	let b = 255 * f(1);
	let rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';
	return rgb;
}

/**
 * Convert hex to rgb in object.
 *
 * @param {string}
 * @returns {object}
 */
 export function hexToRgbObject(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});
  
	var hexArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return hexArray ? {
		red: parseInt(hexArray[1], 16),
		green: parseInt(hexArray[2], 16),
		blue: parseInt(hexArray[3], 16)
	} : null;
}

/**
 * Convert hex to rgb.
 *
 * @param {string} 
 * @returns {string} rgb(ZZZ, ZZZ, ZZZ)
 */
 export function hexToRgb(hex) {
	var hexObj = hexToRgbObject(hex);
	return hexObj ? 'rgb(' + hexObj.red + ', ' + hexObj.green + ', ' + hexObj.blue + ')' : 'rgb(255, 255, 255)';
}