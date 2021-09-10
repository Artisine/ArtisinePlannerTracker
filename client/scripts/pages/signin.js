
import {
	queryElement
} from "../client.js";

export default class LoginScreen {

	static backgroundCanvasStuff = {
		canvas: undefined,
		ctx: undefined,
		floatingBubbles: [],
		floatingBubbleColours: [
			// "#0087bd", "#00aac0",
			// "hsl(212, 72%, 49%)", "hsl(212, 72%, 50%)"
		],
		active: false
	};

	static onceInit() {
		queryElement("#signin_signup-button").addEventListener("click", ()=>{
			queryElement("#signin_body-1").style.display = "none";
			queryElement("#signin_body-2").style.display = "block";
		});
		queryElement("#signup_back-button").addEventListener("click", ()=>{
			queryElement("#signin_body-2").style.display = "none";
			queryElement("#signin_body-1").style.display = "block";
		});

		const section_signin = queryElement(`section[name="signin"]`);
		// const MO_config = {
		// 	attributes: true,
		// 	childList: true,
		// 	subtree: true
		// };
		// const MO_callback = (mutationsList, observer)=>{
		// 	for(const mutation of mutationsList) {
		// 		// if (mutation.type === 'childList') {
		// 		// 	console.log('A child node has been added or removed.');
		// 		// }
		// 		if (mutation.type === "attributes") {
		// 			console.log(`The ${mutation.attributeName}`);
		// 			if (mutation.attributeName === "width") {
		// 				// console.log(`The ${mutation.attributeName} is now ${mutation}`);
		// 				if (parseInt(section_signin.width) < 600) {
		// 					// mobile!
		// 					if (LoginScreen.backgroundCanvasStuff.active) {
		// 						LoginScreen.terminate();
		// 					}
		// 				} else if (!LoginScreen.backgroundCanvasStuff.active) {
		// 					LoginScreen.init();
		// 				}
		// 			}
		// 		}
		// 	}
		// };
		// const MO = new MutationObserver(MO_callback);
		// MO.observe(section_signin, MO_config);

		// do not disconnect?

		this.init();
	}
	static init() {

		this.setupBackgroundCanvas();
	}

	static get_FloatingBubble() {
		const FloatingBubble = function(radius, colour, startCoordinates, startVelocity) {
			this.radius = radius;
			this.colour = colour;
			this.startCoordinates = startCoordinates;
			this.startVelocity = startVelocity;
			this.position = {x: this.startCoordinates.x, y: this.startCoordinates.y};
			this.velocity = {x: this.startVelocity.x, y: this.startVelocity.y};

			this.boundaryTeleport = ()=>{
				if (this.position.x < -this.radius) {
					this.position.x = LoginScreen.backgroundCanvasStuff.canvas.width + this.radius;
				}
				if (this.position.x > LoginScreen.backgroundCanvasStuff.canvas.width + this.radius) {
					this.position.x = -this.radius;
				}
				if (this.position.y < -this.radius) {
					this.position.y = LoginScreen.backgroundCanvasStuff.canvas.height + this.radius;
				}
				if (this.position.y > LoginScreen.backgroundCanvasStuff.canvas.height + this.radius) {
					this.position.y = -this.radius;
				}
			};
			this.move = ()=>{
				this.position.x = this.position.x + this.velocity.x / 60;
				this.position.y = this.position.y + this.velocity.y / 60;
				// 60 fps
			};
			this.collision = ()=>{
				const otherBubbles = LoginScreen.backgroundCanvasStuff.floatingBubbles.filter((bubble) => bubble !== this);
				const bubblesInRange = otherBubbles.filter((bubble)=>{
					return (Math.hypot(bubble.position.x - this.position.x, bubble.position.y - this.position.y) <= this.radius*4);
				});
				const bubblesToCollide = bubblesInRange.filter((bubble)=>{
					return (Math.hypot(bubble.position.x - this.position.x, bubble.position.y - this.position.y) < (bubble.radius + this.radius));
				});
				/*
				A = this
				B = other bubble
				*/
				bubblesToCollide.forEach((bubble)=>{
					const velocityA = this.velocity;
					const velocityB = bubble.velocity;
					const positionA = this.position;
					const positionB = bubble.position;
					const radiusA = this.radius;
					const radiusB = bubble.radius;
					// find the "split" line
					

					// get equation of line connecting centers of circles A & B together
					// y = mx + c
					// m = (By - Ay) / (Bx - Ax);
					// substitute the coordinate of circle A, doesn't matter which circle honestly ...
					const AB_gradient = (positionB.y - positionA.y) / (positionB.x - positionA.x);
					const AB_yIntercept = positionA.y - (AB_gradient * positionA.x);
					// y = AB_gradient(x) + AB_yIntercept


					/*
					mx^2 + cx - ((r^2 - c^2)/(2m)) = 0
					Solve for x
					[quadratic forumula?]

					*/



					// find Ae
					const A_circumferenceAddition_x_vals = quadraticFormula(
						AB_gradient, AB_yIntercept,
						-((radiusA*radiusA - AB_yIntercept*AB_yIntercept)/(2*AB_gradient))
					);
					// y = mx + c, factor possible x vals back into eq.
					const A_circumferenceAddition_y_vals = A_circumferenceAddition_x_vals.map((x_val) => {
						if (typeof x_val !== "number") {
							return undefined;
						}
						const y = AB_gradient*x_val + AB_yIntercept;
						return y;
					});

					let A_circumferenceAdditions = {x: undefined, y: undefined};
					// check if circle A is to the left, or right, of circle B
					if (positionA.x < positionB.x) {
						// A is to the left of B
						A_circumferenceAdditions.x = A_circumferenceAddition_x_vals[0];
						// ^ this is the positive one form the quadratic
						// ^ find the y from given line-equation
					} else if (positionA.x > positionB.x) {
						// A is to the right of B
						A_circumferenceAdditions.x = A_circumferenceAddition_x_vals[1];
						// ^ this is the negative from quadratic
					} else {
						throw new Error("wtf man");
					}
					if (positionA.y < positionB.y) {
						A_circumferenceAdditions.y = A_circumferenceAddition_y_vals[0];
					} else if (positionA.y > positionB.y) {
						A_circumferenceAdditions.y = A_circumferenceAddition_y_vals[1];
					} else {
						throw new Error("wtfffff");
					}
					const Ae = {
						x: positionA.x + A_circumferenceAdditions.x,
						y: positionA.y + A_circumferenceAdditions.y
					};




					const B_circumferenceAddition_x_vals = quadraticFormula(
						AB_gradient, AB_yIntercept,
						-((radiusB*radiusB - AB_yIntercept*AB_yIntercept)/(2*AB_gradient))
					);
					// factor back into y = mx + c
					const B_circumferenceAddition_y_vals = B_circumferenceAddition_x_vals.map((x_val)=>{
						if (typeof x_val !== "number") {
							return undefined;
						}
						const y = AB_gradient*x_val + AB_yIntercept;
						return y;
					});
					let B_circumferenceAdditions = {x: undefined, y: undefined};
					if (positionB.x < positionA.x) {
						// B is to the left of A
						B_circumferenceAdditions.x = B_circumferenceAddition_x_vals[0];
					} else if (positionB.x > positionA.x) {
						// B is to the right of A
						B_circumferenceAdditions.x = B_circumferenceAddition_x_vals[1];
					} else {
						throw new Error("aaaaa");
					}
					if (positionB.y < positionA.y) {
						B_circumferenceAdditions.y = B_circumferenceAddition_y_vals[0];
					} else if (positionB.y > positionA.y) {
						B_circumferenceAdditions.y = B_circumferenceAddition_y_vals[1];
					} else {
						throw new Error("BBBBasdasd");
					}
					const Be = {
						x: positionB.x + B_circumferenceAdditions.x,
						y: positionB.y + B_circumferenceAdditions.y
					};



					const mid = {
						x: (Ae.x + Be.x) / 2,
						y: (Ae.y + Be.y) / 2
					};

					const inverseReciprocalGradient = -(AB_gradient ** -1);
					const perpendicularLine_gradient = inverseReciprocalGradient;
					// line of perpendicular line, intersecting point[mid]
					// y = mx + c
					// find c
					// c = y - mx
					// c = (y) - inverseReciprocalGradient(x)
					const perpendicularLine_yIntersect = (mid.y) - (inverseReciprocalGradient * mid.x);
					// y = mx + c
					// y = perpendicularLine_gradient(x) + perpendicularLine_yIntersect;







				});
			};
			this.logic = ()=>{
				this.move();
				this.boundaryTeleport();

			};
			this.render = ()=>{
				LoginScreen.backgroundCanvasStuff.ctx.save();
				LoginScreen.backgroundCanvasStuff.ctx.circle(this.position.x, this.position.y, this.radius);
				LoginScreen.backgroundCanvasStuff.ctx.strokePrev("black");
				LoginScreen.backgroundCanvasStuff.ctx.fillPrev(this.colour);
				LoginScreen.backgroundCanvasStuff.ctx.restore();
			};
		};
		return FloatingBubble.bind(FloatingBubble);
	}
	static createFloatingBubble() {
		const FB = LoginScreen.get_FloatingBubble();
		return new FB(
			20 + Math.random()*10,
			LoginScreen.backgroundCanvasStuff.floatingBubbleColours[Math.floor(
				Math.random() * LoginScreen.backgroundCanvasStuff.floatingBubbleColours.length
			)],
			{
				x: LoginScreen.backgroundCanvasStuff.canvas.width * Math.random(),
				y: LoginScreen.backgroundCanvasStuff.canvas.height * Math.random()
			},
			{
				x: ((Math.random()*2)-1) * 100,
				y: ((Math.random()*2)-1) * 100
			}
		);
	}
	static callback_whenSliderChanged() {
		LoginScreen.whenSliderChanged();
	}
	static setupBackgroundCanvas() {
		for (let i=4; i<8; i+=1) {
			this.backgroundCanvasStuff.floatingBubbleColours.push(`hsl(212, 72%, ${i * 10}%)`);
		}

		this.backgroundCanvasStuff.canvas = queryElement("canvas#signin_background-canvas");
		this.backgroundCanvasStuff.canvas.resize = ()=>{
			this.backgroundCanvasStuff.canvas.width = window.innerWidth;
			this.backgroundCanvasStuff.canvas.height = window.innerHeight;
		}; this.backgroundCanvasStuff.canvas.resize();
		window.addEventListener("resize", this.backgroundCanvasStuff.canvas.resize);
		this.backgroundCanvasStuff.ctx = this.backgroundCanvasStuff.canvas.getContext("2d");
		this.backgroundCanvasStuff.ctx.wipe = ()=>{
			this.backgroundCanvasStuff.ctx.clearRect(0, 0, this.backgroundCanvasStuff.ctx.canvas.width, this.backgroundCanvasStuff.ctx.canvas.height);
		};
		this.backgroundCanvasStuff.ctx.circle = (x, y, r)=>{
			this.backgroundCanvasStuff.ctx.beginPath();
			this.backgroundCanvasStuff.ctx.arc(x, y, r, 0, Math.PI * 2);
			this.backgroundCanvasStuff.ctx.closePath();
		};
		this.backgroundCanvasStuff.ctx.strokePrev = (style)=>{
			this.backgroundCanvasStuff.ctx.strokeStyle = style;
			this.backgroundCanvasStuff.ctx.stroke();
		};
		this.backgroundCanvasStuff.ctx.fillPrev = (style)=>{
			this.backgroundCanvasStuff.ctx.fillStyle = style;
			this.backgroundCanvasStuff.ctx.fill();
		};


		for (let i=0; i<100; i+=1) {
			this.backgroundCanvasStuff.floatingBubbles.push( LoginScreen.createFloatingBubble() );
		}

		this.backgroundCanvasStuff.active = true;

		queryElement("#signin_background-canvas_corner-config_slider").addEventListener("change", LoginScreen.callback_whenSliderChanged);


		window.requestAnimationFrame(this.backgroundCanvasRenderLoop);
	}
	static whenSliderChanged() {
		let val = queryElement("#signin_background-canvas_corner-config_slider").value;
		// console.log(`val = ${val} ; typeof = ${typeof val}`);
		val = parseInt(val);
		if (val < 0) val = 0;
		else if (val > 100) val = 100;
		
		// console.log(`val = ${val} ; typeof = ${typeof val}`);

		// LoginScreen.backgroundCanvasStuff.floatingBubbles.splice(0, val);
		// removes entries 0 to val, e: 0 to 50, leaving 50 remaining(?)
		LoginScreen.backgroundCanvasStuff.floatingBubbles = [];
		// leave to GC
		for (let i=0; i<val; i+=1) {
			this.backgroundCanvasStuff.floatingBubbles.push( LoginScreen.createFloatingBubble() );
		}
	}
	static backgroundCanvasRenderLoop() {
		LoginScreen.backgroundCanvasStuff.ctx.wipe();

		if (LoginScreen.backgroundCanvasStuff.active) {

			LoginScreen.backgroundCanvasStuff.floatingBubbles.forEach((bubble) => {
				bubble.logic();
				bubble.render();
			});

			window.requestAnimationFrame(LoginScreen.backgroundCanvasRenderLoop);
		}
	}

	static terminate() {
		queryElement("#signin_background-canvas_corner-config_slider").removeEventListener("change", LoginScreen.callback_whenSliderChanged);
		LoginScreen.backgroundCanvasStuff.active = false;
		LoginScreen.backgroundCanvasStuff.floatingBubbles = [];
		// GC?

	}
};

console.info(`%c[signin.js] %cReady.`, "color: purple", "color: #333333");
// end of file