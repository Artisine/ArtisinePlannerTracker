
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

		// (async ()=>{
		// 	this.setAttribute("name", `page-${await this.Page.Id_Promise}`);
		// 	this.setAttribute("id", this.getAttribute("name"));
		// })();
		this.setAttribute("name", `page-${this.Page.Id}`);
		this.setAttribute("id", this.getAttribute("name"));
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
		this.Id = Utility.CreateSnowflake(new Date(), "AccountName");
		this.ClassName = "Page";
		this.Name = "Page";

		// this.Id_Promise = Utility.CreateSnowflake(new Date(), "Page");
		// this.Id_Promise.then((generatedSnowflake) => {
		// 	this.Id = generatedSnowflake;
		// }).catch(reason => console.error);

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


		this.BlocksInfo = {
			"BlockAtTop": undefined,
			"BlockAtBottom": undefined
		};

		
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


	/**
	 * 
	 * @param {Number} positionNumber 
	 * @returns {undefined | Contentblock} 
	 */
	GetBlockByPosition(positionNumber) {
		const block = [...this.ContentBlocks.values()].find((item)=>{
			if (item.Position === positionNumber) {
				return item;
			}
		});
		return block;
	}

	DefineBlocksPositionsUsingHeight() {
		const blocks = [...this.ContentBlocks.values()];
		/**
		 * @type { [string, number][] } id_height
		 */
		let id_height = [];
		for (let block of blocks) {
			// const distanceY = block.Element.scrollTop;
			const distanceY = block.Element.offsetTop;
			id_height.push(
				[block.Id, distanceY]
			);
		}
		// alert(`id_height ${JSON.stringify(id_height)}`);
		console.info(`id_height: `, id_height);
		for (let k=0; k<blocks.length; k+=1) {
			for (let i=0; i<blocks.length-1; i+=1) {
				if ( id_height[i][1] > id_height[i+1][1] ) {
					[ id_height[i], id_height[i+1] ] = [ id_height[i+1], id_height[i] ];
				}
			}
		}
		// alert(`id_height ${JSON.stringify(id_height)}`);
		console.info(`id_height: `, id_height);

		id_height.forEach((subarray, index) => {
			const [blockId, distanceY] = subarray;
			this.ContentBlocks.get(blockId).Position = index + 1;
		});

		this.BlocksInfo.BlockAtTop = this.ContentBlocks.get( id_height[0][0] );
		this.BlocksInfo.BlockAtBottom = this.ContentBlocks.get( id_height[id_height.length - 1][0] );
		
	}







	async add_new_TextBlock() {
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
			// console.log(`${markup} page = ${markup.Contentblock.Page}`);
			// markup.Contentblock.Page = this;
			newThing.Page = this;
			console.log(`${newThing.Name} Page set to ${this.Name}`);
			// console.log(`${markup} page = ${markup.Contentblock.Page}`);

			// console.log(`markup contentblock Page = `, markup.Contentblock.Page);
			this.Element.SubElements.PageContent.PageContentStorage.append(markup);
			console.log(`Attempting to focus/click new TextBlock ${markup.Contentblock.Name}`);
			// markup.setAttribute("tabindex", "1337");
			// markup.custom_focus();
			markup.SubElements.TextHolder.focus();
			setEndOfContenteditable(markup.SubElements.TextHolder);

			this.DefineBlocksPositionsUsingHeight();
		});


		return newThing;
	}

	// /**
	//  * 
	//  * @param {Contentblock.BlockTypeEnum} blockTypeEnum 
	//  * @param {*} position 
	//  */
	// async insert_block(blockTypeEnum, position=undefined) {
	// 	if (blockTypeEnum === 1) {
	// 		if (position !== undefined && typeof position === "number") {
	// 			position = Math.round(position);
				
	// 			const entriesArray = [...this.ContentBlocks.entries()];
	// 			console.log(`ContentBlocks Entries Array`, entriesArray);

	// 			let shiftIndex = 0;

	// 			const sizePageBlocks = this.ContentBlocks.size;
	// 			if (position > sizePageBlocks) {
	// 				position = sizePageBlocks;
	// 				shiftIndex = 0;

	// 				entriesArray[position] = (async()=>{
	// 					const block = new TextBlock();
	// 					return [block.Id, block];
	// 				})();
	// 			}
	// 			if (position < 0) {
	// 				position = 0;
	// 				shiftIndex = 1;

	// 				const block = new TextBlock();

	// 				entriesArray.unshift( [block.Id, block] );
	// 			}




	// 			this.ContentBlocks = new Map(entriesArray);

	// 			console.log(this.ContentBlocks);

	// 		}
	// 	} else {
	// 		const txtblock = await this.add_new_TextBlock();
	// 		txtblock.focus();
	// 	}
	// }

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

		this.Element.addEventListener("click", (evt)=>{
			console.log(evt.target);
			PageService.RecentInteractedPage = this;

			const blocks = [... this.ContentBlocks.values()];
			console.log(blocks);

			/**
			 * @type {undefined | Contentblock} thing
			 */
			const thing = blocks.find((item)=>{
				return (item.Element === evt.target || item.Element.contains(evt.target));
			});
			console.log(`thing = `, thing);
			console.log(`Page ContentBlocks = `, this.ContentBlocks);
			console.log(`Contentblock Map = `, Contentblock.GlobalMap);
			if (thing !== undefined) {
				thing.focus();
			} else {
				if (Contentblock.ActiveBlock) {
					Contentblock.ActiveBlock.unfocus();
				}
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
	 * @type {undefined | Page} RecentInteractedPage - The most recently viewed Page
	 */
	static RecentInteractedPage = undefined;

	/**
	 * @type {Map<Snowflake, Page>} GlobalMap
	 */
	static GlobalMap = new Map();

	/**
	 * @type {undefined | Object} TablePages;
	 */
	static TablePages = undefined;

	static ElementReference_PageSpace = document.querySelector(`#dashboard-content_pagespace`);


	static async CreateNewPage(name="Page") {
		const newPage = new Page();
		newPage.setTitle(name);
		newPage.init().then((markup) => {
			PageService.ElementReference_PageSpace.append(markup);
			// console.log(`Appended to pagespace`);
		}).catch(console.error);
		console.log(newPage);

		PageService.GlobalMap.set(newPage.Id, newPage);

		return newPage;
	}



	static Write_PageManifestBasic_ToIndexedDB() {

	}

	static register_custom_PageMarkup_element() {
		window.customElements.define("page-markup", PageMarkup, {
			extends: "div"
		});
	}

	static async once_init() {
		PageService.register_custom_PageMarkup_element();
		console.log("hi");

		// this.TablePages = (DatabaseService.CheckExists_LocalStorage_Table("PageServiceTable")) ? (DatabaseService.Get_LocalStorage_Table("PageServiceTable")) : (DatabaseService.Create_LocalStorage_Table("PageServiceTable"));
		// console.log(`%c[${this.Name}]%c TablePages = `, "color:purple", "color:grey");
		// console.log(this.TablePages);


		// const bobThePage = new Page();
		// bobThePage.setTitle(`Bob the Page says Hello!`);
		// // bobThePage.add_new_TextBlock();
		// console.log(bobThePage);
		// bobThePage.init().then((markup) => {
		// 	document.querySelector("#dashboard-content_pagespace").append(markup);
		// 	console.log(`Appended to pagespace`);
		// }).catch(console.error);
		// console.log(bobThePage);

		const bobThePage = await PageService.CreateNewPage("Bob The Page - says: Hello World! More text to overflow on to the next line? If you press Enter on this Title text, it'll create a new TextBlock below to type within. The lack of line-breaks is intentional.");
		// bobThePage.insert_block(Contentblock.BlockTypeEnum.TextBlock);
		// bobThePage.insert_block(Contentblock.BlockTypeEnum.TextBlock, 0);
		// bobThePage.insert_block(Contentblock.BlockTypeEnum.TextBlock, 1);
		// bobThePage.insert_block(Contentblock.BlockTypeEnum.TextBlock, 0);



	}
};