import Phaser from 'phaser'
// GEINDIGD BIJ PART 
export default class Game extends Phaser.Scene 
{
	private player?: Phaser.GameObjects.Sprite
	private blueBoxes?: Phaser.GameObjects.Sprite[] = []
	private layer?: Phaser.Tilemaps.StaticTilemapLayer 

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
		// 52 = player
		// 100 = brown boxes
		// 51 = blue diamond
		// 8 = blue box
		const level = [
			[100, 	 100, 	100, 	100, 	100, 	100, 	  100, 	  100,		100,	100,],
			[100, 	   0, 	  0, 	  0, 	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	  0, 	  0, 	  0, 		0, 		0,		0,		100,],
			[100,	   0, 	  0, 	 51, 	  8,      0, 	   52, 		0,		0,		100,],
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
		this.layer = map.createStaticLayer(0, tiles, 0, 0)

		// layer.getTileAtWorldXY()

		this.player = this.layer.createFromTiles(52, 0, { key: 'tiles', frame:52 }).pop()
		this.player.setOrigin(0)
		
		
		this.createPlayerAnims()

		this.blueBoxes = this.layer.createFromTiles(8, 0, {key: 'tiles', frame: 8 })
			.map(box => box.setOrigin(0))
	}

	update()
	{
		//the walking animations
		if (!this.cursors || !this.player)
		{
			return
		}

		const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left!)
		const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right!)
		const justDown = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
		const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
		

		if (justLeft)
		{
			
			const baseTween = {
				x: '-=64',
				duration: 500
			}

			this.tweenMove(this.player.x - 31, this.player.y + 32, baseTween,() => {
				this.player.anims.play('left', true)
			} )
		}
		else if (justRight)
		{
			
			const baseTween = {
				x: '+=64',
				duration: 500
			}

			this.tweenMove(this.player.x + 95, this.player.y + 32, baseTween, () => {
				this.player.anims.play('right', true)
			})

		}
		else if (justUp)
		{
			const nx = this.player.x + 32
			const ny = this.player.y - 32
			

			const baseTween = {
				y: '-=64',
				duration: 500
			}

			this.tweenMove(this.player.x + 32, this.player.y - 32, baseTween, () => {
				this.player.anims.play('up', true)
			})
			

		}
		else if (justDown)
		{
			
			const baseTween = {
				y: '+=64',
				duration: 500
			}

			this.tweenMove(this.player.x + 32, this.player.y + 95, baseTween, () => {
				this.player.anims.play('down', true)
			})
			
		}
		// else if (this.player.anims.currentAnim)
		// {
		// 	const key = this.player?.anims.currentAnim?.key
		// 	if (!key.startsWith(`idle-`))
		// 	{
		// 		this.player.anims.play(`idle-${key}`, true)
		// 	}
			
		// }
	}

	private tweenMove(x: number, y: number, baseTween: any, onStart:() => void)
	{
		if(this.tweens.isTweening(this.player!))
		{
			return
		}

		const hasWall = this.hasWallAt(x,y)

			if (hasWall)
			{
				return
			}

		const box = this.getBoxAt(x, y)
		if (box)
			{
				this.tweens.add(Object.assign(
					baseTween,
					{
						targets:box,
						onComplete: () => {
							const coveredTarget = this.hasTargetAt(box.x, box.y, 51)
							console.log(coveredTarget)
						}
					}
				))
			}
		
			this.tweens.add(Object.assign(
				baseTween,
				{
					targets:this.player,
					onComplete: this.stopPlayerAnimation,
					onCompleteScope:this,
					onStart
				}
			))

		
	}

	private stopPlayerAnimation()
	{
		if (!this.player)
		{
			return
		}
		const key = this.player?.anims.currentAnim?.key
		if (!key.startsWith(`idle-`))
		{
			this.player.anims.play(`idle-${key}`, true)
		}
	}

	private getBoxAt(x: number, y: number)
	{
		return this.blueBoxes.find(box => {
			const rect = box.getBounds()
			return rect.contains(x, y)
		})
	}

	// Dealing with not walking pass the other wall
	private hasWallAt(x: number, y: number)
	{
		if (!this.layer)
		{
			return false
		}
		const tile = this.layer.getTileAtWorldXY(x, y)
		if (!tile)
		{
			return false
		}
		return tile.index === 100
	}

	private hasTargetAt(x: number, y: number, tileIndex: number )
	{
		if (!this.layer)
		{
			return false
		}
		const tile = this.layer.getTileAtWorldXY(x, y)
		if (!tile)
		{
			return false
		}
		return tile.index === tileIndex
	}

	//player walking and idle animations
	private createPlayerAnims()
	{
		this.anims.create({
			key: 'idle-down',
			frames: [ {key: 'tiles', frame: 52} ]
		})
		this.anims.create({
			key: 'idle-left',
			frames: [ {key: 'tiles', frame: 81} ]
		})
		this.anims.create({
			key: 'idle-right',
			frames: [ {key: 'tiles', frame: 78} ]
		})
		this.anims.create({
			key: 'idle-up',
			frames: [ {key: 'tiles', frame: 55} ]
		})

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('tiles', { start: 81, end: 83 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('tiles', { start: 78, end: 80 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('tiles', { start: 55, end: 57 }),
			frameRate: 10,
			repeat: -1
		})
		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('tiles', { start: 52, end: 54 }),
			frameRate: 10,
			repeat: -1
		})
	}
}
