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
