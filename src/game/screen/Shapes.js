export default class Shapes {
    constructor(game) {
        this.game = game;
        this.shapes = [
            {
                shape: [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 1, 0],
                    [0, 1, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0],
                    [0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0.5
                }
            },


            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 1, 0, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 1, 0, 1, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0.5
                }
            },

            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0],
                ], type: "SHOOTER",
                bonus: {
                    mult: 0
                }
            },
            {
                shape: [
                    [0, 0, 0, 0, 0],
                    [0, 1, 0, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                ], type: "STANDARD",
                bonus: {
                    mult: 0.5
                }
            },
            {
                shape: [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                ], type: "BRICK_BREAKER",
                bonus: {
                    mult: 0
                }
            }
        ]

        this.extras = [
            {
                type: 'meteore',
                bonus: {
                    mult: 0.2
                }
            },
            {
                type: 'invertX',
                bonus: {
                    mult: 0.5
                }
            },
            {
                type: 'invertY',
                bonus: {
                    mult: 0
                }
            },
            {
                type: 'rotateBorder',
                bonus: {
                    mult: 0
                }
            },
            {
                type: 'rotateGame',
                bonus: {
                    mult: 0
                }
            },
            {
                type: 'shuffle',
                bonus: {
                    mult: 0.2
                }
            }
        ]

        this.activeEvent = "";

        this.allowedEffects = [];
    }
    apllyRandomEffect() {
        if (this.allowedEffects.length) {
            this.resetCurrentEffect();
            this.activeEffect(this.allowedEffects[Math.floor(Math.random() * this.allowedEffects.length)])
        }
    }
    appendEffect(effect) {
        this.allowedEffects.push(effect)
    }
    resetStats() {
        this.resetCurrentEffect();
        this.allowedEffects = [];
    }
    activeEffect(id) {
        this.resetCurrentEffect();

        if (this[id]) {
            this[id]();
            this.activeEvent = id;
        }
    }
    resetCurrentEffect() {
        if (this['reset' + this.activeEvent]) {
            this['reset' + this.activeEvent]();
            this.activeEvent = "";
        }
    }
    shuffle() {
        this.game.randomizeCrazy = true;
        this.game.randomParticles();
        this.game.addInfoLabel(["SHUFFLE"])
    }
    resetshuffle() {
        this.game.randomizeCrazy = false;
        this.game.linearParticles();
    }
    meteore() {
        this.game.startMeteorRain(true, 2 + Math.floor(Math.random() * 3));
    }
    resetmeteore() {

    }
    invertX() {
        this.game.gameContainer.scale.x = -1;
        this.game.gameBorderContainer.scale.x = -1;
        this.game.addInfoLabel(["X TREVNI"]);
        this.game.gameQueueContainer.alpha = 0;

    }
    resetinvertX() {
        this.game.gameContainer.scale.x = 1;
        this.game.gameBorderContainer.scale.x = 1;
        this.game.gameQueueContainer.alpha = 1;
    }
    invertY() {
        this.game.gameContainer.scale.y = -1;
        this.game.gameBorderContainer.scale.y = -1;
        this.game.addInfoLabel(["INVERT Y"])
    }
    resetinvertY() {
        this.game.gameContainer.scale.y = 1;
        this.game.gameBorderContainer.scale.y = 1;
    }
    rotateBorder() {
        TweenLite.killTweensOf(this.game.gameBorderContainer)
        let side = Math.random() < 0.5 ? -1 : 1
        TweenLite.to(this.game.gameBorderContainer, 5, { rotation: side * 0.075 })
    }
    resetrotateBorder() {
        TweenLite.killTweensOf(this.game.gameBorderContainer)
        TweenLite.to(this.game.gameBorderContainer, 5, { rotation: 0 })
    }
    rotateGame() {
        TweenLite.killTweensOf(this.game.gameContainer)
        let side = Math.random() < 0.5 ? -1 : 1
        TweenLite.to(this.game.gameContainer, 5, { rotation: side * 0.075 })
    }
    resetrotateGame() {
        TweenLite.killTweensOf(this.game.gameContainer)
        TweenLite.to(this.game.gameContainer, 5, { rotation: 0 })
    }

}