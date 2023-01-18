import Phaser from 'phaser'

import Preloader from './Preloader'
import Game from './Game'
import LevelFinishedScene from './LevelFinishedScene'


const config = {
	type: Phaser.AUTO,
	parent: 'phaser',
	width: 640,
	height: 512,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [Preloader, Game, LevelFinishedScene]
}

export default new Phaser.Game(config)
