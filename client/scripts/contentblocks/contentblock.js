
import * as Utility from "../utility.js";






class ContentblockMarkup extends HTMLDivElement {
	constructor(associatedContentBlock) {
		super();

		/**
		 * @param {undefined | Contentblock} Contentblock - The associated Contentblock.
		 */
		this.Contentblock = associatedContentBlock;

		this.StylesToApply = {
			self: {
				"backgroundColor": "grey",
				"width": "100%",
				"height": "max-content"
			},
			placeholder: {
				"color": "grey",
				"backgroundColor": "darkgrey"
			}
		};

		this.init();
	}

	init() {
		this.createMarkup();
		this.applyCustomStyling();
	
	}

	createMarkup() {
		// self = this; this = self
		this.classList.add("contentblock");

		const div = document.createElement("div");
		div.setAttribute("name", "ContentblockMarkup-div");
		div.setAttribute("placeholder", "This is a placeholder text for ContentblockMarkup-div hehe ?");
		div.style.width = "100%";
		div.style.minHeight = `${Contentblock.convert_remToPixels(1) * parseFloat(Contentblock.get_css_variable("line-height")) }px`;
		div.style.height = "max-content";
		div.textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

		this.appendChild(div);
		console.log(`Should have appened ${div} to ${this}`);
	}

	applyCustomStyling() {
		for (let name in this.StylesToApply) {
			const configObj = this.StylesToApply[name];
			for (let key in configObj) {
				const val = configObj[key];
	
				if (name === "self") {
					this.style[key] = val;
				} else {
					const item = [...this.children].find((item)=>item.name===name);
					if (item !== undefined) {
						item.style[key] = val;
					}
				}
			}
		}
	}


	custom_focus() {

		this.classList.add("selected");
		
	}
	custom_unfocus() {

		this.classList.remove("selected");

	}

};

class TextBlockMarkup extends HTMLDivElement {
	constructor(associatedContentBlock) {
		super();

		this.Contentblock = associatedContentBlock;

		this.TextContent = ``; // normal
		this.EscapedTextContent = ``; //replaces tabs and line-breaks with escape codes

		this.init();
	}

	init() {
		this.createMarkup();
	}

	createMarkup() {
		// self = this; this = self

		(async ()=>{
			this.setAttribute("name", `textblock-${await this.Contentblock.Id_Promise}`);
		})();
		this.classList.add("textblock", "contentblock");


		const div = document.createElement("div");
		div.setAttribute("name", "text-holder");
		div.setAttribute("placeholder", "This is a placeholder text for TextBlockMarkup_text-holder hehe ?");
		div.style.width = "100%";
		// div.style.minHeight = `${Contentblock.convert_remToPixels(1)}px`;
		div.style.minHeight = `${Contentblock.convert_remToPixels(2) }px`;

		// div.style.height = "max-content";
		div.textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
		div.setAttribute("contenteditable", "true");

		this.appendChild(div);
		console.log(`Should have appened ${div} to ${this}`);
	}



};














export default class Contentblock {

	/**
	 * @type {Map<string, Contentblock>} GlobalMap - The global map of Contentblocks!
	 */
	static GlobalMap = new Map();

	static AddToGlobalMap(id, obj) {
		Contentblock.GlobalMap.set(id, obj);
		console.info(`${id} set ${obj} in ContentBlock GlobalMap.`);
	}

	constructor(dateObject, name) {
		this.ClassName = "Contentblock";
		this.Name = "Contentblock";
		this.Id = undefined;

		/**
		 * @param {HTMLElement | undefined} Element - Element reference for this Block.
		 */
		this.Element = undefined;

		this.Markup = undefined;


		this.Id_Promise = Utility.CreateSnowflake(dateObject, String(name));
		this.Id_Promise.then((generatedSnowflake) => {
			this.Id = generatedSnowflake;
			// console.log(`Contentblock ${this.id} is now available`);
			this.selfLog(`id has been set.`);
			// Contentblock.GlobalMap.set(this.Id, this);
			Contentblock.AddToGlobalMap(this.Id, this);
		}).catch(reason => console.error);
		

	}

	/**
	 * 
	 * @param  {...any} message 
	 */
	selfLog(...message) {
		console.trace(`${new Date(Date.now()).toUTCString()}\n%c${this.ClassName} %c"${this.Name}" %c#%c${this.Id} %c: ${message.join("\n")}`,
		"color:navy", "color:cornflowerblue", "color:black", "color:grey", "color:black");
	}

	init() {

		this.selfLog("init() method executed.");
		return new Promise((resolve, reject) => {

			// this.render();
			// resolve(this);
			resolve( this.render() );
		});

	}



	render() {
		// const div = document.createElement("div");
		const div = new ContentblockMarkup(this);
		div.setAttribute("is", "contentblock-markup");
		this.selfLog(`rendered markup`);

		this.Element = div;

		this.Element.addEventListener("click", (evt)=>{
			console.log("Hello! This is the test message!");
		});
		console.log("Setup click handler");

		return this.Element;
	}


	/**
	 * 
	 * @param {HTMLElement} parent 
	 */
	setParent(parent) {
		parent.appendChild(this.Element);
	}

	focus() {
		this.Element.custom_focus();
		this.Element.click();
	}
	unfocus() {
		this.Element.custom_unfocus();
	}


	/**
	 * @type {Map<string, Contentblock>} SelectedBlocks - A map of Blocks which the User has selected.
	 */
	static SelectedBlocks = new Map();

	/**
	 * @type {HTMLElement} ActiveElement - The current Element that is selected by User to edit.
	 */
	static ActiveElement = undefined;

	/**
	 * @type {HTMLElement} PreviousElement - The previous element that was stored in ActiveElement;
	 */
	static PreviousElement = undefined;

	static ElementEventHandlers = {

	};
	static ClearActiveElement(name, target, eventHandlerType, callback) {
		if (Object.keys(this.ElementEventHandlers).includes(name)) {
			target.removeEventListener(eventHandlerType, callback);
			console.log(`Removed ${name} ${eventHandlerType} from ${target}`);
			this.ElementEventHandlers[name] = undefined;
			delete this.ElementEventHandlers[name];
		}
	}
	static ClearPreviousElement(name, target, eventHandlerType, callback) {
		if (Object.keys(this.ElementEventHandlers).includes(name)) {
			target.removeEventListener(eventHandlerType, callback);
			console.log(`Removed ${name} ${eventHandlerType} from ${target}`);

			this.ElementEventHandlers[name] = undefined;
			delete this.ElementEventHandlers[name];
		}
	}

	static Once_init() {
		window.customElements.define("contentblock-markup", ContentblockMarkup, {
			extends: "div"
		});
		window.customElements.define("textblock-markup", TextBlockMarkup, {
			extends: "div"
		});
		
		console.log(`%c[Contentblock] %cOnce Init executed`, "color:purple", "color:black");
	}

	static get_css_variable(varName) {
		const val = window.getComputedStyle(document.documentElement).getPropertyValue(varName);
		// console.log(`key = ${varName}, val = ${val}`);
		return val;
	}
	static set_css_variable(varName, val) {
		document.documentElement.style.setProperty(varName, val);
		// console.log(`key = ${varName}, set to ${val}`);
	}
	static get_windowFontSizeInPixels() {
		return parseFloat(this.get_css_variable("font-size"));
	}
	static get_1rem_toPixels() {
		return this.get_windowFontSizeInPixels();
	}
	static convert_remToPixels(numberOfRem) {
		return this.get_1rem_toPixels() * numberOfRem;
	}

	static KeyboardKeys_Modifiers = [
		"Alt", "AltGraph", "CapsLock",
		"Control", "Shift"
	];
	static KeyboardKeys_Whitespaces = [
		"Enter", "Tab", " ", "Spacebar"
	];
	static KeyboardKeys_Navigation = [
		"ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
		"End", "Home", "PageDown", "PageUp"
	];
	static KeyboardKeys_Editing = [
		"Backspace", "Clear", "Delete", "Del"
	];
	static KeyboardKeys_UI = [
		"ContextMenu", "Escape"
	];

};

export class TextBlock extends Contentblock {
	static CreateNew() {
		const newTextBlock = new TextBlock();
		newTextBlock.render();
		// ^ skipped the .init() - honestly forgot about init,
		// but in this situation calling .init() can returning a promise
		// is inconvenient, hence skip promise and go synchronous as it's faster
		const pagespace = document.querySelector("#dashboard-content_pagespace");
		newTextBlock.setParent(pagespace);
		// newTextBlock.focus();

		newTextBlock.setTextAndDisplayText(`I am ${newTextBlock.ClassName} ${newTextBlock.Name} number ${Contentblock.GlobalMap.size}`);

		return newTextBlock;
	}
	constructor() {
		super(new Date(), "TextBlock");
		this.ClassName = "TextBlock";
		this.Name = "TextBlock";

		this.Text = ``; // the original text
		this.EscapedText = ``; // original text modified to escape line-breaks, tabs, etc.

		// this.Id_Promise = undefined;
		// this.Id_Promise = Utility.CreateSnowflake(new Date(), "TextBlock");
		// this.Id_Promise.then((generatedSnowflake) => {
		// 	this.Id = generatedSnowflake;
		// 	// console.log(`Contentblock ${this.id} is now available`);
		// 	this.selfLog(`id has been set.`);

		// 	this.setTextAndDisplayText(`This is TextBlock ${Contentblock.GlobalMap.size}. ${"Ipsum Lorem ".repeat(Contentblock.GlobalMap.size)}.`);

		// 	// Contentblock.GlobalMap.set(this.Id, this);
		// 	Contentblock.AddToGlobalMap(this.Id, this);


		// }).catch(reason => console.error);

		this.CursorBlinkEventHook = undefined;
		this.CursorBlinkDuration = 500; // in ms.
	}

	render() {
		const div = new TextBlockMarkup(this);
		div.setAttribute("is", "textblock-markup");
		this.selfLog(`rendered markup [tb]`);
		this.Element = div;
		// this.Element.addEventListener("contextmenu", (evt)=>{
		// 	evt.preventDefault();
		// 	return 0;
		// });
		// this.Element.addEventListener("mousedown", (evt)=>{
		// 	evt.preventDefault();
		// 	// console.log(evt);
		// 	this.onclick(evt);
		// });
		// console.log("Setup click handler");
		this.Element.addEventListener("input", (evt)=>{
			console.log(evt);
			this.hook_enterKeyPressed(evt);
		});
		// this.Element.click();
		return this.Element;
	}

	/**
	 * @param {string} text - The text we want to render in the TextBlock.
	 */
	setText(text) {
		this.Text = text;

		this.Element.TextContent = this.Text;
		this.Element.EscapedTextContent = this.EscapedText;

		// this.setDisplayText(this.Text);

		// const regex = new RegExp(``);
		// this.EscapedText = this.Text.replace();
	}
	/**
	 * 
	 * @param {string} text 
	 */
	setDisplayText(text) {
		this.Element.querySelector(`div[name="text-holder"]`).textContent = text;

	}

	setTextAndDisplayText(text) {
		this.setText(text);
		this.setDisplayText(text);
	}


	/**
	 * 
	 * @param {boolean} shouldBlink 
	 */
	toggle_cursor_blink(shouldBlink) {
		if (shouldBlink) {
			this.CursorBlinkEventHook = setInterval(()=>{
				
			}, this.CursorBlinkDuration);
			
		}
	}
	select() {

		this.Element.classList.add("selected");
	}
	deselect() {

		this.Element.classList.remove("selected");
	}

	hook_enterKeyPressed(evt) {
		// evt.preventDefault();

		if (evt.inputType === "insertText") {
			
			this.edit(evt.data);
			
		} else if (evt.inputType === "insertParagraph") {
			
			// when pressing Enter key

			/**
			 * @type {HTMLElement} srcElement
			 */
			const srcElement = evt.srcElement;
			// this will be the TextBlock-Element.
			const lastChild = [... srcElement.children][srcElement.children.length - 1];
			if (lastChild) {
				console.log(`Last child, id = ${lastChild.id} ${lastChild.Id}`);
				TextBlock.CreateNew();
				console.log(`Pop this new child into its own TextBlock`);
			}
			console.log(lastChild);

			return 1;
		}
	}
	edit(thing) {
		console.log(thing);

		const theKey = (thing instanceof KeyboardEvent) ? (thing.key) : ((typeof thing === "string") ? (thing) : (undefined));
		if (theKey === undefined) {
			return 1;
		}

		const combinedKeySet = [
			...Contentblock.KeyboardKeys_Editing,
			...Contentblock.KeyboardKeys_Modifiers,
			...Contentblock.KeyboardKeys_Navigation,
			...Contentblock.KeyboardKeys_UI,
			...Contentblock.KeyboardKeys_Whitespaces
		];
		if (theKey === "Backspace") {
			this.setText(`${this.Text.substr(0, this.Text.length-1)}`);
		} else if (theKey === " " || theKey === "Spacebar") {
			this.setText(`${this.Text} `);
		} else if (theKey === "Tab") {
			this.setText(`${this.Text}\t`);
		} else if (combinedKeySet.includes(theKey)) {
			return 1;
		} else {
			this.setText(`${this.Text}${theKey}`);
		}

		return 0;
	}

	onclick(evt) {

		// if (evt.button === 0) {
		// 	console.log(`Pressed mouse 1 - Left`);
		// } else if (evt.button === 2) {
		// 	console.log(`Pressed 3 - Right`);
		// } else if (evt.button === 1) {
		// 	console.log(`Pressed 2 - Middle`);
		// }

		if (Contentblock.ActiveElement) {
			Contentblock.ActiveElement.classList.remove("textblock-contextmenu");
		}
		if (Contentblock.PreviousElement) {
			Contentblock.PreviousElement.classList.remove("textblock-contextmenu");
		}
		Contentblock.PreviousElement = Contentblock.ActiveElement;
		Contentblock.ActiveElement = this.Element;

		if (evt.button === 0) {

			// Contentblock.ClearPreviousElement("PreviousElement_keydown", Contentblock.PreviousElement, "keydown", Contentblock.ElementEventHandlers["PreviousElement_keydown"] );
			// Contentblock.ClearActiveElement("ActiveElement_keydown", Contentblock.ActiveElement, "keydown", Contentblock.ElementEventHandlers["ActiveElement_keydown"] );
	
			Contentblock.ClearPreviousElement("PreviousElement_keydown2", window, "keydown", Contentblock.ElementEventHandlers["PreviousElement_keydown2"] );
			Contentblock.ClearActiveElement("ActiveElement_keydown2", window, "keydown", Contentblock.ElementEventHandlers["ActiveElement_keydown2"] );
	
			// Contentblock.ElementEventHandlers["ActiveElement_keydown"] = (ev)=>{
			// 	console.log(ev.key);
			// };

			this.select();

			Contentblock.ElementEventHandlers["ActiveElement_keydown2"] = (ev)=>{
				console.log(ev.key);
				this.edit(ev);
			};
			// Contentblock.ElementEventHandlers["ActiveElement_keydown"] = Contentblock.ElementEventHandlers["ActiveElement_keydown"];
			// window.addEventListener("keydown", Contentblock.ElementEventHandlers["ActiveElement_keydown"] );
			window.addEventListener("keydown", Contentblock.ElementEventHandlers["ActiveElement_keydown2"] );
		} else if (evt.button === 2) {

			
			this.select();
			Contentblock.ActiveElement.classList.add("textblock-contextmenu");

		}
		const callback = (ev2)=>{
			if (! this.Element.contains(ev2.target)) {
				Contentblock.ActiveElement = undefined;
				this.deselect();
				this.Element.classList.remove("textblock-contextmenu");
				Contentblock.ElementEventHandlers["window_click"] = undefined;
				delete Contentblock.ElementEventHandlers["window_click"];
				window.removeEventListener("click", callback);
				console.log(`removed window click event listener`);
			}
		};
		if (! Object.keys(Contentblock.ElementEventHandlers).includes("window_click")) {
			Contentblock.ElementEventHandlers["window_click"] = callback;
			window.addEventListener("click", Contentblock.ElementEventHandlers["window_click"] );
		}
		console.log(`assigned window click event listener`);



		console.log("Hello! This is the test message!");

	}

};



Contentblock.Once_init();
// end of file