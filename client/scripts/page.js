
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



class PageMarkup extends HTMLDivElement {
	constructor(associatedPage) {
		super();

		/**
		 * @param {undefined | Page} Page - The associated Page.
		 */
		this.Page = associatedPage;

		this.SubElements = {};

		this.init();
	}


	init() {
		this.createMarkup();
	}


	createMarkup() {

		(async ()=>{
			this.setAttribute("name", `page-${await this.Page.Id_Promise}`);
			this.setAttribute("id", this.getAttribute("name"));
		})();
		// this.classList.add("textblock", "contentblock");
		this.classList.add("page");



		const pageSplash = document.createElement("div");
		pageSplash.classList.add("page-splash");
		const headerImage = document.createElement("div");
		headerImage.classList.add("header-image");
		// headerImage.style.backgroundImage = `url("../unsplash-images/alexander-schimmeck-18YAaOcqA8o-unsplash.jpg")`;
		// headerImage.style.backgroundSize = "auto";
		// headerImage.style.backgroundPosition = "left top";
		// headerImage.style.backgroundAttachment = "local";
		// const img = document.createElement("img");
		// img.src = "../unsplash-images/alexander-schimmeck-18YAaOcqA8o-unsplash.jpg";
		// img.style.width = "100%";
		// img.style.height = "100%";
		// img.style.maxWidth = "100%";
		// img.style.backgroundAttachment = "local";
		// img.style.backgroundSize = "auto";
		// headerImage.append(img);
		pageSplash.append(headerImage);

		const pageHeader = document.createElement("div");
		pageHeader.classList.add("page-header");
		const headerTitle = document.createElement("div");
		headerTitle.classList.add("header-title");
		const h1 = document.createElement("h1");
		h1.textContent = this.Page.Title;
		h1.setAttribute("contenteditable", "true");
		headerTitle.append(h1);
		pageHeader.append(headerTitle);

		const pageContent = document.createElement("div");
		pageContent.classList.add("page-content");
		const pageContentStorage = document.createElement("div");
		pageContentStorage.classList.add("page-content-storage");
		pageContent.append(pageContentStorage);


		this.append(pageSplash, pageHeader, pageContent);

		this.SubElements.PageSplash = pageSplash;
		this.SubElements.PageSplash.HeaderImage = headerImage;
		this.SubElements.PageHeader = pageHeader;
		this.SubElements.PageHeader.HeaderTitle = headerTitle;
		this.SubElements.PageHeader.HeaderTitle.H1 = h1;
		this.SubElements.PageContent = pageContent;
		this.SubElements.PageContent.PageContentStorage = pageContentStorage;


		// return this;
		console.log(`Made PageMarkup.`);
	}

};

class Page {
	constructor() {
		this.Id = undefined;

		this.Id_Promise = Utility.CreateSnowflake(new Date(), "Page");
		this.Id_Promise.then((generatedSnowflake) => {
			this.Id = generatedSnowflake;
		}).catch(reason => console.error);

		this.Title = "";
		this.Description = "";
		this.Content = ``;
		this.CreatedAt = Date.now();
		this.UpdatedAt = Date.now();
		this.CreatedBy = undefined;
		this.UpdatedBy = undefined;

		/**
		 * @type {HTMLElement} Element - This Page's physical Element reference
		 */
		this.Element = undefined;

		/**
		 * @type {Map<string, Contentblock>} ContentBlocks - This Page's ContentBlocks
		 */
		this.ContentBlocks = new Map();

		
	}

	init() {
		this.selfLog(`Init() method executed.`);

		return new Promise((resolve, reject) => {
			resolve( this.render() );
		});
	}

	selfLog(...message) {
		console.trace(`${new Date(Date.now()).toUTCString()}\n%c${this.ClassName} %c"${this.Name}" %c#%c${this.Id} %c: ${message.join("\n")}`,
		"color:navy", "color:cornflowerblue", "color:black", "color:grey", "color:black");
	}

	add_new_TextBlock() {
		const newThing = new TextBlock();
		this.ContentBlocks.set(newThing.Id, newThing);

		function setEndOfContenteditable(contentEditableElement) {
			var range, selection;
			if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
			{
				range = document.createRange();//Create a range (a range is a like the selection but invisible)
				range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				selection = window.getSelection();//get the selection object (allows you to change selection)
				selection.removeAllRanges();//remove any selections already made
				selection.addRange(range);//make the range you have just created the visible selection
			}
			else if(document.selection)//IE 8 and lower
			{ 
				range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
				range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				range.select();//Select the range (make it the visible selection
			}
		}

		newThing.init().then((markup) => {
			this.Element.SubElements.PageContent.PageContentStorage.append(markup);
			console.log(`Attempting to focus/click new TextBlock ${markup.Contentblock.Name}`);
			markup.setAttribute("tabindex", "1337");
			// markup.custom_focus();
			markup.SubElements.TextHolder.focus();
			setEndOfContenteditable(markup.SubElements.TextHolder);
		});


		
		// 	setCaretAtStartEnd(editableElm, idx) 
		

		// function setCaretAtStartEnd( node, atEnd ){
		// 	const sel = document.getSelection();
		// 	node = node.firstChild;

		// 	if( sel.rangeCount ){
		// 		['Start', 'End'].forEach(pos =>
		// 			sel.getRangeAt(0)["set" + pos](node, atEnd ? node.length : 0)
		// 		)
		// 	}
		// }
	}

	setup_hooks() {
		// this.Element.addEventListener("keydown", (evt) => {
		// 	evt.preventDefault();
		// 	console.log("prevent default'd");
		// });

		this.Element.SubElements.PageHeader.HeaderTitle.H1.addEventListener("keydown", (evt)=>{
			evt.preventDefault();
			this.whenTitle_newline(evt);
		});
	}
	whenTitle_newline(evt) {
		evt.target.blur();
		this.add_new_TextBlock();
		
	}

	render() {
		const div = new PageMarkup(this);
		div.setAttribute("is", "page-markup");
		this.selfLog(`Rendered Markup.`);

		this.Element = div;

		this.setup_hooks();
		return this.Element;
	}


	setTitle(title) {
		this.Title = title;
		return this;
	}

}


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

	static register_custom_PageMarkup_element() {
		window.customElements.define("page-markup", PageMarkup, {
			extends: "div"
		});
	}

	static once_init() {
		PageService.register_custom_PageMarkup_element();
		console.log("hi");

		// this.TablePages = (DatabaseService.CheckExists_LocalStorage_Table("PageServiceTable")) ? (DatabaseService.Get_LocalStorage_Table("PageServiceTable")) : (DatabaseService.Create_LocalStorage_Table("PageServiceTable"));
		// console.log(`%c[${this.Name}]%c TablePages = `, "color:purple", "color:grey");
		// console.log(this.TablePages);


		const bobThePage = new Page();
		bobThePage.setTitle(`Bob the Page says Hello!`);
		// bobThePage.add_new_TextBlock();
		console.log(bobThePage);
		bobThePage.init().then((markup) => {
			document.querySelector("#dashboard-content_pagespace").append(markup);
			console.log(`Appended to pagespace`);
		}).catch(console.error);
		console.log(bobThePage);

		

	}
};