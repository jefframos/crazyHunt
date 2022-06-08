import config from '../config';
export default class InputManager {
	constructor(game) {
		this.game = game;
		document.addEventListener('keydown', (event) => {
			this.getKey(event);
			event.preventDefault()
		})

		document.addEventListener('keyup', (event) => {
			this.getUpKey(event);
			event.preventDefault()
		})
		//document.body.on('keydown', this.getKey.bind(this));
		this.keysContainer = new PIXI.Container();
		this.left = this.getSquare('button-border.png', 'left2.png');
		this.keysContainer.addChild(this.left)
		this.left.interactive = true;
		this.left.buttonMode = true;
		this.left.on('touchstart', this.pressLeft.bind(this)).on('mousedown', this.pressLeft.bind(this))
		this.left.on('touchend', this.stopLeft.bind(this)).on('mouseup', this.stopLeft.bind(this))
		
		this.up = this.getSquare('button-border.png', 'rotate.png');
		this.keysContainer.addChild(this.up)
		this.up.interactive = true;
		this.up.buttonMode = true;
		this.up.on('touchstart', this.pressUp.bind(this)).on('mousedown', this.pressUp.bind(this))
		this.up.on('touchend', this.stopUp.bind(this)).on('mouseup', this.stopUp.bind(this))

		this.right = this.getSquare('button-border.png', 'right2.png');
		this.keysContainer.addChild(this.right)
		this.right.interactive = true;
		this.right.buttonMode = true;
		this.right.on('touchstart', this.pressRight.bind(this)).on('mousedown', this.pressRight.bind(this))
		this.right.on('touchend', this.stopRight.bind(this)).on('mouseup', this.stopRight.bind(this))
		

		this.down = this.getSquare('button-border.png', 'down2.png',125);
		this.keysContainer.addChild(this.down)
		this.down.interactive = true;
		this.down.buttonMode = true;
		this.down.on('touchstart', this.pressSpace.bind(this)).on('mousedown', this.pressSpace.bind(this))
		this.down.on('touchend', this.stopSpace.bind(this)).on('mouseup', this.stopSpace.bind(this))


		let w = 75
		let h = 75
		this.right.hitArea = new PIXI.Rectangle(-w*0.1,-h*0.4, w * 2.2,  h * 1.8);
		this.up.hitArea = new PIXI.Rectangle(-w*0.1,-h*0.5, w * 2.2,  h * 2.2);
		this.left.hitArea = new PIXI.Rectangle(-w*1.1,-h*0.2, w * 2.2,  h * 1.2);
		this.down.hitArea = new PIXI.Rectangle(0,-h*0.5, 125,  h * 2);

		let size = 120
		this.right.x += size * 2
		this.up.x += size * 2
		this.up.y -= size - 25
		this.down.x += size - 25

		this.keysContainer.x = config.width / 2 - this.keysContainer.width /2
		this.keysContainer.y = config.height - 92
		this.keysContainer.alpha = 1
		
		if(window.isMobile){
			this.game.allContainer.addChild(this.keysContainer)
		}
	}
	stopLeft(){
		this.game.stopAction('left')
	}
	pressLeft(){
		this.game.updateAction('left')
	}

	stopUp(){
		this.game.stopAction('up')
	}
	pressUp(){
		this.game.updateAction('up')
	}

	stopSpace(){
		this.game.stopAction('space')
	}
	pressSpace(){
		this.game.updateAction('space')
	}

	stopRight(){
		this.game.stopAction('right')
	}
	pressRight(){
		this.game.updateAction('right')
	}
	getSquare(src,iconSrc,  w = 75, h = 75) {
		let shape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(src), 10, 10, 10, 10)
        shape.width = w
        shape.height = h
		let icon = new PIXI.Sprite.fromFrame(iconSrc);
		icon.anchor.set(0.5)
		icon.x = w/2
		icon.y = h/2

		shape.addChild(icon)
		return shape
	}
	//
	getKey(e) {
		//   	if(e.keyCode === 87 || e.keyCode === 38){
		// 	this.game.updateAction('up');
		// }
		if (e.keyCode === 83 || e.keyCode === 40) {
			this.game.updateAction('down');
		}
		else if (e.keyCode === 65 || e.keyCode === 37) {
			this.game.updateAction('left');
		}
		else if (e.keyCode === 68 || e.keyCode === 39) {
			this.game.updateAction('right');
		} else if (e.keyCode === 32) {
			// this.game.changeFilter();
			this.game.updateAction('space');
		}
	}

	getUpKey(e) {
		//   	if(e.keyCode === 83 || e.keyCode === 40){
		// 	this.game.stopAction('down');
		// }
		if (e.keyCode === 83 || e.keyCode === 40) {
			this.game.stopAction('down');
		}
		else if (e.keyCode === 65 || e.keyCode === 37) {
			this.game.stopAction('left');
		}
		else if (e.keyCode === 68 || e.keyCode === 39) {
			this.game.stopAction('right');
		}
		else if (e.keyCode === 32) {
			this.game.stopAction('space');
		}
		else if (e.keyCode === 87 || e.keyCode === 38) {
			this.game.updateAction('up');
			this.game.stopAction('up');
		}
	}
}