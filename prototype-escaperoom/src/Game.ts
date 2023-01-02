import Phaser from 'phaser'

export default class Game extends Phaser.Scene 
{
	private player?: Phaser.GameObjects.Sprite

	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	
	constructor() {
		super('game')
	}

	preload() 
	{
		this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png', {
			frameWidth: 64,
			startFrame:0
		})

		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create() 
	{
		//level layout
		const level = [
			[100, 	 100, 	100, 	100, 	100, 	100, 	  100, 	  100,		100,	100,],
			[100, 	   0, 	  0, 	  0, 	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	  0, 	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	 51, 	  8,      0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	  0, 	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	  0, 	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	  0,	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	 100,	100, 	100,	100, 	100, 	  100, 	  100,		100,	100,]
		]
		//size of the area
		const map = this.make.tilemap({ 
			data: level, 
			tileWidth:64, 
			tileHeight:64
		})

		const tiles = map.addTilesetImage('tiles')
		const layer = map.createStaticLayer(0, tiles, 0, 0)

		this.player = this.add.sprite(400, 300, 'tiles', 52)

		//player walking animations
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('tiles', { start: 81, end: 83 }),
			frameRate: 10,
			repeat: -1
		})
	}

	update()
	{
		if (!this.cursors || !this.player)
		{
			return
		}
		if (this.cursors.left.isDown)
		{
			this.player.anims.play('left')
		}
	}
}
