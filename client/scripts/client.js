
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




import {
	UIComponent, UDim, UDim2, Vector2
} from "./ui.js";

import LoginScreen from "./pages/signin.js";
import Dashboard from "./pages/dashboard.js";


hideElement(LoginScreen.ElementReference);
showElement(Dashboard.ElementReference);




// const floatingTestAlpha = new UIComponent(
// 	document.querySelector(`div[name="floating-test-alpha"]`),
// 	"floating-test-alpha"
// );
// const floatingTestBeta = new UIComponent(
// 	document.querySelector(`div[name="floating-test-beta"]`),
// 	"floating-test-beta"
// );
// const floatingTestGamma = new UIComponent(
// 	document.querySelector(`div[name="floating-test-gamma"]`),
// 	"floating-test-gamma"
// );
// const floatingTestDelta = new UIComponent(
// 	document.querySelector(`div[name="floating-test-delta"]`),
// 	"floating-test-delta"
// );
// const bobFloatingTest = new UIComponent(
// 	document.querySelector(`div[name="floating-test"]`),
// 	"floating-test-master"
// );

// floatingTestAlpha.setParent(bobFloatingTest);
// floatingTestBeta.setParent(bobFloatingTest);
// floatingTestGamma.setParent(floatingTestBeta);
// floatingTestDelta.setParent(floatingTestGamma);

// floatingTestAlpha.Position = new UDim2(0, 0, 0, 0);
// floatingTestAlpha.Size = new UDim2(0.4, 0, 1, 0);
// floatingTestAlpha.AnchorPoint = new Vector2(0, 0);

// floatingTestBeta.Position = new UDim2(0.4, 0, 1, 0);
// floatingTestBeta.Size = new UDim2(0.6, 0, 1, 0);
// floatingTestBeta.AnchorPoint = new Vector2(0, 0);

// floatingTestGamma.Position = new UDim2(0, 0, 0, 0);
// floatingTestGamma.Size = new UDim2(1, 0, 1, 0);
// floatingTestGamma.AnchorPoint = new Vector2(0, 0);

// floatingTestDelta.Position = new UDim2(1, 0, 0, 0);
// floatingTestDelta.Size = new UDim2(1, 0, 2, 0);
// floatingTestDelta.AnchorPoint = new Vector2(0, 1);

// // [floatingTestAlpha, floatingTestBeta].forEach((uic) => {
// // 	uic.Parent = bobFloatingTest;
// // });
// bobFloatingTest.Position = new UDim2(0.5, 0, 0.5, 0);
// bobFloatingTest.Size = new UDim2(0, 500, 0, 200);
// bobFloatingTest.AnchorPoint = new Vector2(0.5, 0.5);


// let velocityDirection = {X: 1, Y: 1};
// const abc = () => {
// 	if (bobFloatingTest.AbsolutePosition.X > window.innerWidth) {
// 		velocityDirection.X = -1;
// 	} else if (bobFloatingTest.AbsolutePosition.X < 0) {
// 		velocityDirection = 1;
// 	}
// 	if (bobFloatingTest.AbsolutePosition.Y > window.innerHeight) {
// 		velocityDirection = -1;
// 	} else if (bobFloatingTest.AbsolutePosition.Y < 0) {
// 		velocityDirection = 1;
// 	}
// 	bobFloatingTest.Position = bobFloatingTest.Position.add(new UDim2(0, 3 * velocityDirection.X, 0, 3 * velocityDirection.Y));
// 	bobFloatingTest.init();
// 	window.requestAnimationFrame(abc);
// };
// // window.requestAnimationFrame(abc);

// bobFloatingTest.init();

// [floatingTestAlpha, floatingTestBeta, bobFloatingTest].forEach((uic) => uic.init());





LoginScreen.onceInit();

console.info(`%c[MAIN client.js] %cLocked and loaded!`, "color: purple", "color: darkgreen");
// end of file