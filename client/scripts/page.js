
import * as Utility from "./utility.js";
import TimeService from "./timeservice.js";
import {DatabaseService, NetworkingService} from "./dbnet.js";
import Contentblock, { TextBlock } from "./contentblocks/contentblock.js";

/**
 * @type {number} Snowflake - A unique identifier based on Device Time, Device specs, etc, for 
 * unique identifier.
 */
const Snowflake = Number;


class PageManifestBasic {

	/**
	 * 
	 * @param { {[key: string]: any} } config 
	 */
	constructor(config) {
		this.id = ""; 
		(async()=>{
			const thing = await Utility.CreateSnowflake(new Date(), "");
			// console.log({thing});
			this.id = thing;
		})();
		console.log(this);
		this.title = "";
		this.description = "";
		this.content = ``;
		this.createdAt = Date.now();
		this.updatedAt = Date.now();
		this.createdBy = undefined;
		this.updatedBy = undefined;

		this.elementReference = undefined;


		this.activeSelectedDiv = undefined;


		for (let key in config) {
			this[key] = config[key];
		}
	}

	size() {
		return this.title.length + this.description.length + this.content.length;
	}

	toJSON() {
		return {
			"title": this.title,
			"description": this.description,
			"content": this.content,
			"createdAt": this.createdAt,
			"updatedAt": this.updatedAt,
			"createdBy": this.createdBy,
			"updatedBy": this.updatedBy
		};
	}

	static createFromJSON(jsonObject) {
		return new PageManifestBasic(jsonObject);
	}

	processPageContent() {
		let list = [];
		console.log(this.content);

		let lines = this.content.split("\n\n");
		console.log(lines);
		list = lines.map((str) => {
			const fstr = (()=>{
				if (str.startsWith("\n")) {
					return str.substr(2);
				} else {
					return str;
				}
			})();
			// const p_elem = document.createElement("p");
			const div_elem = document.createElement("div");
			// p_elem.innerHTML = fstr + "<br>";
			div_elem.innerHTML = fstr + "<br>";
			// console.log(p_elem);
			console.log(div_elem);
			// return p_elem;
			return div_elem;
		});

		return list;
	}

	getId() {
		return this.id;
	}
	render() {
		const container = document.createElement("div");
		container.id = "to be set";
		(()=>{
			Utility.Wait(500).then(()=>{
				this.id = this.getId();
				// console.log(this.id);
				return `Page_${this.getId()}`;
			}).then((containerId)=>{
				// console.log(containerId);
				container.id = containerId;
				// console.log(container);
			});
		})();
		// console.log(container);

		container.style.height = "100%";
		container.style.width = "100%";
		container.style.backgroundColor = `white`;
		container.style.zIndex = "4";
		container.style.padding = "50px!important";

		container.classList.add("page");

		const innerContainer = document.createElement("div");
		container.appendChild(innerContainer);
		innerContainer.setAttribute("name", "abc");
		this.processPageContent().forEach((divElem)=>{
			innerContainer.appendChild(divElem);
			divElem.addEventListener("click", ()=>{
				const keyPressCallback = (evt)=>{
					console.log(evt);
					console.log(this.activeSelectedDiv);
					const asd = this.activeSelectedDiv;
					if (evt.key === "Enter") {
						// divElem.innerHTML = divElem.innerHTML + "";
						asd.textContent = `${asd.textContent}\n`;
					} else if (evt.key === "Return" || evt.key === "Backspace") {
						asd.textContent = (()=>{
							const txtCont = asd.textContent;
							return txtCont.substr(0, txtCont.length - 1);
						})();
					} else if (evt.key === "Space" || evt.key == " ") {
						asd.textContent = `${asd.textContent} `;
					} else if ( evt.key.length !== 1 ) {
						// encompasses all the special functional keys
						return 0;
					} else {
						asd.textContent = `${asd.textContent}${evt.key}`;
					}
					return 0;
					// divElem.innerHTML = divElem.innerHTML + evt.key;
				};

				const thing = (evt) => {
					keyPressCallback(evt);
				}

				if (this.activeSelectedDiv !== undefined) {
					console.log(`Was not undefined`);
					// clear the currently selected one's event handlers
					this.activeSelectedDiv.removeEventListener("keydown", thing);
					this.activeSelectedDiv.style.border = "";
					this.activeSelectedDiv = undefined;
				}

				this.activeSelectedDiv = divElem;
				console.log(this.activeSelectedDiv);
				this.activeSelectedDiv.addEventListener("keydown", thing);
				this.activeSelectedDiv.style.border = "1px solid red";
				console.log(`${this.activeSelectedDiv.textContent.substr(0, 7)} div has focus now`);

				// divElem.addEventListener("focusout", ()=>{
				// 	console.log(`${divElem.textContent.substr(0, 7)} div now OUT of focus.`);
				// });
			});


		});

		this.elementReference = container;
		PageService.ElementReference_PageSpace.appendChild(container);
	}


};
PageManifestBasic.prototype.toString = function() {
	return JSON.stringify(this.toJSON(), null, 4);
};



export default class PageService {
	static Name = "PageService";

	/**
	 * @type {Map<Snowflake, Page>} GlobalMap
	 */
	static GlobalMap = new Map();

	/**
	 * @typedef {undefined | Object} TablePages;
	 */
	static TablePages = undefined;

	static ElementReference_PageSpace = document.querySelector(`#dashboard-content_pagespace`);


	static Write_PageManifestBasic_ToIndexedDB() {

	}

	static once_init() {
		console.log("hi");

		this.TablePages = (DatabaseService.CheckExists_LocalStorage_Table("PageServiceTable")) ? (DatabaseService.Get_LocalStorage_Table("PageServiceTable")) : (DatabaseService.Create_LocalStorage_Table("PageServiceTable"));
		console.log(`%c[${this.Name}]%c TablePages = `, "color:purple", "color:grey");
		console.log(this.TablePages);

// 		const bob = new PageManifestBasic({
// 			title: "Bob is too cool for you.",
// 			description: "the life story of Bob.",
// 			content: `
// So, like, this is the story,
// of a man named Stanley
// Working in an office hunched over a desk all day
// he desperately wished for something to whisk him away
// But then one day the orders stopped coming in
// He was free, in the office known as Print Of Bel Air
// 			`
// 		});
// 		this.TablePages.Storage.set(bob.title, bob);
// 		DatabaseService.Save_LocalStorage_state();

		// console.log(`Bob\'s page = `, this.TablePages.Storage.get("Bob is too cool for you.") );



		const abc = new PageManifestBasic({
			title: "Ur fat",
			description: "Fat.",
			content: `Hi there.
You are not okay. But it's okay to be not okay. Inspirational speech here yeehaw. Long text to span to next line.
Immediate next line, shouldn't break off to hard?

I know. :(
This is sad.


Awooga







Amogus?
bye.`
		});
		// abc.render();


		// const sam = new Contentblock();
		// sam.init().then(rendered=>{
		// 	// console.log(thing);
		// 	// const rendered = thing.render();
		// 	document.querySelector("#dashboard-content_pagespace").appendChild(rendered);
		// 	console.log("Appended the rendered thing to pagespace");
		// });

		const jack = new TextBlock();
		jack.init().then(rendered=>{
			// const rendered = thing.render();
			// document.querySelector("#dashboard-content_pagespace").appendChild(rendered);
			rendered.Contentblock.setParent(document.querySelector("#dashboard-content_pagespace"));
			jack.setTextAndDisplayText(`To be, or not to be. That, is the question. Were it not for the hooded man who goes nigh on the River Styx, one would seek to venture and explore the underworld. Alas, the gates of Hell are guarded by an ephemeral protector, a three-headed canine with parched appetite for Human.`);
			console.log(`Appended the second render to pagespace`);
		});


	}
};