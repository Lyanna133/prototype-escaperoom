import Phaser from 'phaser'

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

        
        this.add.text( width * 0.5, height * 0.5, 'Level Complete!', {
            
        }) 
        .setOrigin(0.5)
        
        this.add.text(width * 0.5, height * 0.6,`Moves: ${data.moves}` )
            .setOrigin(0.5)
    }
    
}