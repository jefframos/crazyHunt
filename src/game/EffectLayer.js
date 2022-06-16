import * as PIXI from 'pixi.js';;
import config from '../config';
import TweenLite from 'gsap';
import { RGBSplitFilter } from 'pixi-filters';
import { InvertFilter } from 'pixi-filters';
import { AsciiFilter } from 'pixi-filters';
import { ShockwaveFilter } from 'pixi-filters';

export default class EffectLayer extends PIXI.Container {
	constructor(screenManager) {
		super();

		this.screenManager = screenManager;

		this.blackShape = new PIXI.Graphics();
		this.blackShape.beginFill(0);
		this.blackShape.drawRect(0, 0, config.width, config.height);
		this.blackShape.alpha = 0;
		this.addChild(this.blackShape);

		this.grey = new PIXI.Graphics();
		this.grey.beginFill(0X555555);
		this.grey.drawRect(0, 0, config.width, config.height);
		this.grey.alpha = 0;
		//this.addChild(this.grey);

		this.tvLines = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/tvlines.png', config.width, config.height))
		this.addChild(this.tvLines)
		this.tvLines.width = config.width;
		this.tvLines.height = config.height;
		this.tvLines.blendMode = PIXI.BLEND_MODES.ADD;


		// this.tvShape = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/frontTVsoft.png'))
		// this.addChild(this.tvShape)
		// this.tvShape.width = config.width;
		// this.tvShape.height = config.height;

		// this.tvShape.blendMode = PIXI.BLEND_MODES.OVERLAY;


		//RGB SPLITTER
		this.rgpSplit = new RGBSplitFilter();
		let dist = 0
		this.rgpSplit.red = new PIXI.Point(dist, dist);
		this.rgpSplit.green = new PIXI.Point(-dist, -dist);
		this.rgpSplit.blue = new PIXI.Point(dist, -dist);


		//crosshatch
		//this.crossHatch = CrossHatchFilter();

		//blur
		this.blur = new PIXI.filters.BlurFilter();

		//gray
		this.gray = new PIXI.filters.ColorMatrixFilter();

		//invert

		//ascii
		this.ascii = new AsciiFilter();


		this.invertFilter = new PIXI.filters.ColorMatrixFilter();
		this.invertFilter.negative(1)
		this.browni = new PIXI.filters.ColorMatrixFilter();
		this.browni.browni(1)
		this.desaturate = new PIXI.filters.ColorMatrixFilter();
		this.desaturate.desaturate(1)
		this.contrast = new PIXI.filters.ColorMatrixFilter();
		this.contrast.contrast(1)
		this.hue = new PIXI.filters.ColorMatrixFilter();
		this.hue.hue(90)

		this.hue2 = new PIXI.filters.ColorMatrixFilter();
		this.hue2.hue(45)

		this.hue3 = new PIXI.filters.ColorMatrixFilter();
		this.hue3.hue(135)

		this.koda = new PIXI.filters.ColorMatrixFilter();
		this.koda.kodachrome(1)
		this.lsd = new PIXI.filters.ColorMatrixFilter();
		this.lsd.lsd(1)

		this.sepia = new PIXI.filters.ColorMatrixFilter();
		this.sepia.sepia(1)

		this.techni = new PIXI.filters.ColorMatrixFilter();
		this.techni.technicolor(1)

		this.vintage = new PIXI.filters.ColorMatrixFilter();
		this.vintage.vintage(1)

		this.predator = new PIXI.filters.ColorMatrixFilter();
		this.predator.predator(0.5)

		this.polaroid = new PIXI.filters.ColorMatrixFilter();
		this.polaroid.polaroid(1)


		this.allColorFilters = [];

		this.allColorFilters.push(this.invertFilter)
		// this.allColorFilters.push(this.browni)
		this.allColorFilters.push(this.desaturate)
		this.allColorFilters.push(this.contrast)
		this.allColorFilters.push(this.hue)
		this.allColorFilters.push(this.hue2)
		this.allColorFilters.push(this.hue3)
		this.allColorFilters.push(this.koda)
		this.allColorFilters.push(this.lsd)
		// this.allColorFilters.push(this.sepia)
		this.allColorFilters.push(this.techni)
		// this.allColorFilters.push(this.vintage)
		this.allColorFilters.push(this.predator)
		this.allColorFilters.push(this.polaroid)
		//GLITCH 1
		this.glitch1 = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/glitch1.jpg', config.width, config.height))
		this.addChild(this.glitch1)
		this.glitch1.width = config.width;
		this.glitch1.height = config.width;
		this.displacementFilterGlitch1 = new PIXI.filters.DisplacementFilter(this.glitch1);

		//PIXELATE
		this.pixelate = null

		//DISPLACEMENT FILTER
		// let displacementTexture2 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/glitch1.jpg'))
		// this.addChild(displacementTexture2);

		//GLITCH 1
		this.glitch2 = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/glitch2.jpg', config.width, config.height))
		this.addChild(this.glitch2)
		this.glitch2.width = config.width;
		this.glitch2.height = config.width;
		this.displacementFilterGlitch2 = new PIXI.filters.DisplacementFilter(this.glitch2);

		//BLOOM
		this.bloom = null

		//SHOCKWAVE
		this.shockwave = new ShockwaveFilter();
		this.shockwave.time = 0;
		this.shockwave.center.x = 0.5;
		this.shockwave.center.y = 0.5;

		this.filtersList =
			[this.rgpSplit,
			this.pixelate,
			this.displacementFilterGlitch2,
			this.displacementFilterGlitch1,
			this.bloom,
			this.shockwave,
			this.crossHatch,
			this.invertFilter,
			this.ascii,
			this.gray,
			this.blur];

		this.filtersActives = [false, false, false, false, false, false, false, true, false, false, false];

		this.updateFilters();

		this.ID_RGBSPLIT = 0;
		this.ID_PIXELATE = 1;
		this.ID_GLITCH2 = 2;
		this.ID_GLITCH1 = 3;
		this.ID_BLOOM = 4;
		this.ID_SHOCKWAVE = 5;
		this.ID_CROSSHATCH = 6;
		this.ID_INVERT = 7;
		this.ID_ASCII = 8;
		this.ID_GRAY = 9;
		this.ID_BLUR = 10;

		this.updatePixelate(config.pixelSize, config.pixelSize);

	}
	addColorFilter(id) {

		let filter = this.allColorFilters[id]
		this.screenManager.filters = [filter]
	}
	removeColorFilter() {
		this.screenManager.filters = []
	}
	hideGreyShape(time, delay) {
		TweenLite.to(this.grey, time, { alpha: 0, delay: delay });
	}
	removeAllFilters() {
		for (var i = this.filtersActives.length - 1; i >= 0; i--) {
			this.filtersActives[i] = false;
		}
		this.updateFilters();
	}
	updateRGBSplitter(value) {
		this.rgpSplit.red = new PIXI.Point(value, value);
		this.rgpSplit.green = new PIXI.Point(-value, -value);
		this.rgpSplit.blue = new PIXI.Point(value, -value);
	}
	updateFilters() {
		return
		var filtersToApply = [];
		for (var i = 0; i < this.filtersList.length; i++) {

			if (this.filtersActives[i]) {
				filtersToApply.push(this.filtersList[i]);
			}
		};
		//console.log(filtersToApply)
		this.screenManager.filters = filtersToApply.length > 0 ? filtersToApply : null;
		// console.log(this.screenManager.filters);
	}
	removeBlur() {
		this.filtersActives[this.ID_BLUR] = false;
		this.updateFilters();
	}
	addBlur() {
		this.filtersActives[this.ID_BLUR] = false;
		this.updateFilters();
	}
	removeGlitch2() {
		this.filtersActives[this.ID_GLITCH2] = false;
		this.updateFilters();
	}
	addGlitch2() {
		return
		this.filtersActives[this.ID_GLITCH2] = true;
		this.updateFilters();
	}

	removeGray() {
		this.filtersActives[this.ID_GRAY] = false;
		this.updateFilters();
	}
	addGray() {
		this.filtersActives[this.ID_GRAY] = true;
		this.updateFilters();
	}

	removeCrossHatch() {
		this.filtersActives[this.ID_CROSSHATCH] = false;
		this.updateFilters();
	}
	addCrossHatch() {
		this.filtersActives[this.ID_CROSSHATCH] = true;
		this.updateFilters();
	}

	removeInvert() {
		this.filtersActives[this.ID_INVERT] = false;
		this.updateFilters();
	}
	addInvert() {
		this.filtersActives[this.ID_INVERT] = true;
		this.updateFilters();
	}

	removeAscii() {
		this.filtersActives[this.ID_ASCII] = false;
		this.updateFilters();
	}
	addAscii() {
		this.filtersActives[this.ID_ASCII] = true;
		this.updateFilters();
	}

	removeBloom() {
		this.filtersActives[this.ID_BLOOM] = false;
		this.updateFilters();
	}
	addBloom() {
		this.filtersActives[this.ID_BLOOM] = true;
		this.updateFilters();
	}

	removePixelate() {
		this.filtersActives[this.ID_PIXELATE] = false;
		this.updateFilters();
	}
	addPixelate() {
		return
		this.filtersActives[this.ID_PIXELATE] = true;
		this.updateFilters();
	}
	removeRGBSplitter() {
		this.filtersActives[this.ID_RGBSPLIT] = false;
		this.updateFilters();
	}
	addRGBSplitter() {
		this.filtersActives[this.ID_RGBSPLIT] = false;
		this.updateFilters();
	}
	updatePixelate(x, y) {
		// this.pixelate.size.x = x;
		// this.pixelate.size.y = y;
	}
	removeShockwave() {
		this.filtersActives[this.ID_SHOCKWAVE] = false;
		this.updateFilters();
	}
	addShockwave(x, y, time, delay) {
		return
		this.filtersActives[this.ID_SHOCKWAVE] = true;
		this.updateFilters();
		this.shockwave.time = 0;
		this.shockwave.center.x = x;
		this.shockwave.center.y = y;
		TweenLite.killTweensOf(this.shockwave);
		TweenLite.to(this.shockwave, time, { delay: delay, time: 1, onComplete: this.removeShockwave, onCompleteScope: this });
	}

	fadeBloom(initValue, endValue, time, delay, removeAfter) {
		this.addBloom();
		this.bloom.blur = initValue;
		TweenLite.killTweensOf(this.bloom);
		if (removeAfter) {
			TweenLite.to(this.bloom, time, { delay: delay, blur: endValue, onComplete: this.removeBloom, onCompleteScope: this });
		} else {
			TweenLite.to(this.bloom, time, { delay: delay, blur: endValue });
		}
	}
	fadeSplitter(endValue, time, delay) {
		endValue *= 0
		// this.addRGBSplitter();
		TweenLite.killTweensOf(this.rgpSplit.red);
		TweenLite.killTweensOf(this.rgpSplit.green);
		TweenLite.killTweensOf(this.rgpSplit.blue);
		TweenLite.to(this.rgpSplit.red, time, { delay: delay, x: endValue, y: endValue, onStart: this.addRGBSplitter, onStartScope: this });
		TweenLite.to(this.rgpSplit.green, time, { delay: delay, x: -endValue, y: -endValue });
		TweenLite.to(this.rgpSplit.blue, time, { delay: delay, x: endValue, y: -endValue });
	}
	shakeSplitter(force, steps, time, removeAfter) {
		this.filtersActives[this.ID_RGBSPLIT] = false;
		this.updateFilters();
		if (config.isJuicy == 0) {
			return;
		}
		if (!force) {
			force = 1;
		}
		if (!steps) {
			steps = 4;
		}
		if (!time) {
			time = 1;
		}
		let timelineSplitRed = new TimelineLite();
		let timelineSplitGreen = new TimelineLite();
		let timelineSplitBlue = new TimelineLite();
		let spliterForce = (force * 2);
		spliterForce = Math.min(spliterForce, 1)
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelineSplitRed.append(TweenLite.to(this.rgpSplit.red, speed, { x: Math.random() * spliterForce - spliterForce / 2, y: Math.random() * spliterForce - spliterForce / 2, ease: "easeNoneLinear" }));
			timelineSplitGreen.append(TweenLite.to(this.rgpSplit.green, speed, { x: Math.random() * spliterForce - spliterForce / 2, y: Math.random() * spliterForce - spliterForce / 2, ease: "easeNoneLinear" }));
			timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, { x: Math.random() * spliterForce - spliterForce / 2, y: Math.random() * spliterForce - spliterForce / 2, ease: "easeNoneLinear" }));
		};

		let dist = 0.5
		timelineSplitRed.append(TweenLite.to(this.rgpSplit.red, speed, { x: dist, y: dist, ease: "easeNoneLinear" }));
		timelineSplitGreen.append(TweenLite.to(this.rgpSplit.green, speed, { x: -dist, y: -dist, ease: "easeNoneLinear" }));
		if (removeAfter) {
			timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, { x: dist, y: -dist, ease: "easeNoneLinear", onComplete: this.removeRGBSplitter, onCompleteScope: this }));
		} else {
			timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, { x: dist, y: -dist, ease: "easeNoneLinear" }));
		}
	}
	shake(force, steps, time) {
		if (config.isJuicy == 0) {
			return;
		}
		if (!force) {
			force = 1;
		}
		if (!steps) {
			steps = 4;
		}
		if (!time) {
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 20);
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.screenManager.position, speed, { x: Math.random() * positionForce - positionForce / 2, y: Math.random() * positionForce - positionForce / 2, ease: "easeNoneLinear" }));
		};

		timelinePosition.append(TweenLite.to(this.screenManager.position, speed, { x: 0, y: 0, ease: "easeeaseNoneLinear" }));
	}

	shakeX(force, steps, time) {
		if (config.isJuicy == 0) {
			return;
		}
		if (!force) {
			force = 1;
		}
		if (!steps) {
			steps = 4;
		}
		if (!time) {
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 20);
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.screenManager.position, speed, { x: Math.random() * positionForce - positionForce / 2, ease: "easeNoneLinear" }));
		};

		timelinePosition.append(TweenLite.to(this.screenManager.position, speed, { x: 0, y: 0, ease: "easeeaseNoneLinear" }));
	}

	shakeY(force, steps, time) {
		if (config.isJuicy == 0) {
			return;
		}
		if (!force) {
			force = 1;
		}
		if (!steps) {
			steps = 4;
		}
		if (!time) {
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 20);
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.screenManager.position, speed, { y: Math.random() * positionForce - positionForce / 2, ease: "easeNoneLinear" }));
		};

		timelinePosition.append(TweenLite.to(this.screenManager.position, speed, { x: 0, y: 0, ease: "easeeaseNoneLinear" }));
	}

	shakeRotation(force, steps, time) {
		if (config.isJuicy == 0) {
			return;
		}
		if (!force) {
			force = 1;
		}
		if (!steps) {
			steps = 4;
		}
		if (!time) {
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let rotationForce = (force * 180 / Math.PI);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.screenManager, speed, { rotation: Math.random() * rotationForce - rotationForce / 2, ease: "easeNoneLinear" }));
		};

		timelinePosition.append(TweenLite.to(this.screenManager, speed, { rotation: 0, ease: "easeeaseNoneLinear" }));
	}

	update(delta) {
		// this.blackShape.alpha = 0//Math.random() * 0.3;
		// this.glitch1.tilePosition.y += 1;
	}
}
