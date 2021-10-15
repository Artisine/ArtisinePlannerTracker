


export class UDim {
	/**
	 * 
	 * @param {number} scale 
	 * @param {number} offset 
	 */
	constructor(scale, offset) {
		this.Scale = scale;
		this.Offset = offset;
	}

	/**
	 * 
	 * @param {UDim} otherUDim 
	 */
	add(otherUDim) {
		return new UDim(this.Scale + otherUDim.Scale, this.Offset + otherUDim.Offset);
	}
};
export class UDim2 {
	/**
	 * @param {number} scaleX 
	 * @param {number} offsetX 
	 * @param {number} scaleY 
	 * @param {number} offsetY 
	 */
	constructor(scaleX, offsetX, scaleY, offsetY) {
		this.X = new UDim(scaleX, offsetX);
		this.Y = new UDim(scaleY, offsetY);
	};

	/**
	 * 
	 * @param {UDim2} otherUDim2 
	 */
	add(otherUDim2) {
		return new UDim2(
			this.X.Scale + otherUDim2.X.Scale,
			this.X.Offset + otherUDim2.X.Offset,
			this.Y.Scale + otherUDim2.Y.Scale,
			this.Y.Offset + otherUDim2.Y.Offset
		);
	}
};
export class Vector2 {
	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x, y) {
		this.X = x;
		this.Y = y;
		this.Magnitude = undefined;
	}
	Magnitude() {
		this.Magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
		return this.Magnitude;
	}
	add(vec2) {
		if (vec2 instanceof Vector2) {
			return new Vector2(this.X + vec2.X, this.Y + vec2.Y);
		}
	}
	sub(vec2) {
		if (vec2 instanceof Vector2) {
			return new Vector2(this.X - vec2.X, this.Y - vec2.Y);
		}
	}
	mul(thing, mode="dot") {
		if (thing instanceof Vector2) {
			if (mode === "dot") {
				return this.X * thing.X + this.Y * thing.Y;
			} else if (mode === "cross") {
				// mathematical hack
				//returns only the Z-axis of the resulting 3D Vector
				return this.X * thing.Y - this.Y * thing.X;
			}
		} else if (typeof thing === "number") {
			return new Vector2(this.X * thing, this.Y * thing);
		}
	}
};


export class UIComponent {
	static _Count = 1;

	/**
	 * @param {Map<number, UIComponent>} GlobalMap - A global storage object for UIComponents.
	 * @type {Map<number, UIComponent>} GlobalMap;
	 */
	static GlobalMap = new Map();

	static Enum = {
		SizeConstraint: {
			"XX": 1,
			"XY": 2,
			"YY": 3
		}
	};

	static VerboseLogging = false;

	static ApplyProperties(instanceToApplyOn, config) {
		for (let key in config) {
			if (key in instanceToApplyOn) {
				instanceToApplyOn[key] = config[key];
				if (this.VerboseLogging) console.log(`${instanceToApplyOn.Name} changed ${key} to ${config[key]}`);
			}
		}
	}




	/**
	 * 
	 * @param {HTMLElement} elementReference 
	 * @param {string} name
	 */
	constructor(elementReference, name) {
		this.id = UIComponent._Count++;
		this.elementReference = elementReference;

		/**
		 * @param {string} Name - A non-unique identifier for a UIComponent. Used for logging purposes.
		 */
		this.Name = name;

		/**
		 * @param {Vector2} AnchorPoint - Anchor points define where the bounding box of an UI Component begins
		 * 
		 * 0 means starts from the left, 1 means from the right. 0.5 is middle. Applies for both X and Y axes.
		 */
		this.AnchorPoint = new Vector2(0, 0);

		/**
		 * @param {UDim2} Position - Position describes the on-screen placement of an UI Component.
		 * 
		 * A UDim is used to describe X and Y translation in respect to the Origin, usually the top-left corner of the screen,
		 * however the pivot to translate-about can be modified by changing the UIComponent's AnchorPoint.
		 */
		this.Position = new UDim2(0, 0, 0, 0);

		/**
		 * @param {UDim2} Size - Size describes the scaling of UI Components. There is equal "bits" of a component on either side
		 * of the UIComponent's Position.
		 */
		this.Size = new UDim2(0, 0, 0, 0);

		/**
		 * @param {Vector2} AbsolutePosition - Describes the global client-screen position of the UIComponent, relative to the top-left corner of the screen.
		 */
		this.AbsolutePosition = new Vector2(0, 0);

		/**
		 * @param {Vector2} AbsoluteSize - Describes the final size after all relative size calculations, in pixels.
		 */
		this.AbsoluteSize = new Vector2(0, 0);

		/**
		 * @param {number} ZIndex - ZIndex defines the order in which to draw a UIComponent to the screen, a higher number 
		 * means the UIComponent is among the last to be drawn, and hence draws on top of the previous UIComponents.
		 */
		this.ZIndex = 0;

		/**
		 * @param {UIComponent.Enum.SizeConstraint} SizeConstraint - Decides if the Size X and Y axes have constraints on either axis.
		 * 
		 * What this means is that if SizeConstraint = XX, both Width and Height will be equal to Width.
		 */
		this.SizeConstraint = UIComponent.Enum.SizeConstraint.XY;

		/**
		 * @param {string} CustomStyling - A custom CSS style ruleset which alters the appearance and behaviour of a UIComponent.
		 */
		this.CustomStyling = "";

		/**
		 * @param {UIComponent | undefined} Parent - The Parent UIComponent which this descends from.
		 * 
		 * As a child, the position is affected by the Size and Position of the Parent UIComponent.
		 */
		this.Parent = undefined;

		/**
		 * @param { Map<number, UIComponent> } Children - This UIComponent's child UIComponents. Any changes to this's Position or Size 
		 * will alter the Positions of any Child elements down the line.
		 */
		this.Children = new Map();

		// this.Position

		UIComponent.GlobalMap.set(this.id, this);

		this.init();
	}

	destroy() {
		this.setParent(undefined);
		this.elementReference = undefined;
		// should destroy the HTML element as well?
		// idk.
		if (UIComponent.GlobalMap.has(this.id)) {
			UIComponent.GlobalMap.delete(this.id);
		}
		// GC cleanup maybe.
	}

	init() {
		this.render();

	}

	render() {
		this.elementReference.style.position = "fixed";
		
		if (this.Parent !== undefined) {

			let ancestors = this.getAncestors(this);
			ancestors.push(this.id);
			ancestors = ancestors.map((id) => UIComponent.GlobalMap.get(id));

			
			this.AbsoluteSize.X = (this.Size.X.Scale * this.Parent.AbsoluteSize.X) + this.Size.X.Offset;
			this.AbsoluteSize.Y = (this.Size.Y.Scale * this.Parent.AbsoluteSize.Y) + this.Size.Y.Offset;
			if (this.SizeConstraint === UIComponent.Enum.SizeConstraint.XX) {
				this.AbsoluteSize.Y = this.AbsoluteSize.X;
			} else if (this.SizeConstraint === UIComponent.Enum.SizeConstraint.YY) {
				this.AbsoluteSize.X = this.AbsoluteSize.Y;
			} else if (this.SizeConstraint === UIComponent.Enum.SizeConstraint.XY) {
				// no change
				this.AbsoluteSize.X = this.AbsoluteSize.X;
				this.AbsoluteSize.Y = this.AbsoluteSize.Y;
			}

			this.AbsolutePosition.X = (()=>{
				let runningTotal = 0;
				for (let uic of ancestors) {
					if (uic.Parent !== undefined) {
						runningTotal += (uic.Position.X.Scale * uic.Parent.AbsoluteSize.X);
						runningTotal += uic.Parent.Position.X.Offset;
					} else {
						runningTotal += (uic.Position.X.Scale * window.innerWidth);
					}
					runningTotal += (uic.AnchorPoint.X * -uic.AbsoluteSize.X);
					runningTotal += uic.Position.X.Offset;
				}

				// runningTotal += this.Position.X.Offset;

				return runningTotal;
			})();
			this.AbsolutePosition.Y = (()=>{
				let runningTotal = 0;
				for (let uic of ancestors) {
					if (uic.Parent !== undefined) {
						runningTotal += (uic.Position.Y.Scale * uic.Parent.AbsoluteSize.Y);
						runningTotal += uic.Parent.Position.Y.Offset;
					} else {
						runningTotal += (uic.Position.Y.Scale * window.innerHeight);
					}
					runningTotal += (uic.AnchorPoint.Y * -uic.AbsoluteSize.Y);
					runningTotal += uic.Position.Y.Offset;
				}

				return runningTotal;
			})();


		} else {
			this.AbsoluteSize.X = this.Size.X.Scale * window.innerWidth + this.Size.X.Offset;
			this.AbsoluteSize.Y = this.Size.Y.Scale * window.innerHeight + this.Size.Y.Offset;
			if (this.SizeConstraint === UIComponent.Enum.SizeConstraint.XX) {
				this.AbsoluteSize.Y = this.AbsoluteSize.X;
			} else if (this.SizeConstraint === UIComponent.Enum.SizeConstraint.YY) {
				this.AbsoluteSize.X = this.AbsoluteSize.Y;
			} else if (this.SizeConstraint === UIComponent.Enum.SizeConstraint.XY) {
				// no change
				this.AbsoluteSize.X = this.AbsoluteSize.X;
				this.AbsoluteSize.Y = this.AbsoluteSize.Y;
			}


			this.AbsolutePosition.X = this.Position.X.Scale * window.innerWidth + this.Position.X.Offset;
			this.AbsolutePosition.Y = this.Position.Y.Scale * window.innerHeight + this.Position.Y.Offset;

			// now apply the anchor point stuff
			this.AbsolutePosition.X = this.AbsolutePosition.X + (this.AnchorPoint.X * -this.AbsoluteSize.X);
			this.AbsolutePosition.Y = this.AbsolutePosition.Y + (this.AnchorPoint.Y * -this.AbsoluteSize.Y);
		}

		this.elementReference.style.width = `${this.AbsoluteSize.X}px`;
		this.elementReference.style.height = `${this.AbsoluteSize.Y}px`;
		this.elementReference.style.left = `${this.AbsolutePosition.X}px`;
		this.elementReference.style.top = `${this.AbsolutePosition.Y}px`;

		// this.elementReference.style.border = "1px solid red";
		// this.elementReference.style.overflowX = "auto";
		this.elementReference.style.overflowWrap = "anywhere";



		// console.log(
		// 	`UIComponent ${this.Name}\n`, 
		// 	`\tPosition: ${this.elementReference.style.left}, ${this.elementReference.style.top}\n`,
		// 	`\tSize: ${this.elementReference.style.width}, ${this.elementReference.style.height}\n`,
		// 	`\tParent: ${(this.Parent !== undefined) ? (this.Parent.Name) : ("None.")}`,
		// 	`\tChain of Parents: `, this.getAncestors(this).map((id) => UIComponent.GlobalMap.get(id).Name)
		// );


		this.Children.forEach((uic) => {
			uic.init();
		});
	}

	/**
	 * 
	 * @param {UIComponent | undefined} parent - The UiComponent to Parent-to. This will alter this element's Position, unless PositionInfluence = Enum.Global.
	 */
	setParent(parent) {
		if (parent === undefined) {
			this.Parent.removeChild(this);
			this.Parent = undefined;
		} else {
			parent.addChild(this);
		}
	}

	/**
	 * 
	 * @param {UIComponent} child - The UIComponent to add as a child to this element.
	 */
	addChild(child) {
		child.Parent = this;
		this.Children.set(child.id, child);
		if (this.VerboseLogging) console.log(`Parent (this): ${this.Name}\n\tChild: ${child.Name}`);
	}

	/**
	 * 
	 * @param {UIComponent | string | number} child - The UIComponent to remove from children list, if applicable.
	 */
	removeChild(child) {
		let temp_child_reference = undefined;
		if (typeof child === "number") {
			if (this.Children.has(child)) {
				temp_child_reference = this.Children.get(child);
				this.Children.delete(child);
			}
		} else if (typeof child === "string") {
			let query = this.Children.find((item) => item.Name === child);
			if (query !== undefined || query !== null) {
				temp_child_reference = this.Children.get(query.id);
				this.Children.delete(query.id);
			}
		} else if (child instanceof UIComponent) {
			temp_child_reference = child;
			this.Children.delete(child.id);
		}
		temp_child_reference.Parent = undefined;
	}

	/**
	 * @returns {number[]} ongoingChain;
	 * @param {UIComponent} uic 
	 */
	getAncestors(uic) {
		let ongoingChain = [];
		if (this.Parent) {
			if (!ongoingChain.includes(this.Parent.id)) {
				ongoingChain.push(this.Parent.id);
			}
			ongoingChain = [...ongoingChain, ...this.Parent.getAncestors(uic) ];
		}
		return ongoingChain;
	}

};

