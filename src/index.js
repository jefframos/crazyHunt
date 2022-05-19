import plugins from './plugins';
import config  from './config';
import Game from './Game';
import EffectLayer from './game/EffectLayer';
import GameScreen from './game/screen/GameScreen';
import InitScreen from './game/screen/InitScreen';
import ScreenManager from './screenManager/ScreenManager';
import CookieManager  from './game/CookieManager';

window.isMobile =  navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

PIXI.loader
	.add('./assets/tvlines.png')
	.add('./assets/glitch1.jpg')
	.add('./assets/particle2.png')
	.add('./assets/fonts/super_smash_tv-webfont.woff')
	.add('./assets/fonts/super_smash_tv-webfont.woff2')
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/fonts/specimen_files/specimen_stylesheet.css')
	.load(configGame);

function configGame(){

	var type = window.location.hash.substr(1);
	if(type == "NOJUICY"){
		config.isJuicy = 0;
	}

	let game = new Game(config);
	let cookieManager = new CookieManager();
	config.cookieManager = cookieManager;

	if(!config.cookieManager.getCookie("bestPoints")){
		config.cookieManager.createCookie("bestPoints",0,365)
	}
	//create screen manager
	let screenManager = new ScreenManager();

	game.screenManager = screenManager;
	//add screens
	let gameScreen = new GameScreen("GAME");
	let initScreen = new InitScreen("INIT");
	//add effect layer
	let effectLayer = new EffectLayer(screenManager);
	game.stage.addChild(screenManager);

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
