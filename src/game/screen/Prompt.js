import * as PIXI from 'pixi.js';;
import TweenLite from 'gsap';
import Screen from '../../screenManager/Screen'

export default class Prompt extends PIXI.Container{	
	constructor(){
		super();

        let keyup = new PIXI.Sprite.fromFrame('key-arrowup.png');
        this.addChild(keyup);

        let keyDown = new PIXI.Sprite.fromFrame('key-arrow-down.png');
        this.addChild(keyDown);

        let keyLeft = new PIXI.Sprite.fromFrame('key-arrowleft.png');
        this.addChild(keyLeft);

        let keyRight = new PIXI.Sprite.fromFrame('key-arrow-right.png');
        this.addChild(keyRight);

        let adj = 4
        keyLeft.y = keyup.height + adj;

        keyDown.x = keyLeft.x + (keyLeft.width + adj);
        keyDown.y = keyLeft.y;

        keyRight.x = keyDown.x + (keyDown.width + adj);
        keyRight.y = keyLeft.y;

        keyup.x = keyDown.x


        this.rotateLabel = new PIXI.Text('ROTATE', { font: '20px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
        this.addChild(this.rotateLabel);

        this.rotateLabel.x = keyup.x + keyup.width + adj + 10;
        this.rotateLabel.y = keyup.y + keyup.height * 0.5 - this.rotateLabel.height * 0.5;
	}
}