import PIXI from 'pixi.js';

export default class Game {
	constructor(config) {
		this.config = config;
		const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;

		this.desktopResolution = {
			width: config.width,
			height: config.height,
		};
		//config.width = window.screen.width;
		//config.height = window.screen.height;
		this.ratio = this.config.width / this.config.height;
		this.renderer = new Renderer(this.config.width || 800, this.config.height || 600, this.config.rendererOptions);
		document.body.appendChild(this.renderer.view);

		window.renderer = this.renderer;

		this.animationLoop = new PIXI.AnimationLoop(this.renderer);
		this.animationLoop.on('prerender', this.update.bind(this));
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
		this.renderer.view.style.position = 'absolute';
		this.innerResolution = { width: window.innerWidth, height: window.innerHeight };



		const sclX = window.innerWidth < this.desktopResolution.width ? window.innerWidth / this.desktopResolution.width : 10;
		const sclY = window.innerHeight / this.desktopResolution.height// window.innerHeight < this.desktopResolution.height ? window.innerHeight / this.desktopResolution.height : 1;

		const scl = Math.min(sclX, sclY);

		this.renderer.view.style.position = 'absolute';

		const newSize = {
			width: window.innerWidth,//* scl,
			height: this.desktopResolution.height * scl,
		};


		this.renderer.view.style.width = `${newSize.width}px`;
		this.renderer.view.style.height = `${newSize.height}px`;

		if (newSize.height < window.innerHeight) {
			this.renderer.view.style.top = `${window.innerHeight / 2 - (newSize.height) / 2}px`;
		}
		if (newSize.width < window.innerWidth) {
		}
		this.renderer.view.style.left = `${window.innerWidth / 2 - (newSize.width) / 2}px`;

		if (this.screenManager) {
			this.screenManager.resize(newSize);
		}

	}

	update() {
		for (let i = 0; i < this.stage.children.length; i++) {
			if (this.stage.children[i].update) {
				this.stage.children[i].update(this.animationLoop.delta);
			}
		}
		this.resize();
	}

	start() {
		this.animationLoop.start();
	}

	stop() {
		this.animationLoop.stop();
	}

	get stage() {
		return this.animationLoop.stage;
	}

	set stage(stage) {
		this.animationLoop.stage = stage;
	}
}
