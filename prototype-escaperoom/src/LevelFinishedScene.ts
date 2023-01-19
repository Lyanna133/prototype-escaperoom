import Phaser from 'phaser'

import {primaryButton} from './ui/Button'

export default class LevelFinishedScene extends Phaser.Scene
{
    constructor()
    {
        super('level-finished')
    }

    create(data: {moves:number } = {moves: 0})
    {
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

        const retrybutton = primaryButton(`Retry`) as HTMLElement
        this.add.dom(width * 0.5, height * 0.6, retrybutton)
    }

    
}