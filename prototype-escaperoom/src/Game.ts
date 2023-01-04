import Phaser from 'phaser'
// GEINDIGD BIJ PART 

import * as Colors from '../src/consts/Color'
import {Direction} from '../src/consts/Direction'

import {boxColorToTargetColor, targetColorToBoxColor } from '../src/utils/ColorUtils'
import {offsetForDirection} from '../src/utils/TileUtils'

export default class Game extends Phaser.Scene 
{
	private player?: Phaser.GameObjects.Sprite
	private layer?: Phaser.Tilemaps.StaticTilemapLayer 
	private movesCountLabel?: Phaser.GameObjects.Text

	private targetsCoveredByColor: { [key: number]: number } = {}
	private boxesByColor: {[key:number]:Phaser.GameObjects.Sprite[] } = {}

	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

	private movesCount = 0
	
	constructor() {
		super('game')
	}

	// reset moves to 0 instead of keep what you had if you play again
	init()
	{
		this.movesCount = 0
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
		// 25-38-51-64-77 = Orange - Red - Blue - Green - Grey diamond
		// 6-7-8-9-10 = Orange - Red - Blue - Green - Grey box
		const level = [
			[	0, 	   0, 	  100, 	 100, 	 	100, 	  0, 	  	0, 	  	0,		0,		0,],
			[	0, 	   0, 	  100, 	  64, 	 	100, 	  0, 		0, 		0,		0,		0,],
			[	0,	   0, 	  100, 	  0, 	 	100, 	  100, 		100, 	100,	0,		0,],
			[100,	  100, 	  100, 	  9, 	 	  0,     	9, 	   	64, 	100,	0,		0,],
			[100,	   64, 	  0, 	  9, 	  	 52, 	  100, 		100, 	100,	0,		0,],
			[100,	  100, 	  100, 	  100, 	 	  9, 	  100, 		0, 		0,		0,		0,],
			[	0,	   0, 	  0, 	  100,	  	 64, 	  100, 		0, 		0,		0,		0,],
			[	0,	   0,	  0, 	  100,		100, 	  100, 	  	0, 	  	0,		0,		0,]
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

		this.extractBoxes(this.layer)

		//show number off moves
		this.movesCountLabel = this.add.text( 540, 10, `Moves: ${this.movesCount}`)
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

			this.tweenMove(Direction.Left, baseTween,() => {
				this.player.anims.play('left', true)
			} )
		}
		else if (justRight)
		{
			
			const baseTween = {
				x: '+=64',
				duration: 500
			}

			this.tweenMove(Direction.Right, baseTween, () => {
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

			this.tweenMove(Direction.Up, baseTween, () => {
				this.player.anims.play('up', true)
			})
			

		}
		else if (justDown)
		{
			
			const baseTween = {
				y: '+=64',
				duration: 500
			}

			this.tweenMove(Direction.Down, baseTween, () => {
				this.player.anims.play('down', true)
			})
			
		}
	
	}

	// the box goes on the correct target color
	private allTargetsCovered()
	{
		const targetColors = Object.keys(this.targetsCoveredByColor)
		for (let i = 0; i < targetColors.length; ++i)
		{
			const targetColor = parseInt(targetColors[i])
			const boxColor = targetColorToBoxColor(targetColor)
			if (!(boxColor in this.boxesByColor))
			{
				continue
			}

			const numBoxes = this.boxesByColor[boxColor].length
			const numCovered = this.targetsCoveredByColor[targetColor]

			if(numCovered < numBoxes)
			{
				return false
			}
		}

		return true
	}

	private extractBoxes(layer: Phaser.Tilemaps.StaticTilemapLayer) //Zegt dat het niet bekend is maar wordt wel veel gebruikt!!
	{
		const boxColors = [
			Colors.BoxOrange,
			Colors.BoxRed,
			Colors.BoxBlue,
			Colors.BoxGreen,
			Colors.BoxGrey
		]

		boxColors.forEach(color => {
			this.boxesByColor[color] = layer.createFromTiles(color, 0, {key: 'tiles', frame: color })
				.map(box => box.setOrigin(0))
			
			const targetColor = boxColorToTargetColor(color)
			this.targetsCoveredByColor[targetColor] = 0
		})
		
	}

	// TWEEN MOVE METHOD //
	private tweenMove(direction: Direction, baseTween: any, onStart:() => void)
	{
		if( !this.player || this.tweens.isTweening(this.player!))
		{
			return
		}

		const x = this.player.x
		const y = this.player.y

		const offset = offsetForDirection(direction)
		const ox = x + offset.x 
		const oy = y + offset.y

		const hasWall = this.hasWallAt(ox,oy)

			if (hasWall)
			{
				return
			}

		const boxData = this.getBoxDataAt(ox, oy)
		if (boxData)
			{
				const nextOffset = offsetForDirection(direction, 2)
				const nx = x + nextOffset.x 
				const ny = y + nextOffset.y
				const nextBoxData = this.getBoxDataAt(nx,ny)
				if (nextBoxData)
				{
					return
				}

				if (this.hasWallAt(nx, ny))
				{
					return
				}

				const box = boxData.box
				const boxColor = boxData.color
				const targetColor = boxColorToTargetColor(boxColor)


				const coveredTarget = this.hasTargetAt(box.x, box.y, targetColor)
				if(coveredTarget)
				{
					this.changeTargetCoveredCountForColor(targetColor, -1)
				}

				this.tweens.add(Object.assign(
					baseTween,
					{
						targets:box,
						onComplete: () => {
							const coveredTarget = this.hasTargetAt(box.x, box.y, targetColor)
							if (coveredTarget)
							{
								this.changeTargetCoveredCountForColor(targetColor,1)
							}
							console.dir(this.allTargetsCovered())
						}
					}
				))
			}
		
			this.tweens.add(Object.assign(
				baseTween,
				{
					targets:this.player,
					onComplete:() => {
						this.movesCount++			//counting moves
						this.stopPlayerAnimation()

						this.updateMovesCount()
					},
					
					onStart
				}
			))
	}

	private updateMovesCount()
	{
		if (!this.movesCountLabel)
		{
			return
		}
		this.movesCountLabel.text = `Moves: ${this.movesCount}`
	}

	// if the player stops moving stop the animation
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
	//does the box hit the color
	private changeTargetCoveredCountForColor(color: number, change: number)
	{
		if (!(color in this.targetsCoveredByColor))
		{
			this.targetsCoveredByColor[color] = 0
		}
		this.targetsCoveredByColor[color] += change
	}

	private getBoxDataAt(x: number, y: number)
	{
		const keys = Object.keys(this.boxesByColor)
		for (let i = 0; i < keys.length; ++i )
		{
			const color = keys [i]
			const box = this.boxesByColor[color].find(box =>{
				const rect = box.getBounds()
				return rect.contains(x, y)
			})

			if (!box)
			{
				continue
			}
			return {
				box,
				color: parseInt(color)
			}
		}
		return undefined
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
