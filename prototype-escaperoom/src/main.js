import Phaser from 'phaser'

import Game from './Game'
import LevelFinishedScene from './LevelFinishedscene'


const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 640,
	height: 512,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [Game, LevelFinishedScene]
}

export default new Phaser.Game(config)
