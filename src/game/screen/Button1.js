import * as PIXI from 'pixi.js';;
import TweenLite from 'gsap';
import Screen from '../../screenManager/Screen'

import signals from 'signals'

export default class Button1 extends PIXI.Container {
    constructor() {
        super();

        this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('button-border.png'), 10, 10, 10, 10)
        this.backShape.width = 200
        this.backShape.height = 60
        this.addChild(this.backShape);

        this.buttonLabel = new PIXI.Text('ROTATE', { font: '40px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
        this.buttonLabel.x = this.backShape.width / 2- this.buttonLabel.width / 2
        this.buttonLabel.y = this.backShape.height / 2- this.buttonLabel.height / 2
        this.addChild(this.buttonLabel);

        this.interactive = true;
        this.buttonMode = true;

        this.onClick = new signals.Signal();

        this.on('touchstart', this.click.bind(this));

        this.callback = null

    }
    setLabel(text){
        this.buttonLabel.text = text;
        this.buttonLabel.x = this.backShape.width / 2- this.buttonLabel.width / 2
        this.buttonLabel.y = this.backShape.height / 2- this.buttonLabel.height / 2
     }
    click(){
       if(!this.callback){
           return
       }

       this.callback();
    }
}