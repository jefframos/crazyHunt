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

		this.shapesOrder = [];
		this.shapeStep = 0;
		for (var i = 50; i >= 0; i--) {
			this.shapesOrder.push(Math.floor(this.shapes.length * Math.random()))
		}
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
		this.gameMatrix = [];
		this.configGameMatrix(config.bounds.y,config.bounds.x);
		this.drawMatrix(config.pieceSize);
		this.initGame();

		this.addChild(this.gameContainer);
		this.gameContainer.position.x = config.width / 2 - this.gameContainer.width / 2;
		this.gameContainer.position.y = config.height / 2 - this.gameContainer.height / 2;

		utils.correctPosition(this.gameContainer);

		this.inputManager = new InputManager(this);
		// config.effectsLayer.removeBloom();
		setTimeout(function(){
			config.effectsLayer.addRGBSplitter();
		}.bind(this), 300);
		// config.effectsLayer.removePixelate();
		// config.effectsLayer.shake(1,15,1);
		// config.effectsLayer.addShockwave(0.5,0.5,0.8);
		// config.effectsLayer.shakeSplitter(1,10,1.8);
		// config.effectsLayer.fadeBloom(20,0,0.5,0, true);
		this.newEntity();
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
		console.log(toPrint);
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
		this.newEntity(this.rotateMatrixRight(this.currentShape), {x:ajdustedPositionX, y:ajdustedPositionY});
	}
	getShape(){
		this.shapeStep ++;
		if(this.shapeStep >= this.shapes.length){
			this.shapeStep = 0;
		}
		return this.shapes[this.shapeStep];
	}
	newEntity(shapeArray, starterPosition){
		this.currentEntityList = [];
		if(!shapeArray){
			this.currentShape = this.getShape();
			let rotationRandom = Math.floor(Math.random()*3);
			for (var i = rotationRandom - 1; i >= 0; i--) {
				this.currentShape = this.rotateMatrixRight(this.currentShape);
			}
		}else{
			this.currentShape = shapeArray;
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
		console.log(shouldMove);
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
		this.started = true;
		this.gameCounter = 0;
		this.normalizedDelta = 1;
	}
	//reset timer
	resetTimer(){
	}
	//end timer
	endTimer(){
	}
	//destroy game
	destroyGame(){
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
		this.border.tint = 0xFF00FF;
		this.border.drawRect(0,config.pixelSize,config.bounds.x*size + config.pixelSize ,config.bounds.y*size);
		this.gameContainer.addChild(this.border);

		// for (let i = 0; i < this.gameMatrix.length; i++) {
		// 	for (let j = 0; j < this.gameMatrix[i].length; j++) {
		// 		let description = new PIXI.Text(i+','+j,{font : '10px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		// 		// let description = new PIXI.Text(i+','+j,{font : '10px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		// 		this.gameContainer.addChild(description);
		// 		description.position.x = config.pieceSize * i;
		// 		description.position.y = config.pieceSize * j;
		// 	}
		// };

		// config.effectsLayer.removePixelate();
		// config.effectsLayer.removeRGBSplitter();
	}

	//
	stopAction(type){

	}
	updateAction(type){
		if(!this.canMove(type)){
			return;
		}
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(type == "left"){
				this.currentEntityList[i].position.x -= config.pieceSize;
			}else if(type == "right"){
				this.currentEntityList[i].position.x += config.pieceSize;
			}else if(type == "down"){
				this.currentEntityList[i].position.y += config.pieceSize / 2;
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
			let yNormal = (this.gameContainer.position.y + linesToRemove[0] * config.pieceSize) / config.height;
			let xNormal = (this.gameContainer.position.x + this.currentEntityList[0].x) / config.width;
			config.effectsLayer.addShockwave(xNormal,yNormal,1);
			config.effectsLayer.shakeX(0.5,5,0.5);
			config.effectsLayer.shakeY(0.5,5,0.5);
		}
		for (var i = linesToRemove.length - 1; i >= 0; i--) {			
			this.removeLine(linesToRemove[i]);
		}
	}
	removeLine(line) {
		let lineCounter = 0;
		for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
			if(this.gameMatrix[j][line]){
				this.gameContainer.removeChild(this.gameMatrix[j][line]);
				this.gameMatrix[j][line] = 0;
			}				
		}
		//console.log(this.gameMatrix);
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
				this.addOnMatrix();
				return true
			}
			let matrixContent = this.gameMatrix[Math.ceil(tempX)][roundedY + 1]
			if(matrixContent && matrixContent != 0){
				config.effectsLayer.shakeY(0.3,5,0.5);
				this.addOnMatrix();
				return true
			}
		}
	}
	addOnMatrix() {
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
			let tempX = (this.currentEntityList[i].position.x / config.pieceSize);
			let tempY = (this.currentEntityList[i].position.y / config.pieceSize);
			let roundedY = Math.ceil(tempY)
			this.gameMatrix[tempX][roundedY] = this.currentEntityList[i];
		}

		this.border.tint = this.currentColor;
		//console.log(tempX, roundedY);
	}
	verifyPosition() {
		//let tempX = (this.currentEntity.position.x / config.pieceSize);
		//let tempY = (this.currentEntity.position.y / config.pieceSize);

		
	}
	//SCREEN
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
	        particle.position.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y);
	        //particle.rotation = -particle.direction + Math.PI;
	        //particle.alpha += delta;
	        if(particle.position.x < 0 || particle.position.x > config.width || particle.y < 0){
	        	particle.x = Math.floor(config.width * Math.random() / 4) * 4;
		    	particle.y = (config.height) + 200 * Math.random();
	        }
		}
		this.particleUpdater += delta*20;
		if(this.particleUpdater > this.particles.length){
			this.particleUpdater = this.particles.length;
		}
	}
	//create new particles
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
		    particle.speed = -6 + Math.random() * 1.5;
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
	update(delta){
		delta *= this.normalizedDelta;
		super.update(delta);
		if(!this.started){
			return;
		}
		this.updateParticles();
		this.gameCounter += delta;
		if(this.gameCounter > 1){
			this.updateMove();
			this.gameCounter = 0;
		}
	}
}
