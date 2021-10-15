
import * as Utility from "./utility.js";
import TimeService from "./timeservice.js";
import {DatabaseService, NetworkingService} from "./dbnet.js";

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
		// this.id = Utility.CreateSnowflake(new Date(), "");
		this.title = "";
		this.description = "";
		this.content = ``;
		this.createdAt = Date.now();
		this.updatedAt = Date.now();
		this.createdBy = undefined;
		this.updatedBy = undefined;

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


	render() {
		const container = document.createElement("div");
		// container.id = `Page_${this.id}`;

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

		console.log(`Bob\'s page = `, this.TablePages.Storage.get("Bob is too cool for you.") );

	}
};