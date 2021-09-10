
import {
	queryElement
} from "../client.js";


export class DashboardUI {
	static ElementReference = queryElement(`section[name="dashboard"]`);
}


export default class Dashboard {
	static UI = DashboardUI;
	static ElementReference = this.UI.ElementReference;

	static onceInit() {

	}
}




console.info(`%c[dashboard.js] %cReady.`, "color: purple", "color: #333333")
// end of file