import Phaser from 'phaser'

import Game from './Game'

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
	scene: [Game],
}

export default new Phaser.Game(config)
