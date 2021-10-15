
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

/**
 * 
 * @param {HTMLElement} elem 
 */
function hideElement(elem) {
	elem.style.display = "none";
}

/**
 * 
 * @param {HTMLElement} elem 
 */
function showElement(elem) {
	elem.style.display = "block";
}


import * as Utility from "./utility.js";

import {
	UIComponent, UDim, UDim2, Vector2
} from "./ui.js";

import LoginScreen from "./pages/signin.js";
import Dashboard from "./pages/dashboard.js";

import { DatabaseService, NetworkingService } from "./dbnet.js";

import PageService from "./page.js";


hideElement(LoginScreen.ElementReference);
showElement(Dashboard.ElementReference);



const text_hw = Utility.run_SHA256_onString("Hello World!");
console.log(`Encryped SHA-256 of \"Hello World!\" = ${await text_hw }`);

let k = 0;
let abc = setInterval(async ()=>{

	const sf = await Utility.CreateSnowflake(new Date(), "");
	console.log(`Thing = ${sf}`);

	k += 1;
	if (k > 10) {
		clearInterval(abc);
	}
}, 3000);


LoginScreen.onceInit();
DatabaseService.once_init();
PageService.once_init();

console.info(`%c[MAIN client.js] %cLocked and loaded!`, "color: purple", "color: darkgreen");
// end of file