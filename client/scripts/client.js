
/**
 * 
 * @param {string} query 
 * @returns HTMLElement;
 */
export function queryElement(query) {
	return document.querySelector(query);
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @returns number[];
 */
function quadraticFormula(a, b, c) {
	// ax^2 + bx + c = 0
	const positiveX = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
	const negativeX = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);
	return [positiveX, negativeX];
}








import LoginScreen from "./pages/signin.js";
import Dashboard from "./pages/dashboard.js";












LoginScreen.onceInit();

console.info(`%c[MAIN client.js] %cLocked and loaded!`, "color: purple", "color: darkgreen");
// end of file