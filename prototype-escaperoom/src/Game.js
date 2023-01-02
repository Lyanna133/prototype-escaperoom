import Phaser from 'phaser'

export default class Game extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() 
	{
		this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png', {
			frameWidth: 64,
			startFrame:0
		})
	}

	create() 
	{
		this.add.image(400, 300, 'tiles', 1 )
	}
}
