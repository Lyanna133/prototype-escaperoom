import Phaser from 'phaser'

import {defaultButton, primaryButton} from './ui/Button'

export default class LevelFinishedScene extends Phaser.Scene
{
    constructor()
    {
        super('level-finished')
    }

    create(d: {moves: number, currentLevel: number } )
    {
        const data = Object.assign({ moves: 0, currentLevel: 1 },d)
        const width = this.scale.width
        const height = this.scale.height

        
        this.add.text( width * 0.5, height * 0.4, 'Level Complete!', {
            fontFamily: 'Righteous',
            color: '#4dbbfa',
            fontSize: 48
        }) 
        .setOrigin(0.5)
        
        this.add.text(width * 0.5, height * 0.5,`Moves: ${data.moves}`,{
            fontFamily: 'Poppins',
        }
         )
        .setOrigin(0.5)

        const retrybutton = defaultButton(`Retry`) as HTMLElement
        this.add.dom(width * 0.25, height * 0.6, retrybutton)
            .addListener('click').once('click', () => {
                this.scene.start('game', {level: data.currentLevel })
            })

        const nextLevelButton = primaryButton('Next Level') as HTMLElement
        this.add.dom(width * 0.75, height * 0.6, nextLevelButton)
            .addListener('click').once('click', () => {
                this.scene.start('game', {level: data.currentLevel + 1 })
            })
    }

    
}