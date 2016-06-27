import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import InputManager  from '../InputManager';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import Line from '../entity/Line'
import PauseContainer from '../container/PauseContainer'
import EndContainer from '../container/EndContainer'

export default class GameScreen extends Screen{
	constructor(label){
		super(label);

		this.shapes = [
		[
			[0,0,0,0],
			[0,1,1,0],
			[0,1,1,0],
			[0,0,0,0],
		],[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
		],
		[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
		],
		[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
		],
		[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,1,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
		],
		[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
		],
		[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],			
		],
		]


	}
	shuffleText(label){
		let rnd1 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let rnd2 = Math.floor(Math.random()* 9);
		let rnd3 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let tempLabel = label.split('');
		let rndPause = Math.random();
		if(rndPause < 0.2){
			let pos1 = Math.floor(Math.random()*tempLabel.length);
			let pos2 = Math.floor(Math.random()*tempLabel.length);
			if(tempLabel[pos1] != '\n')
				tempLabel[pos1] = rnd2;
			if(tempLabel[pos2] != '\n')
				tempLabel[pos2] = rnd3;
		}else if(rndPause < 0.5){
			let pos3 = Math.floor(Math.random()*tempLabel.length);
			if(tempLabel[pos3] != '\n')
				tempLabel[pos3] = rnd3;
		}
		let returnLabel = '';
		for (var i = 0; i < tempLabel.length; i++) {
			returnLabel+=tempLabel[i];
		}
		return returnLabel
	}
	goToPortfolio() {
		 window.open('http://www.jefframos.me', '_blank');
	}
	build(){
		super.build();
		//create background shape
		this.background = new PIXI.Graphics();
		this.background.beginFill( 0x101010);
	    this.background.drawRect( -100, -100, config.width + 200, config.height+ 200);
		this.addChild(this.background);
		
		this.createParticles();

		this.gameContainer = new PIXI.Container();
		this.gameQueueContainer = new PIXI.Container();
		this.gameBorderContainer = new PIXI.Container();
		this.gameMatrix = [];
		

		this.filterLabel = "JUST";
		this.filterDescription = new PIXI.Text(this.filterLabel,{font : '70px super_smash_tvregular', fill : 0xBBBBBB, align : 'center'});
		
		this.initGame();

		this.addChild(this.gameContainer);
		this.addChild(this.gameQueueContainer);
		this.addChild(this.gameBorderContainer);
		this.gameContainer.position.x = 50;//config.width / 2 - this.gameContainer.width / 1.5;
		this.gameContainer.position.y = config.height / 2 - this.gameContainer.height / 2 + 100;
		
		this.gameContainer.pivot.x = this.gameContainer.width / 2;
		this.gameContainer.pivot.y = this.gameContainer.height / 2;

		this.gameContainer.position.x += this.gameContainer.pivot.x;
		this.gameContainer.position.y += this.gameContainer.pivot.y;

		//gambiarra pra mudar a borda
		this.gameBorderContainer.pivot.x = this.gameContainer.pivot.x;
		this.gameBorderContainer.pivot.y = this.gameContainer.pivot.y;
		
		this.gameBorderContainer.position.x = this.gameContainer.position.x;
		this.gameBorderContainer.position.y = this.gameContainer.position.y;


		this.gameBorderContainer.addChild(this.border);


		let descriptionNext = new PIXI.Text('NEXT',{font : '44px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.gameQueueContainer.position.y = this.gameContainer.position.y - this.gameContainer.pivot.y;
		this.gameQueueContainer.addChild(descriptionNext);
		descriptionNext.position.x = 20;

		this.filterDescription.position.x = this.gameBorderContainer.width / 2 - this.filterDescription.width / 2;
		this.filterDescription.position.y = this.gameBorderContainer.height / 2 - this.filterDescription.height;
		

		utils.correctPosition(this.gameContainer);

		this.inputManager = new InputManager(this);
		// config.effectsLayer.removeBloom();
		setTimeout(function(){
			config.effectsLayer.addRGBSplitter();
		}.bind(this), 300);


		this.creatorLabel = new PIXI.Text('by Jeff Ramos',{font : '36px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.creatorLabel.interactive = true;
		this.creatorLabel.buttonMode = true;
		utils.addMockRect(this.creatorLabel, this.creatorLabel.width, this.creatorLabel.height);
		this.creatorLabel.on('tap', this.goToPortfolio.bind(this)).on('click', this.goToPortfolio.bind(this));
		this.addChild(this.creatorLabel);
		this.creatorLabel.position.x = config.width - this.creatorLabel.width;
		this.creatorLabel.position.y = 20;
		// config.effectsLayer.removePixelate();
		// config.effectsLayer.shake(1,15,1);
		// config.effectsLayer.addShockwave(0.5,0.5,0.8);
		// config.effectsLayer.shakeSplitter(1,10,1.8);
		this.labelPoints = new PIXI.Text('000000',{font : '70px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.addChild(this.labelPoints);
		this.labelPoints.position.x = config.width - this.labelPoints.width;
		this.labelPoints.position.y = 80;
	}
	drawShapeOnList(array){
		let shape = new PIXI.Container();
		let starterPosition = {x:0,y:0};
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array[i].length; j++) {
				if(array[i][j]){
					let currentEntity = this.drawSquare(this.currentColor);
					currentEntity.position.x = starterPosition.x + j * config.pieceSize;
					currentEntity.position.y = i * config.pieceSize - (array[i].length - 2) * config.pieceSize - config.pieceSize/2 + starterPosition.y;
					shape.addChild(currentEntity);
				}
			}
		}
		return shape;
	}
	changeFilter(){
		let nextID = this.currentEffectID;
		if(this.currentEffectID >= 0){
			nextID = -1;
		}else{
			//nao shuffle
			nextID = Math.floor(Math.random() * 7)
		}
		if(this.currentEffectID < 9999){
			this.standardLabels = ['SIMPLE','JUICY','FUN','CRAZY?']
			this.filterLabel = this.standardLabels[Math.floor(Math.random()*this.standardLabels.length)];
		}
		switch(this.currentEffectID){
			case 0:
				//this.currentEffect = "INVERT";
				config.effectsLayer.removeInvert();
				config.effectsLayer.removeAllFilters();
			break
			case 1:
				//this.currentEffect = "CROSS";
				config.effectsLayer.removeAllFilters();
			break
			case 2:
				//this.currentEffect = "ASCII";
				config.effectsLayer.removeAllFilters();
				this.gameContainer.scale.y = 1;
				this.gameBorderContainer.scale.y = 1;

				this.gameContainer.position.y += 100;
				this.gameBorderContainer.position.y += 100;
			break
			case 3:
				this.gameContainer.scale.y = 1;
				this.gameBorderContainer.scale.y = 1;
			break
			case 4:
				this.gameContainer.scale.x = 1;
				this.gameBorderContainer.scale.x = 1;
			case 5:
				config.effectsLayer.removeAllFilters();
			case 6:
				config.effectsLayer.removeAllFilters();
			case 7:
				this.randomizeCrazy = false;
			default:
				config.effectsLayer.removeAllFilters();
				this.linearParticles();
				break
		}
		config.effectsLayer.filtersActives[this.ID_GLITCH1] = true;
		config.effectsLayer.addRGBSplitter();
		config.effectsLayer.updatePixelate(config.pixelSize,config.pixelSize);

		switch(nextID){
			case 0:
				//this.currentEffect = "INVERT";
				config.effectsLayer.addInvert();
				config.effectsLayer.shakeSplitter(1,6,0.3);
				this.filterLabel = "INVERT"
			break
			case 1:
				//this.currentEffect = "CROSS";
				config.effectsLayer.removeAllFilters();
				config.effectsLayer.addCrossHatch();
				this.filterLabel = "CROSS"
			break
			case 2:
				//this.currentEffect = "ASCII";
				config.effectsLayer.removeAllFilters();
				config.effectsLayer.addAscii();
				this.gameContainer.scale.y = -1;
				this.gameBorderContainer.scale.y = -1;

				this.gameContainer.position.y -= 100;
				this.gameBorderContainer.position.y -= 100;
				this.filterLabel = "OLD\nTIMES"
			break
			case 3:
				this.gameContainer.scale.y = -1;
				this.gameBorderContainer.scale.y = -1;
				config.effectsLayer.removeAllFilters();
			 	config.effectsLayer.fadeBloom(20,0,0.5,0, true);
				config.effectsLayer.shakeSplitter(1,6,0.3);
				this.filterLabel = "INVERT Y"
			break
			case 4:
				this.gameContainer.scale.x = -1;
				this.gameBorderContainer.scale.x = -1;
				config.effectsLayer.removeAllFilters();
			 	config.effectsLayer.fadeBloom(20,0,0.5,0, true);
				config.effectsLayer.shakeSplitter(1,6,0.3);
				this.filterLabel = "X TREVNI"

			break
			case 5:
				config.effectsLayer.shakeSplitter(1,6,0.3);
				config.effectsLayer.addGray();
				config.effectsLayer.addBlur();
				this.filterLabel = "NOT COOL"
			break
			case 6:
				config.effectsLayer.addGlitch2();
				this.filterLabel = "PROBL3M"
				//config.effectsLayer.addBloom();
			break
			case 7:
				this.randomizeCrazy = true;
				this.randomParticles();
				this.filterLabel = "SHUFFLE"
			break
			default:
				config.effectsLayer.shakeSplitter(1,10,0.5);
				break
			break
		}
		this.currentEffectID = nextID;
	}
	printMatrix(shapeArray){
		let tempLine;
		let toPrint = '';
		for (var i = 0; i < shapeArray.length; i++) {
			tempLine = '';
			for (var j = 0; j < shapeArray[i].length; j++) {
				tempLine += shapeArray[i][j]
			}
			toPrint += tempLine +'\n';
		}
		// console.log(toPrint);
	}
	rotateMatrixRight(shapeArray){
    	let temp = new Array(shapeArray.length);
	    for(let i = 0; i < temp.length; ++i){
	        temp[i] = new Array(temp.length);
	        for (let j = 0; j < temp.length; ++j){
	            temp[i][j] = shapeArray[temp.length - j - 1][i];
	        }
	    }
	    return temp;
	}

	rotatePiece(){
		let minY = 99999;
		let maxY = -99999;
		let minX = 99999;
		let maxX = -99999;
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(this.currentEntityList[i].position.x > maxX){
				maxX = this.currentEntityList[i].position.x;
			}
			if(this.currentEntityList[i].position.x < minX){
				minX = this.currentEntityList[i].position.x;
			}
			if(this.currentEntityList[i].position.y > maxY){
				maxY = this.currentEntityList[i].position.y;
			}
			if(this.currentEntityList[i].position.y < minY){
				minY = this.currentEntityList[i].position.y;
			}
			this.gameContainer.removeChild(this.currentEntityList[i]);
		}
		let ajdustedPositionY = maxY + (maxY - minY) / 2;
		let ajdustedPositionX = minX + (maxX - minX) / 2 ;
		ajdustedPositionX = Math.floor(ajdustedPositionX / config.pieceSize) * config.pieceSize;

		if(this.randomizeCrazy){
			let id = Math.floor(Math.random()*this.shapes.length);
			this.newEntity(this.shapes[id], {x:ajdustedPositionX, y:ajdustedPositionY}, true);
		}else{
			this.newEntity(this.rotateMatrixRight(this.currentShape), {x:ajdustedPositionX, y:ajdustedPositionY});
		}
	}
	updateQueue(){
		for (var i = this.shapeQueue.length - 1; i >= 0; i--) {
			this.gameQueueContainer.removeChild(this.shapeQueue[i]);
		}
		let totalQueue = 3;
		let tempShape;
		let tempId;
		let newId = 0;
		for (var i = 0; i < totalQueue; i++) {
			tempId = this.shapeStep + i + 1;
			if(tempId >= this.shapesOrder.length){
				tempId = newId;
				newId ++;
			}
			tempShape = this.drawShapeOnList(this.shapes[this.shapesOrder[tempId]]);
			this.shapeQueue.push(tempShape);
			this.gameQueueContainer.addChild(tempShape);
			tempShape.position.y = 130 * (i + 1);
		}

		this.gameQueueContainer.position.x = config.width  - 120;
	}
	getShape(){
		this.shapeStep ++;
		if(this.shapeStep >= this.shapesOrder.length){
			this.shapeStep = 0;
		}
		return this.shapes[this.shapesOrder[this.shapeStep]];
	}
	newEntity(shapeArray, starterPosition, randomRotate){
		this.currentEntityList = [];
		if(!shapeArray){
			this.currentShape = this.getShape();
			this.updateQueue();
		}else{
			this.currentShape = shapeArray;
		}

		if(randomRotate){
		let rotationRandom = Math.floor(Math.random()*3);
			for (var i = rotationRandom - 1; i >= 0; i--) {
				this.currentShape = this.rotateMatrixRight(this.currentShape);
			}
		}
		
		let starterXPosition = 0;
		if(!starterPosition){
			starterPosition = {x:0,y:0};
			starterXPosition = (Math.ceil(config.bounds.x / 2) - 2) * config.pieceSize;
		}else{
			starterXPosition = starterPosition.x - (2 * config.pieceSize);
		}
		let shouldMove = 0;
		this.currentColor = config.palette.colors80[Math.floor(config.palette.colors80.length * Math.random())];
		for (var i = 0; i < this.currentShape.length; i++) {
			for (var j = 0; j < this.currentShape[i].length; j++) {
				if(this.currentShape[i][j]){
					let currentEntity = this.drawSquare(this.currentColor);
					currentEntity.position.x = starterXPosition + j * config.pieceSize;
					currentEntity.position.y = i * config.pieceSize - (this.currentShape[i].length - 2) * config.pieceSize - config.pieceSize/2 + starterPosition.y;
					this.currentEntityList.push(currentEntity);
					this.gameContainer.addChild(currentEntity);
					if(currentEntity.position.x < 0){
						shouldMove = 1;
					}else if(currentEntity.position.x >= config.bounds.x* config.pieceSize){
						shouldMove = -1;
					}
				}
			}
		}
		this.updateVisibleParts();
		// console.log(shouldMove);
		if(shouldMove){
			for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
				this.currentEntityList[i].position.x += config.pieceSize * shouldMove;
			}
		}
	}
	drawSquare(color){
		let square = new PIXI.Graphics();
		square.beginFill( color );
	    square.drawRect( 2, 2, config.pieceSize -4, config.pieceSize-4);
	    return square;
	}
	//EVENTS
	removeEvents(){
	}
	addEvents(){
		this.removeEvents();	    	    
	}
	onMouseMoveCallback(e) {
		if(!this.started || this.ended){
			return;
		}
		let width = e.target.width * e.target.scale.x- this.dotRadius/2;
		let realativePosition = e.data.global.x - (e.target.position.x - width/ 2) - this.dotRadius/2;
		//console.log(e.data.global.x, e.target.position.x, e.target.width , e.target.scale.x,this.dotRadius/2, 'move');
		if(config.isJuicy){
			this.findCol(realativePosition + config.hitCorrection.x, width);
		}else{
			this.findCol(realativePosition, width);
		}
	}
	onGameClickCallback(e) {
		
	}
	onPauseCallback() {
		
	}

	//GAMEPLAY
	
	//end game
	endGame() {
		
	}
	forceHideGame(){
		
	}
	forceShowGame(){
		
	}
	
	
	initGame() {
		// this.started = true;
		this.gameCounter = 0;
		this.downSpeedIncrease = 0;
		this.normalizedDelta = 1;
		this.currentColor = config.palette.colors80[Math.floor(config.palette.colors80.length * Math.random())];
		this.shapesOrder = [];
		this.shapeStep = 0;
		this.shapeQueue = [];
		this.points = 0;
		this.gameLevelSpeedMax = 1;
		this.gameLevelSpeed = this.gameLevelSpeedMax;
		this.scoring = 0;
		//force to reset filter
		this.currentEffectID = 99999;
		this.changeFilter();

		for (var i = 100; i >= 0; i--) {
			this.shapesOrder.push(Math.floor(this.shapes.length * Math.random()))
		}

		this.configGameMatrix(config.bounds.y,config.bounds.x);
		this.drawMatrix(config.pieceSize);
		
		this.updateQueue();
		setTimeout(function(){
			this.started = true;
			this.downSpeedIncrease = 0;
			this.newEntity();
		}.bind(this), 300);
		
		this.gameContainer.addChild(this.filterDescription);

	}
	//reset timer
	resetTimer(){
	}
	//end timer
	endTimer(){
	}
	//destroy game
	destroyGame(){
		while(this.gameContainer.children.length){

			this.gameContainer.removeChildAt(0);
		}
		// for (var i = this.gameContainer.chidren.length - 1; i >= 0; i--) {
		// }
		for (var i = this.shapeQueue.length - 1; i >= 0; i--) {
			this.gameQueueContainer.removeChild(this.shapeQueue[i]);
		}
		this.removeEvents();
	}


	//INITIALIZE
	//create matrix based on game bounds
	configGameMatrix(i,j) {
		this.gameMatrix = [];
	    this.entityMatrix = [];
		let tempArray = [];
		let tempArray2 = [];
		for (let jj = 0; jj < j; jj++) {
			tempArray = [];
			tempArray2 = [];
			for (let ii = 0; ii < i; ii++) {
				tempArray.push(0);
				tempArray2.push(0);
			}
			this.gameMatrix.push(tempArray2);
			this.entityMatrix.push(tempArray);
		};
	}
	//draw dots on screen
	drawMatrix(size) {
		this.border = new PIXI.Graphics();
		this.border.lineStyle(config.pixelSize*2,0xFFFFFF);
		this.border.alpha = 0.8;
		this.border.tint = this.currentColor;
		this.border.drawRect(0,config.pixelSize/2,config.bounds.x*size + config.pixelSize ,config.bounds.y*size);
		this.gameContainer.addChild(this.border);
	}

	//
	stopAction(type){
		if(!this.started){
			return;
		}
		if(type == "down"){
			this.downSpeedIncrease = 0;
		}
	}
	updateVisibleParts(){
		let haveOne = false;
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(this.currentEntityList[i].position.y < 0){
				this.currentEntityList[i].alpha = 0;
				haveOne = true;
			}else{

				this.currentEntityList[i].alpha = 1;
			}
		}
		return haveOne;
	}
	updateAction(type){
		if(!this.started){
			return;
		}
		if(!this.canMove(type)){
			return;
		}
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(type == "left"){
				this.currentEntityList[i].position.x -= config.pieceSize;
			}else if(type == "right"){
				this.currentEntityList[i].position.x += config.pieceSize;
			}else if(type == "down"){
				// this.currentEntityList[i].position.y += config.pieceSize / 2;
				this.downSpeedIncrease = 200;
			}
		}
		this.verifyPosition();
	}
	updateMove(){
		if(!this.canMove("down")){
			return;
		}		
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			this.currentEntityList[i].position.y += config.pieceSize / 2;
			this.verifyPosition();
		}
		this.updateVisibleParts();
	}
	canMove(type) {
		if(type == "up"){
			this.rotatePiece();				
		}
		else
		{
			for (var i = this.currentEntityList.length - 1; i >= 0; i--) {		
				let tempX = (this.currentEntityList[i].position.x / config.pieceSize);
				let tempY = (this.currentEntityList[i].position.y / config.pieceSize);
				let downCollide = false;
				if(type == "left"){
					if(tempX - 1 < 0|| this.verifySide(type)){
						config.effectsLayer.shakeX(0.2,5,0.3);
						return false
					}
					this.verifySide(type);
				}else if(type == "right"){
					if(tempX >= config.bounds.x - 1 || this.verifySide(type)){
						config.effectsLayer.shakeX(0.2,5,0.3);
						return false
					}
				}else if(type == "down"){
					downCollide = this.verifyDown();
					}
				if(downCollide){
					this.verifyLines();
					//this.started = false;
					this.newEntity();
					return false
				}			
			}
		}
		this.updateVisibleParts();
		return true
	}
	verifyLines() {
		let lineCounter = 0;
		let height = this.gameMatrix[0].length - 1;
		let linesToRemove = [];
		for (var i = height; i >= 0; i--) {
			lineCounter = 0;
			for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
				if(this.gameMatrix[j][i]){
					lineCounter ++;
				}				
			}
			if(lineCounter >= this.gameMatrix.length){
				linesToRemove.push(i);
			}
		}
		if(linesToRemove.length > 0){
			let yNormal = ((this.gameContainer.position.y - this.gameContainer.pivot.y) + linesToRemove[0] * config.pieceSize) / config.height;
			let xNormal = ((this.gameContainer.position.x - this.gameContainer.pivot.x) + this.currentEntityList[0].x) / config.width;
			config.effectsLayer.addShockwave(xNormal,yNormal,1);
			config.effectsLayer.shakeX(0.5,5,0.5);
			config.effectsLayer.shakeY(0.5,5,0.5);

			//console.log(this.gameMatrix);
			this.scoring ++;

			if(this.scoring == 1){
				this.filterLabel = "JUST\nA"
			}else if(this.scoring == 2){
				this.filterLabel = "JUST\nA\nSIMPLE"
			}else if(this.scoring == 3){			
				this.filterLabel = "TETRIS?"
			}else{
				this.changeFilter();
			}
		}
		for (var i = linesToRemove.length - 1; i >= 0; i--) {			
			this.removeLine(linesToRemove[i]);
		}
	}
	addPoints() {
		this.points += 10;
	}
	removeLine(line) {
		
		let lineCounter = 0;
		
		let timeline = new TimelineLite();
		for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
			if(this.gameMatrix[j][line]){
				this.gameContainer.removeChild(this.gameMatrix[j][line]);
				this.gameMatrix[j][line] = 0;
				timeline.add(TweenLite.to(this, 0.1, {onComplete: this.addPoints, onCompleteScope: this}));
				
			}				
		}
		
		let upTo = line - 1;
		for (var i = this.gameMatrix.length - 1; i >= 0; i--) {
			for (var j = upTo; j >= 0; j--) {
				if(this.gameMatrix[i][j]){
					this.gameMatrix[i][j].position.y += config.pieceSize;
					this.gameMatrix[i][j+1] = this.gameMatrix[i][j];
					this.gameMatrix[i][j] = 0;
				}
			}
		}

	}
	verifySide(type) {
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
			let tempX = (this.currentEntityList[i].position.x / config.pieceSize) + (type=="left"?-1:1);
			let tempY = (this.currentEntityList[i].position.y / config.pieceSize) + 0.5;
			let roundedY = Math.floor(tempY);
			let roundedX = Math.floor(tempX);
			if(tempX < 0 || tempX >= this.gameMatrix.length){
				return true
			}
			let matrixContent = this.gameMatrix[roundedX][roundedY]
			if(matrixContent && matrixContent != 0){
				return true
			}
		}
	}
	
	verifyDown() {
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
			let tempX = (this.currentEntityList[i].position.x / config.pieceSize);
			let tempY = (this.currentEntityList[i].position.y / config.pieceSize);
			let roundedY = Math.floor(tempY);
			if(roundedY >= config.bounds.y - 1){
				config.effectsLayer.shakeY(0.3,5,0.5);
				this.addOnMatrix(true);
				return true
			}
			let matrixContent = this.gameMatrix[Math.ceil(tempX)][roundedY + 1]
			if(matrixContent && matrixContent != 0){
				config.effectsLayer.shakeY(0.3,5,0.5);
				this.addOnMatrix(true);
				return true
			}
		}
	}
	addOnMatrix(isColided) {
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
			let tempX = (this.currentEntityList[i].position.x / config.pieceSize);
			let tempY = (this.currentEntityList[i].position.y / config.pieceSize);
			let roundedY = Math.ceil(tempY)
			this.gameMatrix[tempX][roundedY] = this.currentEntityList[i];
		}
		if(isColided && this.updateVisibleParts()){
			this.gameOver();
		}
		this.border.tint = this.currentColor;
		
		//console.log(tempX, roundedY);
	}
	gameOver() {
		this.downSpeedIncrease = 0;
		this.started = false;
		this.destroyGame();
		this.initGame();		
	}
	//SCREEN
	verifyPosition() {
	}
	onBackCallback() {
		
	}
	toInit(){
		
	}


	//PARTICLES
	//update particles position
	updateParticles(delta){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction += particle.turningSpeed * 0.01;
	        particle.position.x += Math.sin(particle.direction) * (particle.speed * particle.scale.y);
	        particle.position.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y) - (delta * 0.7);
	        //particle.rotation = -particle.direction + Math.PI;
	        //particle.alpha += delta;
	        if(particle.position.x < 0 || particle.position.x > config.width || particle.y < 0){
	        	particle.x = Math.floor(config.width * Math.random() / 4) * 4;
		    	particle.y = (config.height) + 200 * Math.random();
	        }
		}
		// this.particleUpdater += delta*20;
		// if(this.particleUpdater > this.particles.length){
		// 	this.particleUpdater = this.particles.length;
		// }
	}
	//create new particles
	randomParticles(){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction = ((Math.random() * 180 - 90) /180 * Math.PI);
	    }
	}
	linearParticles(){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction = 0;
	    }
	}
	createParticles(){
		this.particleUpdater = 0;
		this.particlesContainer = new PIXI.ParticleContainer(500, {
		    scale: true,
		    position: true,
		    rotation: true,
		    uvs: true,
		    alpha: true
		});
		this.addChild(this.particlesContainer);
		this.particles = [];
		for (let i = 0; i < 50; i++)
		{
		    let particle = PIXI.Sprite.fromImage('./assets/particle2.png');
		    particle.anchor.set(1, 1);
		    particle.scale.set(1, 0.5);
		    // let angle = (Math.random() * 180 + 90) /180 * Math.PI;
		    // particle.x = config.width / 2 + Math.sin(angle) * 100;
		    // particle.y = config.height / 2 + Math.cos(angle) * 50;

		    particle.x = Math.floor(config.width * Math.random() / 4) * 4;
		    particle.y = (config.height + 200) * Math.random();


		    particle.alpha = Math.random();
		    particle.direction = 0;
		    particle.turningSpeed = 0;
		    particle.speed = -8 + Math.random() * 1.5;
		    this.particles.push(particle);
		    this.particlesContainer.addChild(particle);
		}
	}

	//UPDATE
	//update timer
	updateTimer(delta){
		
		if(this.ended){
			return;
		}
		
	}
	//game update
	updatePoints(){
		let str = '000000';
		if(this.points < 10){
			str = '00000'+this.points
		}else if(this.points < 100){
			str = '0000'+this.points
		}else if(this.points < 1000){
			str = '000'+this.points
		}else if(this.points < 10000){
			str = '00'+this.points
		}else if(this.points < 100000){
			str = '0'+this.points
		}else{
			str = this.points
		}
		if(this.points > 0){
			this.gameLevelSpeed = this.gameLevelSpeedMax - Math.floor(this.points / 200) * 0.05;
		}
		if(this.gameLevelSpeed < 0.08){
			this.gameLevelSpeed = 0.08;
		}
		this.labelPoints.text = str;
	}
	update(delta){
		delta *= (this.normalizedDelta + this.downSpeedIncrease);
		super.update(delta);
		if(!this.started){
			return;
		}
		this.updateParticles(delta);
		this.gameCounter += delta;
		if(this.gameCounter > this.gameLevelSpeed){
			this.updateMove();
			this.gameCounter = 0;
		}
		this.creatorLabel.text = this.shuffleText('By JEFF RAMOS');

		this.filterDescription.text = this.shuffleText(this.filterLabel);
		this.filterDescription.position.x = (this.gameBorderContainer.width * this.gameContainer.scale.x / 2 - this.filterDescription.width / 2) ;
		this.filterDescription.position.y = this.gameBorderContainer.height * this.gameContainer.scale.y / 2 - this.filterDescription.height;
		if(this.filterDescription.tint != this.currentColor){
			this.filterDescription.tint = this.currentColor;
		}

		this.updatePoints();
		
	}
}
