
import * as Utility from "./utility.js";
import TimeService from "./timeservice.js";
import {DatabaseService, NetworkingService} from "./dbnet.js";
import Contentblock, { TextBlock } from "./contentblocks/contentblock.js";

/**
 * @type {number} Snowflake - A unique identifier based on Device Time, Device specs, etc, for 
 * unique identifier.
 */
const Snowflake = Number;




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
	static ClassName = "Page";

	constructor() {
		this.Id = undefined;
		this.ClassName = "Page";
		this.Name = "Page";

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

	async add_new_TextBlock() {
		const newThing = new TextBlock();
		this.ContentBlocks.set(await newThing.Id_Promise, newThing);

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

		await newThing.init().then((markup) => {
			markup.Contentblock.Page = this;
			console.log(`markup contentblock Page = `, markup.Contentblock.Page);
			this.Element.SubElements.PageContent.PageContentStorage.append(markup);
			console.log(`Attempting to focus/click new TextBlock ${markup.Contentblock.Name}`);
			markup.setAttribute("tabindex", "1337");
			// markup.custom_focus();
			markup.SubElements.TextHolder.focus();
			setEndOfContenteditable(markup.SubElements.TextHolder);
		});


		return newThing;
	}

	setup_hooks() {
		// this.Element.addEventListener("keydown", (evt) => {
		// 	evt.preventDefault();
		// 	console.log("prevent default'd");
		// });

		this.Element.SubElements.PageHeader.HeaderTitle.H1.addEventListener("keydown", (evt)=>{
			if (evt.key === "Enter") {
				evt.preventDefault();
				this.whenTitle_newline(evt);
			}
		});
	}
	async whenTitle_newline(evt) {
		evt.target.blur();
		const newTextBlock = await this.add_new_TextBlock();
		newTextBlock.focus();
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

	static Page = Page;

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