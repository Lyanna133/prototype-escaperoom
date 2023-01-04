import * as Color from '../consts/Color'

const boxColorToTargetColor = (boxColor: number) => {
    switch(boxColor)
    {
        default:
        case Color.BoxOrange:
            return Color.TargetOrange
        
        case Color.BoxRed:
            return Color.TargetRed

        case Color.BoxBlue:
            return Color.TargetBlue
        
        case Color.BoxGreen:
            return Color.TargetGreen

        case Color.BoxGrey:
            return Color.TargetGrey
    }
}

export {
    boxColorToTargetColor
}