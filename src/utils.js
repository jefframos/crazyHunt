import config from './config';
export default {
  getRandomValue(array, exception) {
    let value = array[Math.floor(Math.random() * array.length)];
    if (exception) {
      let equal = true;
      while (equal) {
        equal = false;
        for (let i = 0; i < exception.length; i++) {
          if (exception[i] == value) {
            equal = true;
          }
        }
        if (equal) {
          value = array[Math.floor(Math.random() * array.length)]
        }
      }
    }
    return value
  },
  shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  },
  trimMatrix(pieces, ignoreBlocker = false) {
    if (pieces.length <= 0) {
        return;
    }
    let colCounters = [];
    let lineCounters = [];
    for (let i = 0; i < pieces.length; i++) {
        colCounters.push(0);
    }
    for (let i = 0; i < pieces[0].length; i++) {
        lineCounters.push(0);
    }
    for (let i = 0; i < pieces.length; i++) {
        for (let j = 0; j < pieces[i].length; j++) {
            const element = pieces[i][j];
            if (element > 0) {
                lineCounters[j]++;
                colCounters[i]++;
            }
        }
    }

    let padding = { left: 0, right: 0, top: 0, bottom: 0 }

    for (let i = 0; i < lineCounters.length; i++) {
        const element = lineCounters[i];
        if (element == 0) {
            padding.left++;
        } else {
            break;
        }
    }
    for (let i = lineCounters.length - 1; i >= 0; i--) {
        const element = lineCounters[i];
        if (element == 0) {
            padding.right++;
        } else {
            break;
        }
    }

    for (let i = 0; i < colCounters.length; i++) {
        const element = colCounters[i];
        if (element == 0) {
            padding.top++;
        } else {
            break;
        }
    }
    for (let i = colCounters.length - 1; i >= 0; i--) {
        const element = colCounters[i];
        if (element == 0) {
            padding.bottom++;
        } else {
            break;
        }
    }

    pieces.splice(0, padding.top);
    pieces.splice(pieces.length - padding.bottom, padding.bottom);

    for (let i = 0; i < pieces.length; i++) {
        pieces[i].splice(0, padding.left);
        pieces[i].splice(pieces[i].length - padding.right, padding.right);
    }


    return padding
},
  centerObject(target, parent) {
    target.x = parent.width / 2 - target.width * 0.5;
    target.y = parent.height / 2 - target.height * 0.5;
},
  correctPosition(element) {
    let x = Math.floor(element.position.x / config.pixelSize) * config.pixelSize;
    let y = Math.floor(element.position.y / config.pixelSize) * config.pixelSize;
    element.position.x = x;
    element.position.y = y;
  },
  setGameScreen80(color) {
    config.palette.gameScreen80 = color;
  },
  setInitScreen80(color) {
    config.palette.initScreen80 = color;
  },
  applyPositionCorrection(element) {
    if (config.isJuicy == 0) {
      return;
    }
    element.position.x += config.hitCorrection.x;
    element.position.y += config.hitCorrection.y;
  },
  addToContainer(element) {
    let elementContainer = new PIXI.Container()
    elementContainer.addChild(element);
    return elementContainer;
  },
  centerPivot(element) {
    element.pivot.x = element.width / 2;
    element.pivot.y = element.height / 2;
    element.position.x += element.width / 2;
    element.position.y += element.height / 2;
  },
  addMockRect(element, width, height) {
    let fake = new PIXI.Graphics()
    fake.beginFill(0);
    fake.drawRect(-width, -height, width * 2, height * 2);
    fake.alpha = 0;
    element.addChild((fake));
  },
  addMockObject(element) {
    if (config.isJuicy == 0) {
      return;
    }
    let alphaBG2 = new PIXI.Graphics()
    alphaBG2.beginFill(0);
    alphaBG2.drawRect(-element.width / 2, -element.height / 2, element.width, element.height);
    alphaBG2.position.x -= config.hitCorrection.x;
    alphaBG2.position.y -= config.hitCorrection.y;
    alphaBG2.alpha = config.debugMockobjectsAlpha;
    element.addChild((alphaBG2));
  }
};
