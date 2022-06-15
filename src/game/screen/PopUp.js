import * as PIXI from 'pixi.js';;
import TweenLite from 'gsap';
import Screen from '../../screenManager/Screen'
import config from '../../config';

export default class PopUp extends PIXI.Container{	
	constructor(game){
		super();

        this.game = game;
        this.blocker = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('popUp.png'), 10, 10, 10, 10)
        this.blocker.width = config.width * 10;
        this.blocker.height = config.height * 10;
        this.blocker.pivot.x = this.blocker.width / 2
        this.blocker.pivot.y = this.blocker.height / 2

        this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('popUp.png'), 10, 10, 10, 10)
        this.backShape.width = config.width * 0.75;
        this.backShape.height = config.height * 0.5;

        this.addChild(this.blocker);
        this.blocker.interactive = true;
        this.blocker.alpha = 0.5;
        this.addChild(this.backShape);
        
        
        this.confirm = this.getSquare('button-border.png', 'check-mark.png');
		this.confirm.interactive = true;
		this.confirm.buttonMode = true;
		this.confirm.on('touchstart', this.onConfirm.bind(this)).on('mousedown', this.onConfirm.bind(this))
        
        
        this.cancel = this.getSquare('button-border.png', 'cancel.png');
		this.cancel.interactive = true;
		this.cancel.buttonMode = true;
		this.cancel.on('touchstart', this.onCancel.bind(this)).on('mousedown', this.onCancel.bind(this))
        this.cancel.icon.tint = 0xFF110C
        
        this.continue = this.getSquare('button-border.png', 'check-mark.png', this.backShape.width - 60);
		this.continue.interactive = true;
		this.continue.buttonMode = true;
		this.continue.on('touchstart', this.onConfirm.bind(this)).on('mousedown', this.onConfirm.bind(this))
        this.continue.icon.tint = 0x3DFD0B
        this.confirm.icon.tint = 0x3DFD0B
        
        this.backShape.addChild(this.confirm);
        this.backShape.addChild(this.cancel);
        this.backShape.addChild(this.continue);

        this.confirm.x = this.backShape.width - this.confirm.width - 30
        this.confirm.y = this.backShape.height - this.confirm.height - 30

        this.cancel.x = 30
        this.cancel.y = this.confirm.y

        this.continue.x = 30
        this.continue.y = this.confirm.y

        this.backShape.x = config.width / 2 - this.backShape.width / 2
        this.backShape.y = config.height / 2 - this.backShape.height / 2
	}
    onConfirm(){
        this.callback()
        this.hide();
        
    }
    onCancel(){
        this.callbackCancel()
        this.hide();
    }
    hide(){
        this.visible = false;
    }
    show(currentLevel, callback, callbackCancel){
        this.visible = true;
        this.callback = callback;
        this.callbackCancel = callbackCancel;

        if(!callbackCancel){
            this.confirm.visible = false;
            this.cancel.visible = false;
            this.continue.visible = true;
        }else{
            this.confirm.visible = true;
            this.cancel.visible = true;
            this.continue.visible = false;
        }
        this.currentLevel = currentLevel;

        if(this.currentLevel <= 1){
		}else if(this.currentLevel <= 2){
			//draw 5-6
		}else if(this.currentLevel <= 4){
			//draw = 7
		}else if(this.currentLevel <= 5){
			//draw = 8
		}else if(this.currentLevel <= 7){
			//draw = 9
		}else if(this.currentLevel <= 9){
			//draw = 10
		}

        let tempShape = this.game.drawShapeOnList(this.game.shapes[4].shape);
        this.backShape.addChild(tempShape);

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
        shape.icon = icon;
		shape.addChild(icon)
		return shape
	}
}