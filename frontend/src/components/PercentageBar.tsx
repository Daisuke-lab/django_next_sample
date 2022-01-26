import React from 'react'
import {highColor, middleColor, lowColor, unknownColor} from "../helpers/colors"

interface Props {
    low: number,
    middle: number,
    high: number,
    unknown: number,
    sum: number
}
function PercentageBar(props:Props) {
    console.log(props)
    const {low, middle, high, unknown, sum} = props
    console.log((high/sum)*100)
    return (
        <div>
            <div style={{backgroundColor: highColor, width: (high/sum)*100 + "%"}}></div>
            <div style={{backgroundColor: middleColor, width: (middle/sum)*100 + "%"}}></div>
            <div style={{backgroundColor: lowColor, width: (low/sum)*100 + "%"}}></div>
            <div style={{backgroundColor: unknownColor, width: (unknown/sum)*100 + "%"}}></div>
        </div>
    )
}

export default PercentageBar
