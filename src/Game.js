import * as PIXI from 'pixi.js';;
export default class Game {
	constructor(config) {
		this.config = config;
		//const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;

		this.desktopResolution = {
			width: config.width,
			height: config.height,
		};
		//config.width = window.screen.width;
		//config.height = window.screen.height;
		this.ratio = this.config.width / this.config.height;
		//this.app = new Renderer(this.config.width || 800, this.config.height || 600, this.config.rendererOptions);
		console.log(this.app)

		this.app = new PIXI.Application(
			{
				width: this.config.width,
				height: this.config.height,
				resolution: 2,
				autoResize: false,
				backgroundColor: 0xFFFFFF,
			}
		);
		document.body.appendChild(this.app.view);

		window.renderer = this.app;
		this.stage = this.app.stage
		this.isRunning = true;
		this.update();
		this.resize();
	}
	resize() {
		if (window.innerWidth / window.innerHeight >= this.ratio) {
			var w = window.innerHeight * this.ratio;
		} else {
			var h = window.innerWidth / this.ratio;
		}
		var w = window.innerWidth;
		var h = window.innerHeight;
		this.app.view.style.position = 'absolute';
		this.innerResolution = { width: window.innerWidth, height: window.innerHeight };



		const sclX = window.innerWidth < this.desktopResolution.width ? window.innerWidth / this.desktopResolution.width : 10;
		const sclY = window.innerHeight / this.desktopResolution.height// window.innerHeight < this.desktopResolution.height ? window.innerHeight / this.desktopResolution.height : 1;

		const scl = Math.min(sclX, sclY);

		this.app.view.style.position = 'absolute';

		const newSize = {
			width: window.innerWidth,//* scl,
			height: this.desktopResolution.height * scl,
		};


		this.app.view.style.width = `${newSize.width}px`;
		this.app.view.style.height = `${newSize.height}px`;

		if (newSize.height < window.innerHeight) {
			this.app.view.style.top = `${window.innerHeight / 2 - (newSize.height) / 2}px`;
		}
		if (newSize.width < window.innerWidth) {
		}
		this.app.view.style.left = `${window.innerWidth / 2 - (newSize.width) / 2}px`;

		if (this.screenManager) {
			this.screenManager.resize(newSize);
		}

	}

	update() {
		if (!this.isRunning) {
			return
		}

		let now = Date.now();
		this.dt = now - this.lastUpdate;
		this.lastUpdate = now;
		
		this.dt /= 1000

		for (let i = 0; i < this.stage.children.length; i++) {
			if (this.stage.children[i].update) {
				this.stage.children[i].update(this.dt);
			}
		}
		this.resize();

		requestAnimationFrame(this.update.bind(this));
	}

	start() {
		this.isRunning = true
	}

	stop() {
		this.isRunning = false
	}

	// get stage() {
	// 	return this.animationLoop.stage;
	// }

	// set stage(stage) {
	// 	this.animationLoop.stage = stage;
	// }
}
