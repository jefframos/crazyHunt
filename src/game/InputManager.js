export default class InputManager{
	constructor(game){
		this.game = game;
		document.addEventListener('keydown', (event) => {
	  		this.getKey(event);
	   		event.preventDefault()
	 	})

	 	document.addEventListener('keyup', (event) => {
	  		this.getUpKey(event);
	   		event.preventDefault()
	 	})
		this.vecPositions = [];
		//document.body.on('keydown', this.getKey.bind(this));		
	}

	//
    getKey(e){
    	if(e.keyCode === 87 || e.keyCode === 38){
			this.game.updateAction('up');
		}
		else if(e.keyCode === 83 || e.keyCode === 40){
			this.game.updateAction('down');
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.game.updateAction('left');
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.game.updateAction('right');
		}
    }

    getUpKey(e){
    	if(e.keyCode === 83 || e.keyCode === 40){
			this.game.stopAction('down');
		}	
    }
}