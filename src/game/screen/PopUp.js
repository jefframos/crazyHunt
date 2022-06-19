import * as PIXI from 'pixi.js';;
import TweenLite from 'gsap';
import Screen from '../../screenManager/Screen'
import config from '../../config';
import utils from '../../utils';

export default class PopUp extends PIXI.Container {
    constructor(game) {
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
        this.backShape.width = config.width * 0.8;
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


        let size = (this.backShape.width - 70) / 2
        this.piece1 = this.getSquare('button-border.png', 'check-mark.png', size, size);
        this.piece1.interactive = true;
        this.piece1.buttonMode = true;
        this.piece1.on('touchstart', this.onConfirmPiece1.bind(this)).on('mousedown', this.onConfirmPiece1.bind(this))


        this.piece2 = this.getSquare('button-border.png', 'cancel.png', size, size);
        this.piece2.interactive = true;
        this.piece2.buttonMode = true;
        this.piece2.on('touchstart', this.onConfirmPiece2.bind(this)).on('mousedown', this.onConfirmPiece2.bind(this))


        this.continue = this.getSquare('button-border.png', 'video.png', this.backShape.width - 60);
        this.continue.interactive = true;
        this.continue.buttonMode = true;
        this.continue.on('touchstart', this.onConfirm.bind(this)).on('mousedown', this.onConfirm.bind(this))
        this.continue.icon.x += 80
        let vid = new PIXI.Text('Watch a video to skip', { font: '18px super_smash_tvregular', fill: 0xFFFFFF, align: 'left' });
        vid.x = 20
        vid.y = this.continue.icon.y - 5
        this.continue.addChild(vid)
        this.continue.icon.tint = 0x3DFD0B
        this.confirm.icon.tint = 0x3DFD0B

        this.choosePiece = new PIXI.Text('Choose a new element to\nadd on the game', { font: '28px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
        this.choosePiece.interactive = true;
        this.choosePiece.buttonMode = true;

        this.backShape.addChild(this.confirm);
        this.backShape.addChild(this.cancel);
        this.backShape.addChild(this.continue);
        this.backShape.addChild(this.choosePiece);
        this.choosePiece.x = this.backShape.width / 2 - this.choosePiece.width / 2
        this.choosePiece.y = 30

        this.backShape.addChild(this.piece1);
        this.backShape.addChild(this.piece2);

        this.confirm.x = this.backShape.width - this.confirm.width - 30
        this.confirm.y = this.backShape.height - this.confirm.height - 30

        this.piece2.x = this.backShape.width - this.piece2.width - 30
        this.piece1.x = 30

        this.piece1.y = this.backShape.height / 2 - this.piece1.height / 2 - 20
        this.piece2.y = this.backShape.height / 2 - this.piece2.height / 2 - 20


        this.cancel.x = 30
        this.cancel.y = this.confirm.y

        this.continue.x = 30
        this.continue.y = this.confirm.y

        this.backShape.x = config.width / 2 - this.backShape.width / 2
        this.backShape.y = config.height / 2 - this.backShape.height / 2
    }
    onConfirmPiece2() {
        this.game.doTheBreak(() => {
            if (this.piece2.id.type) {

                this.game.appendEffect(this.piece2.id)
            } else {

                this.game.appenPieceAllowed(this.piece2.id)
            }
            this.callback()
            this.hide();
        })
    }
    onConfirmPiece1() {


        this.game.doTheBreak(() => {

            if (this.piece1.id.type) {

                this.game.appendEffect(this.piece1.id)
            } else {

                this.game.appenPieceAllowed(this.piece1.id)
            }

            this.callback()
            this.hide();
        })
    }
    onConfirm() {

        window.GAMEPLAY_STOP()
        // this.callback()
        // this.hide();

        // return
        PokiSDK.rewardedBreak().then(
            (success) => {
                if (success) {
                    window.GAMEPLAY_START()
                    this.callback()
                    this.hide();
                } else {
                    window.GAMEPLAY_START()
                    this.callback()
                    this.hide();
                }
            }

        )


    }
    onCancel() {
        this.callbackCancel()
        this.hide();
    }
    hide() {
        this.visible = false;
    }
    shouldShow() {
        let hasPieces = true;
        let hasEffects = true;
        if (this.game.shapesOrderAllowed.length >= this.game.shapes.length) {
            hasPieces = false;

        }

        let shapeEffects = this.game.shapesManager.allowedEffects;
        let extras = this.game.shapesManager.extras;

        if (shapeEffects.length >= extras.length) {
            hasEffects = false;

        }
        if (!hasPieces && !hasEffects) {
            return false;
        }

        return true;
    }
    showPieceChoice(currentLevel, callback, callbackCancel) {

        this.alpha = 0;

        TweenLite.to(this, 0.5, { delay: 0.5, alpha: 1 })
        let shapeEffects = this.game.shapesManager.allowedEffects;
        let extras = this.game.shapesManager.extras;

        if (!this.shouldShow()) {
            return false;
        }


        this.piece1.x = 30
        this.piece2.x = this.backShape.width - this.piece2.width - 30

        this.visible = true;
        this.callback = callback;
        this.callbackCancel = callbackCancel;
        this.piece1.visible = true;
        this.piece2.visible = true;

        this.confirm.visible = false;
        this.cancel.visible = false;
        this.continue.visible = true;

        this.currentLevel = currentLevel

        let nexts = [];
        let limit = this.game.shapesOrderAllowed.length + 2;
        limit = Math.min(limit, this.game.shapes.length - 1)
        for (let index = 0; index < this.game.shapes.length; index++) {
            let find = false;

            if (index > limit) {
                find = true;
            }
            this.game.shapesOrderAllowed.forEach(order => {
                if (index == order) {
                    find = true;
                }
            });
            if (!find) {
                nexts.push(index);
            }
        }
        utils.shuffle(nexts)


        let nextsFX = [];



        for (let index = 0; index < extras.length; index++) {
            let find = false;

            shapeEffects.forEach(order => {
                if (extras[index].type == order) {
                    find = true;
                }
            });
            if (!find) {
                nextsFX.push(extras[index]);
            }
        }


        nexts = nexts.concat(nextsFX)

        utils.shuffle(nexts)


        console.log(nexts)

        this.piece1.removeChild(this.piece1.icon)
        this.piece2.removeChild(this.piece2.icon)

        let id1 = nexts[0]
        let id2 = nexts[1]

        if (id1.type) {
            this.getEffectIcon(this.piece1, id1)
        } else {

            this.getPieceIcon(this.piece1, id1)
        }

        if (nexts.length <= 1) {
            this.piece2.visible = false;
            this.piece1.x = this.backShape.width / 2 - this.piece1.width / 2
            return true

        }
        if (id2.type) {
            this.getEffectIcon(this.piece2, id2)
        } else {

            this.getPieceIcon(this.piece2, id2)
        }
        return true
    }
    getEffectIcon(piece, id) {
        piece.type = 'effect'
        piece.id = id


        piece.icon = new PIXI.Container();

        if (id.img) {
            console.log(id)

            let sprite = new PIXI.Sprite.fromFrame(id.img)
            piece.icon.addChild(sprite)

            sprite.tint = utils.getRandomValue(config.palette.colors80)
            sprite.y = 18

        }


        let label = new PIXI.Text(id.desc, { font: '20px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
        piece.icon.addChild(label)
        if (id.bonus.mult) {

            let mult = new PIXI.Text("Bonus: +" + (1 + id.bonus.mult) + "x", { font: '18px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
            mult.y += 100
            piece.icon.addChild(mult)

            label.x = mult.width / 2 - label.width / 2
        }
        utils.centerObject(piece.icon, piece)
        piece.addChild(piece.icon);
        //piece.icon.y += config.pieceSize / 2
    }
    getPieceIcon(piece, id) {
        piece.type = 'piece'
        piece.id = id
        piece.icon = new PIXI.Container();

        let shape = this.drawShapeOnList(this.game.shapes[id].shape, utils.getRandomValue(config.palette.colors80));
        piece.icon.addChild(shape)

        console.log(this.game.shapes[id])



        if (this.game.shapes[id].bonus && this.game.shapes[id].bonus.mult) {

            let mult = new PIXI.Text("Bonus: +" + (1 + this.game.shapes[id].bonus.mult) + "x", { font: '18px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
            mult.y += shape.height
            piece.icon.addChild(mult)

            shape.x = mult.width / 2 - shape.width / 2


        }
        utils.centerObject(piece.icon, piece)
        piece.addChild(piece.icon);
        piece.icon.y += config.pieceSize / 2

        if (this.game.shapes[id].desc) {

            let desc = new PIXI.Text(this.game.shapes[id].desc, { font: '18px super_smash_tvregular', fill: 0xFFFFFF, align: 'center' });
            desc.y = shape.y - desc.height - 15

            desc.x = piece.icon.width / 2 - desc.width / 2

            piece.icon.addChild(desc)
            piece.icon.y += 10
        }
    }
    show(currentLevel, callback, callbackCancel) {
        this.visible = true;
        this.callback = callback;
        this.callbackCancel = callbackCancel;

        this.piece1.visible = false;
        this.piece2.visible = false;
        if (!callbackCancel) {
            this.confirm.visible = false;
            this.cancel.visible = false;
            this.continue.visible = true;
        } else {
            this.confirm.visible = true;
            this.cancel.visible = true;
            this.continue.visible = false;
        }
        this.currentLevel = currentLevel;

        if (this.currentLevel <= 1) {
        } else if (this.currentLevel <= 2) {
            //draw 5-6
        } else if (this.currentLevel <= 4) {
            //draw = 7
        } else if (this.currentLevel <= 5) {
            //draw = 8
        } else if (this.currentLevel <= 7) {
            //draw = 9
        } else if (this.currentLevel <= 9) {
            //draw = 10
        }



    }
    getSquare(src, iconSrc, w = 75, h = 75) {
        let shape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(src), 10, 10, 10, 10)
        shape.width = w
        shape.height = h
        let icon = new PIXI.Sprite.fromFrame(iconSrc);
        icon.anchor.set(0.5)
        icon.x = w / 2
        icon.y = h / 2
        shape.icon = icon;
        shape.addChild(icon)
        return shape
    }

    drawShapeOnList(array, color) {
        let shape = new PIXI.Container();
        let starterPosition = { x: 0, y: 0 };

        let copy = []
        for (var i = 0; i < array.length; i++) {
            let line = []
            for (var j = 0; j < array[i].length; j++) {
                line.push(array[i][j])

            }
            copy.push(line)
        }


        utils.trimMatrix(copy)
        for (var i = 0; i < copy.length; i++) {
            for (var j = 0; j < copy[i].length; j++) {
                if (copy[i][j]) {
                    let currentEntity = this.game.drawSquare(color);
                    currentEntity.position.x = starterPosition.x + (j) * config.pieceSize;
                    currentEntity.position.y = (i) * config.pieceSize - config.pieceSize / 2 + starterPosition.y;
                    shape.addChild(currentEntity);
                }
            }
        }
        return shape;
    }
}