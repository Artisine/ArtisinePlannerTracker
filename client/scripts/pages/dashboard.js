
function print(...args) {
	console.log(args);
}
import {
	queryElement
} from "../client.js";

import {
	UIComponent, UDim, UDim2, Vector2
} from "../ui.js";

export class DashboardUI {
	static ElementReference = queryElement(`section[name="dashboard"]`);
	static Debounces = {
		"setup_dragger": false,
		"Setup_HelpButton": false,
		"Setup_HelpMenu": false
	};
	static Variables = {
		"SidebarMinimumWidth": undefined,
		"SidebarWidth": undefined,
		"SidebarMaximumWidth": undefined,
		"SidebarDefaultWidth": undefined,
		"SidebarElement": undefined,
		"DraggerWidth": undefined,
		"DraggerElement": undefined,
		"MousePositionX": undefined,
		"FloatingHelpButtonElement": undefined,
		"FloatingHelpButtonActive": false,
		"FloatingHelpButtonClickObserver": undefined,
		"FloatingHelpMenuElement": undefined,
		"FloatHelpContainerElement": undefined
	};

	/**
	 * @param {Map<number, UIComponent>} UIComponents - UI's UIComponents.
	 */
	static UIComponents = new Map();

	static get_css_variable(varName) {
		const val = window.getComputedStyle(document.documentElement).getPropertyValue(varName);
		// console.log(`key = ${varName}, val = ${val}`);
		return val;
	}
	static set_css_variable(varName, val) {
		document.documentElement.style.setProperty(varName, val);
		// console.log(`key = ${varName}, set to ${val}`);
	}

	static setup_sidebar_dragger() {
		if (this.Debounces.setup_dragger) return 1;
		this.Debounces.setup_dragger = true;

		this.Variables.SidebarElement = document.querySelector("#dashboard_sidebar");
		this.Variables.DraggerElement = document.querySelector("#dashboard_sidebar_dragger");
		
		const cssVar_dashboardSidebarMinWidth = this.get_css_variable("--dashboard-sidebar-minWidth");
		const cssVar_dashboardSidebarWidth = this.get_css_variable("--dashboard-sidebar-width");
		const cssVar_dashboardSidebarMaxWidth = this.get_css_variable("--dashboard-sidebar-maxWidth");
		const cssVar_dashboardSidebarDefaultWidth = this.get_css_variable("--dashboard-sidebar-defaultWidth");
		const cssVar_dashboardSidebarDraggerWidth = this.get_css_variable("--dashboard-sidebar-dragger-width");
		this.Variables.SidebarMinimumWidth = parseFloat(cssVar_dashboardSidebarMinWidth);
		this.Variables.SidebarWidth = parseFloat( cssVar_dashboardSidebarWidth );
		this.Variables.SidebarMaximumWidth = parseFloat(cssVar_dashboardSidebarMaxWidth);
		this.Variables.SidebarDefaultWidth = parseFloat(cssVar_dashboardSidebarDefaultWidth);
		this.Variables.DraggerWidth = parseFloat( cssVar_dashboardSidebarDraggerWidth );


		this.Variables.DraggerElement.addEventListener("mousedown", (e)=>{
			console.log("mouse down on dragger");
			this._sidebarDraggerMousedown(e);
		}, false);
		this.Variables.DraggerElement.addEventListener("mouseup", ()=>{
			console.log("MOUSE UP");
			this._sidebarDraggerMouseup();
		}, false);

		// console.log(`Variable name: dashboard-sidebar-dragger-width ; Value = ${cssVar_dashboardSidebarDraggerWidth}`);
		// console.log(this.Variables);
	}

	static _sidebarDraggerResize(e) {
		const dx = this.Variables.MousePositionX - e.x;
		this.Variables.MousePositionX = e.x;

		// console.log(this.Variables);

		this.Variables.SidebarWidth = this.Variables.SidebarWidth - dx;

		if (this.Variables.SidebarWidth < this.Variables.SidebarMinimumWidth) {
			this.Variables.SidebarWidth = this.Variables.SidebarMinimumWidth;
			this.set_css_variable("--dashboard-sidebar-width", `${this.Variables.SidebarWidth}px`);
			this._sidebarDraggerMouseup();
		} else if (this.Variables.SidebarWidth > this.Variables.SidebarMaximumWidth) {
			this.Variables.SidebarWidth = this.Variables.SidebarMaximumWidth;
			this.set_css_variable("--dashboard-sidebar-width", `${this.Variables.SidebarWidth}px`);
			this._sidebarDraggerMouseup();
		} else {
			this.set_css_variable("--dashboard-sidebar-width", `${this.Variables.SidebarWidth}px`);
			
		}
	}
	static _sidebarDraggerMousemove(e) {
		DashboardUI._sidebarDraggerResize(e);
	}
	static _sidebarDraggerMousedown(e) {
		e.preventDefault();
		if (e.offsetX < this.Variables.DraggerWidth) {
			this.Variables.MousePositionX = e.x;
			document.addEventListener("mousemove", DashboardUI._sidebarDraggerMousemove, false);
		}
	}
	static _sidebarDraggerMouseup() {
		document.removeEventListener("mousemove", DashboardUI._sidebarDraggerMousemove, false);

		if ( Math.abs(this.Variables.SidebarDefaultWidth - this.Variables.SidebarWidth) <= 25 ) {
			// snap to default width if within 25px either side
			this.Variables.SidebarWidth = this.Variables.SidebarDefaultWidth;
			this.set_css_variable("--dashboard-sidebar-width", `${this.Variables.SidebarWidth}px`);
			// this._sidebarDraggerMouseup();
			console.log(`Snapped sidebar back to default width ${this.Variables.SidebarDefaultWidth}px`);
		} 
		const uic_accountDialogue = [...this.UIComponents.values()].find((item) => item.Name === "account-dialogue");
		if (uic_accountDialogue !== undefined && uic_accountDialogue.render !== undefined) {
			uic_accountDialogue.Size = new UDim2(0, this.Variables.SidebarWidth, 0, parseFloat( this.get_css_variable("--dashboard-sidebar-account-dialogue-height")) * parseFloat(this.get_css_variable("font-size")) );
			uic_accountDialogue.render();
		}
		const uic_utilityButtons = [...this.UIComponents.values()].find((item) => item.Name === "utility-buttons");
		if (uic_utilityButtons !== undefined && uic_utilityButtons.render !== undefined) {
			uic_utilityButtons.Size = new UDim2(0, this.Variables.SidebarWidth, 0, uic_utilityButtons.Size.Y.Offset);
			uic_utilityButtons.render();
		}
		
	}

	static setup_sidebar_uiComponents() {

		const accountDialogue = new UIComponent(queryElement(`div[name="account-dialogue-button"]`), "account-dialogue");
		accountDialogue.Position = new UDim2(0, 0, 0, 0);
		// accountDialogue.Size = new UDim2(0, this.Variables.SidebarWidth, 0, 3 * parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")) );
		accountDialogue.Size = new UDim2(0, this.Variables.SidebarWidth, 0, parseFloat( this.get_css_variable("--dashboard-sidebar-account-dialogue-height")) * parseFloat(this.get_css_variable("font-size"))  );

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
		icon.Size = new UDim2(0, 1337, 0, 1.5 * parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")));
		icon.AnchorPoint = new Vector2(0.5, 0.5);
		icon.setParent(containerLeft);
		
		const displayName = new UIComponent(queryElement(`div[name="account-dialogue-button"] > div[name="container-left"] > div[name="displayname"]`), "account-dialogue_displayname");
		displayName.Position = new UDim2(1, 0, 0.5, 0);
		displayName.SizeConstraint = UIComponent.Enum.SizeConstraint.XY;
		displayName.Size = new UDim2(1, -3*parseFloat(window.getComputedStyle(queryElement("body")).getPropertyValue("font-size")), 0.5, 0);
		displayName.AnchorPoint = new Vector2(1, 0.5);
		displayName.setParent(containerLeft);

		

		accountDialogue.init();
		// console.log([...this.UIComponents.values()]);


		const utilityButtons = new UIComponent(queryElement(`#dashboard_sidebar div[name="utility-buttons"]`), "utility-buttons");
		UIComponent.ApplyProperties(utilityButtons, {
			Position: new UDim2(0, 0, 0, (parseFloat( this.get_css_variable("--dashboard-sidebar-account-dialogue-height")) + 1) * parseFloat(this.get_css_variable("font-size")) ),
			SizeConstraint: UIComponent.Enum.SizeConstraint.XY,
			Size: new UDim2(0, this.Variables.SidebarWidth, 0, 100),
			AnchorPoint: new Vector2(0, 0)
		});
		// const 
		utilityButtons.init();

		[accountDialogue, containerLeft, containerRight, icon, displayName, utilityButtons].map((uic) => [uic.id, uic]).forEach((arr) => {
			this.UIComponents.set(arr[0], arr[1]);
			// console.log(`${arr[0]}, ${arr[1]}, `, this.UIComponents.get(arr[0]));
		});
	}



	static setup_helpButton() {
		if (this.Debounces.Setup_HelpButton) return 1;
		this.Debounces.Setup_HelpButton = true;

		this.Variables.FloatHelpContainerElement = document.querySelector(`#dashboard_help_help-container`);
		this.Variables.FloatingHelpMenuElement = document.querySelector(`#dashboard_help_help-menu`);
		this.Variables.FloatingHelpButtonElement = document.querySelector(`#dashboard_help_help-button`);
		this.Variables.FloatingHelpButtonActive = false;

		// console.log(this.Variables);

		this.Variables.FloatingHelpButtonElement.addEventListener("click", ()=>{
			if (this.Variables.FloatingHelpButtonActive) {
				// true -> false
				this.Variables.FloatingHelpButtonActive = false;
				this.Variables.FloatingHelpMenuElement.style.display = "none";
				this.Variables.FloatingHelpMenuElement.style.transition = "opacity 1s";
				this.Variables.FloatingHelpMenuElement.style.opacity = "0";

				try {
					window.removeEventListener("mouseup", this.Variables.FloatingHelpButtonClickObserver);

				} catch(e) {
					console.log(`Thingy: ${e}`);
				}

			} else {
				// false -> true
				this.Variables.FloatingHelpButtonActive = true;
				this.Variables.FloatingHelpMenuElement.style.display = "block";
				this.Variables.FloatingHelpMenuElement.style.transition = "opacity 1s";
				this.Variables.FloatingHelpMenuElement.style.opacity = "1";


				const callback = (e)=>{
					e.preventDefault();
					// console.log(e.target, this.Variables.FloatHelpContainerElement);
					// window.removeEventListener("click", callback);
					// return 0;
					const isDescendent = this.Variables.FloatHelpContainerElement.contains(e.target);
					// console.log(e.target, ` ${(isDescendent) ? ("is") : ("Is NOT")} a descendent of ${this.Variables.FloatHelpContainerElement.id}`);
					
					if ( !isDescendent ) {
						window.removeEventListener("mouseup", this.Variables.FloatingHelpButtonClickObserver);
						e.preventDefault();
						this.Variables.FloatingHelpButtonActive = false;
						this.Variables.FloatingHelpMenuElement.style.display = "none";
						this.Variables.FloatingHelpMenuElement.style.transition = "opacity 1s";
						this.Variables.FloatingHelpMenuElement.style.opacity = "0";



					}
				};
				this.Variables.FloatingHelpButtonClickObserver = callback;
				window.addEventListener("mouseup", this.Variables.FloatingHelpButtonClickObserver);
			}
		});

		console.log(`Setup_helpButton done`);
		this.setup_helpMenu();
	}
	static setup_helpMenu() {
		if (this.Debounces.Setup_HelpMenu) return 1;
		this.Debounces.Setup_HelpMenu = true;

		const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
		document.querySelector(`#dashboard_help_info_device-type`).innerHTML = (isMobile) ? ("Mobile") : ("Desktop");
		

		console.log(`Help Menu setup procedure`);
	}

};


export default class Dashboard {
	static UI = DashboardUI;
	static ElementReference = this.UI.ElementReference;

	static onceInit() {
		this.UI.setup_sidebar_dragger();
		this.UI.setup_sidebar_uiComponents();
		this.UI.setup_helpButton();

		const alphabet = "abcdefghijklmnopqrstuvwxyz";
		let k = 0;
		setInterval(()=>{
			const icon_text = document.querySelector(`div[name="account-dialogue-button"] div[name="icon"] span`);
			icon_text.innerHTML = `${alphabet[k].toUpperCase()}`;
			k += 1;
			if (k >= alphabet.length) k = 0;
		}, 1000/2);


		document.querySelector(`#dashboard_content>div[name="float-help"]>div[name="button-container"]`).addEventListener("mouseover", ()=>{
			console.log(`hovering on button container`);
		});
	}
};








Dashboard.onceInit();

console.info(`%c[dashboard.js] %cReady.`, "color: purple", "color: #333333")
// end of file