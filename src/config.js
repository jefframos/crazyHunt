	export default {
	cookieManager: null,
	width: 414,
	height: 736,
	bounds: {x:10, y:21},
	squareSize: 20,
	hitCorrection:{x:20,y:50},  
	buttonRadius: 30,
	debugAlpha: 0,
	isJuicy: 1,
	pixelSize: 2,
	pieceSize: 22,
	hardcore: false,
	webgl: true,
	currentLevel: 0,
	firstEntry:false,
	rendererOptions: {
		//pixi rendererOptions
		antialias: true,
		backgroundColor : 0x000000
	},
	  palette: {  	
		highlightColor:0xA547A4,
		tileColor:0xFFFFFF,
		playerColor:0x0040A5,
		playerHightlightColor:0x00FF00,
		opponentHightlightColor:0xFF0000,
		opponentColor:0xFF40A5,
		initScreen80:0xDB1993,
		winGameColor:0x16A51C,
		lostGameColor:0x8E0081,
		drawGameColor:0xA547A4,
		colors80:[
			0xFC3C3A, //red
			0xFFA226, //orange
			0x19db30, //green
			0x44A6C6, //light blue
			0xDB1993 //pink
		],
		currentGameStateColor: 0x00aa00,
		gameScreen80: 0xDB1993,
		effectsLayer:null,
	  },
	};
