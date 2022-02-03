import React from 'react';
import PercentageBar from '../../src/components/PercentageBar';
import styles from '../../styles/Results.module.css'
import {highColor, middleColor, lowColor, unknownColor} from "../../src/helpers/colors"
import {priorities} from '../../pages/results/index'

interface Props {
    row: any
}
function ResultRowPriority(props:Props) {
    const colors = {high: highColor, middle: middleColor, low: lowColor, unknown: unknownColor}
    console.log(props.row)
  return <div>
  <div className={styles.prioritiesContainer}>
    {Object.keys(priorities).map((key, index) => (
      <div className={styles.priorityContainer} key={`priority-row-${index}`}>
      <div className={styles.priorityBox} 
      style={{backgroundColor: colors[key as "high" | "middle" | "low" | "unknown"]}}></div>
      <p>{props.row.priorities !== null && props.row.priorities !== undefined?props.row.priorities[key]:""}</p>
      </div>
    ))}
  </div>
  <PercentageBar {...props.row.priorities}/>
  </div>;
}

export default ResultRowPriority;
