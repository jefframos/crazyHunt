import plugins from './plugins';
import config  from './config';
import Game from './Game';
import EffectLayer from './game/EffectLayer';
import GameScreen from './game/screen/GameScreen';
import InitScreen from './game/screen/InitScreen';
import ScreenManager from './screenManager/ScreenManager';
import CookieManager  from './game/CookieManager';



window.DISABLE_POKI = false;
if (window.DISABLE_POKI) {
	window.PokiSDK = {}
	PokiSDK.init = function () {
		return new Promise(function (resolve, reject) {
			resolve("Success!");
		});
	}

	PokiSDK.gameplayStart = function () {
		return new Promise(function (resolve, reject) {
			resolve("Success!");
		});
	}

	PokiSDK.gameplayStop = function () {
		return new Promise(function (resolve, reject) {
			resolve("Success!");
		});
	}

	PokiSDK.commercialBreak = function () {
		return new Promise(function (resolve, reject) {
			resolve("Success!");
		});
	}

	PokiSDK.rewardedBreak = function () {
		return new Promise(function (resolve, reject) {
			resolve("Success!");
		});
	}

	PokiSDK.setDebug = function () {

	}
	PokiSDK.gameLoadingStart = function () {

	}

	PokiSDK.gameLoadingFinished = function () { }
}

PokiSDK.init().then(
	() => {
		console.log("Poki SDK successfully initialized");

		PIXI.loader
	.add('./assets/tvlines.png')
	.add('./assets/glitch1.jpg')
	.add('./assets/particle2.png')
	.add('./assets/textures-0.json')
	.add('./assets/fonts/super_smash_tv-webfont.woff')
	.add('./assets/fonts/super_smash_tv-webfont.woff2')
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/fonts/specimen_files/specimen_stylesheet.css')
	.load(configGame);
	}
).catch(
	() => {
		PIXI.loader
	.add('./assets/tvlines.png')
	.add('./assets/glitch1.jpg')
	.add('./assets/particle2.png')
	.add('./assets/textures-0.json')
	.add('./assets/fonts/super_smash_tv-webfont.woff')
	.add('./assets/fonts/super_smash_tv-webfont.woff2')
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/fonts/specimen_files/specimen_stylesheet.css')
	.load(configGame);
		console.log("Initialized, but the user likely has adblock");
		// fire your function to continue to game
	}
);
PokiSDK.setDebug(true);

window.GAMEPLAY_IS_STOP = true;
window.GAMEPLAY_STOP = function () {
	if (window.GAMEPLAY_IS_STOP) {
		return
	}
	window.GAMEPLAY_IS_STOP = true;
	PokiSDK.gameplayStop();
}
window.GAMEPLAY_START = function () {
	if (!window.GAMEPLAY_IS_STOP) {
		return
	}
	window.GAMEPLAY_IS_STOP = false;
	PokiSDK.gameplayStart();
}

window.isMobile =  navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
PokiSDK.gameLoadingStart();


function configGame(){
	PokiSDK.gameLoadingFinished();
	var type = window.location.hash.substr(1);
	if(type == "NOJUICY"){
		config.isJuicy = 0;
	}

	let game = new Game(config);
	let cookieManager = new CookieManager();
	window.cookieManager = cookieManager;

	console.log(window.cookieManager)
	if(!window.cookieManager.getCookie("bestPoints")){
		window.cookieManager.createCookie("bestPoints",0,365)
	}
	//create screen manager
	let screenManager = new ScreenManager();

	game.screenManager = screenManager;
	//add screens
	let gameScreen = new GameScreen("GAME");
	let initScreen = new InitScreen("INIT");
	//add effect layer
	let effectLayer = new EffectLayer(screenManager);
	console.log(game.stage)
	game.stage.addChild(screenManager);
window.fx = effectLayer
	config.effectsLayer = effectLayer;
	screenManager.addScreen(gameScreen);
	screenManager.addScreen(initScreen);
	//change to init screen
	screenManager.forceChange("GAME");
	

	if(!config.isJuicy == 0){
		game.stage.addChild(effectLayer);
    }

	game.start();
}
