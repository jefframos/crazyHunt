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
	}
	build(){
		super.build();
		//create background shape
		this.background = new PIXI.Graphics();
		this.background.beginFill( 0x010101 );
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.addChild(this.background);
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
		}.bind(this), 1000);

		// config.effectsLayer.shake(1,15,1);
		// config.effectsLayer.addShockwave(0.5,0.5,0.8);
		// config.effectsLayer.shakeSplitter(1,10,1.8);
		// config.effectsLayer.fadeBloom(20,0,0.5,0, true);
		this.newEntity();
	}
	newEntity(){
		this.currentEntity = this.drawSquare();
		this.currentEntity.position.x = Math.ceil(config.bounds.x / 2) * config.pieceSize;
		this.gameContainer.addChild(this.currentEntity);
	}
	drawSquare(){
		let square = new PIXI.Graphics();
		square.beginFill( 0xFFFFFF );
	    square.drawRect( 0, 0, config.pieceSize, config.pieceSize);
	    return square;
	}
	//EVENTS
	removeEvents(){
		this.hardCoreButton.off('tap').off('click');
		this.startButton.off('tap').off('click');
		this.backButton.off('tap').off('click');
		this.pauseButton.off('tap').off('click');
		this.gameContainer.off('mousemove');
		this.off('tap').off('mouseup');
	}
	addEvents(){
		this.removeEvents();
	    this.hardCoreButton.on('tap', this.initGameHardcore.bind(this)).on('click', this.initGameHardcore.bind(this));	    
	    this.startButton.on('tap', this.initGameNormal.bind(this)).on('click', this.initGameNormal.bind(this));	    
	    this.backButton.on('tap', this.onBackCallback.bind(this)).on('click', this.onBackCallback.bind(this));	    
	    this.pauseButton.on('tap', this.onPauseCallback.bind(this)).on('click', this.onPauseCallback.bind(this));	    
	    this.gameContainer.on('mousemove', this.onMouseMoveCallback.bind(this));
	    this.on('mouseup', this.onGameClickCallback.bind(this)).on('tap', this.onGameClickCallback.bind(this));	    
	    //this.gameContainer.on('click', this.onGameClickCallback.bind(this)).on('tap', this.onGameClickCallback.bind(this));	    
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
		this.border.lineStyle(config.pixelSize,0xFF00FF);
		this.border.drawRect(0,config.pixelSize,config.bounds.x*size + config.pixelSize ,config.bounds.y*size);
		this.gameContainer.addChild(this.border);
		// config.bounds.x,config.bounds.y
	}
	//
	stopAction(type){

	}
	updateAction(type){
		if(!this.canMove(type)){
			return;
		}
		if(type == "left"){
			this.currentEntity.position.x -= config.pieceSize;
		}else if(type == "right"){
			this.currentEntity.position.x += config.pieceSize;
		}else if(type == "down"){
			this.currentEntity.position.y += config.pieceSize / 2;
		}
		this.verifyPosition();
	}
	updateMove(){
		if(!this.canMove("down")){
			return;
		}
		this.currentEntity.position.y += config.pieceSize / 2;
		this.verifyPosition();
	}
	canMove(type) {
		let tempX = (this.currentEntity.position.x / config.pieceSize);
		let tempY = (this.currentEntity.position.y / config.pieceSize);
		let downCollide = false;
		if(type == "left"){
			if(tempX - 1 < 0){
				config.effectsLayer.shakeX(0.2,5,0.3);
				return false
			}
		}else if(type == "right"){
			if(tempX >= config.bounds.x - 1){
				config.effectsLayer.shakeX(0.2,5,0.3);				
				return false
			}
		}else if(type == "down"){
			downCollide = this.verifyDown();			
			
		}
		if(downCollide){
			this.newEntity();
			return false
		}			
		
		return true
	}
	
	verifyDown() {
		let tempX = (this.currentEntity.position.x / config.pieceSize);
		let tempY = (this.currentEntity.position.y / config.pieceSize);
		let roundedY = Math.floor(tempY);
		console.log(tempX, roundedY);
		
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
	addOnMatrix() {
		let tempX = (this.currentEntity.position.x / config.pieceSize);
		let tempY = (this.currentEntity.position.y / config.pieceSize);
		let roundedY = Math.ceil(tempY)
		this.gameMatrix[tempX][roundedY] = 1;
		//console.log(tempX, roundedY);
	}
	verifyPosition() {
		let tempX = (this.currentEntity.position.x / config.pieceSize);
		let tempY = (this.currentEntity.position.y / config.pieceSize);

		
	}
	//SCREEN
	onBackCallback() {
		
	}
	toInit(){
		
	}


	//PARTICLES
	//update particles position
	updateParticles(delta){
		for (var i = 0; i < this.particleUpdater; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction += particle.turningSpeed * 0.01;
	        particle.position.x += Math.sin(particle.direction) * (particle.speed * particle.scale.y);
	        particle.position.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y);
	        particle.rotation = -particle.direction + Math.PI;
	        particle.alpha += delta;
	        if(particle.position.x < 0 || particle.position.x > config.width || particle.y < 0){
	        	particle.x = config.width / 2 + Math.sin(particle.direction) * 100;
		    	particle.y = config.height / 2 + Math.cos(particle.direction) * 50;
		    	particle.alpha = 0;
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
		    particle.anchor.set(0.5, 1);
		    particle.scale.set(1, 1);
		    let angle = (Math.random() * 180 + 90) /180 * Math.PI;
		    particle.x = config.width / 2 + Math.sin(angle) * 100;
		    particle.y = config.height / 2 + Math.cos(angle) * 50;
		    particle.alpha = 0;
		    particle.direction = angle;
		    particle.turningSpeed = 0;
		    particle.speed = 1 + Math.random() * 1.5;
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
		this.gameCounter += delta;
		if(this.gameCounter > 1){
			this.updateMove();
			this.gameCounter = 0;
		}
	}
}
