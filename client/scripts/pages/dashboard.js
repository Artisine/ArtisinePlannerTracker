
import {
	queryElement
} from "../client.js";

import {
	UIComponent, UDim, UDim2, Vector2
} from "../ui.js";

export class DashboardUI {
	static ElementReference = queryElement(`section[name="dashboard"]`);
};


export default class Dashboard {
	static UI = DashboardUI;
	static ElementReference = this.UI.ElementReference;

	static onceInit() {

	}
};




const accountDialogue = new UIComponent(queryElement(`div[name="account-dialogue-button"]`), "account-dialogue");
accountDialogue.Position = new UDim2(0, 0, 0, 0);
accountDialogue.Size = new UDim2(0, 250, 0, 3 * parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")) );
accountDialogue.AnchorPoint = new Vector2(0, 0);

const containerLeft = new UIComponent(queryElement(`div[name="account-dialogue-button"] > div[name="container-left"]`), "account-dialogue_container-left");
containerLeft.Position = new UDim2(0, 0, 0, 0);
containerLeft.Size = new UDim2(1, -3 * parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")), 1, 0);
containerLeft.AnchorPoint = new Vector2(0, 0);
containerLeft.setParent(accountDialogue);

const containerRight = new UIComponent(queryElement(`div[name="account-dialogue-button"] > div[name="container-right"]`), "account-dialogue_container-right");
containerRight.Position = new UDim2(1, 0, 0, 0);
containerRight.SizeConstraint = UIComponent.Enum.SizeConstraint.YY;
containerRight.Size = new UDim2(0, 1337, 1, 0);
containerRight.AnchorPoint = new Vector2(1, 0);
containerRight.setParent(accountDialogue);

const icon = new UIComponent(queryElement(`div[name="account-dialogue-button"] > div[name="container-left"] > div[name="icon"]`), "account-dialogue_icon");
icon.Position = new UDim2(0, 20, 0.5, 0);
icon.SizeConstraint = UIComponent.Enum.SizeConstraint.YY;
icon.Size = new UDim2(0, 1337, 0, 2 * parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")));
icon.AnchorPoint = new Vector2(0.5, 0.5);
icon.setParent(containerLeft);

const displayName = new UIComponent(queryElement(`div[name="account-dialogue-button"] > div[name="container-left"] > div[name="displayname"]`), "account-dialogue_displayname");
displayName.Position = new UDim2(1, 0, 0.5, 0);
displayName.SizeConstraint = UIComponent.Enum.SizeConstraint.XY;
displayName.Size = new UDim2(1, -3*parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")), 0.8, 0);
displayName.AnchorPoint = new Vector2(1, 0.5);
displayName.setParent(containerLeft);

accountDialogue.init();




console.info(`%c[dashboard.js] %cReady.`, "color: purple", "color: #333333")
// end of file