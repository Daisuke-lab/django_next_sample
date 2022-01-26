import React from 'react'
import type { NextPage } from 'next'
import Container from '../../src/components/Container'
import Table from '../../src/components/CustomTable'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ColorButton from '../../src/components/ColorButton';
import { red, blue } from '@mui/material/colors';
import {RowType, ColumnType} from '../../src/components/CustomTable'
import backendAxios from '../../src/helpers/axios'
import dateFormatter from '../../src/helpers/dateFormatter';
import styles from '../../styles/Results.module.css'
import { workerData } from 'worker_threads';
import PercentageBar from '../../src/components/PercentageBar';
import {highColor, middleColor, lowColor, unknownColor} from "../../src/helpers/colors"
import { useRouter } from 'next/router'
const priorities = [
  {color: highColor, label: "高"},
  {color: middleColor, label: "中"},
  {color: lowColor, label: "低"},
  {color: unknownColor, label: "判定中"},
]

const priority = () => (
  <div>
    <p>優先度割合</p>
    <div className={styles.prioritiesContainer}>
    {priorities.map((priority) =>  (
        <div className={styles.priorityContainer}>
        <div className={styles.priorityBox} style={{backgroundColor: priority.color}}></div>
        <p>{priority.label}</p>
        </div>
      )
    )}
    </div>
  </div>
  )
const columns = [
  {id: 1, name: "product_name", label: "商品名"},
  {id: 2, name: "trademarks", label: "商標キーワード"},
  {id: 3, name: "genre", label:"ジャンル"},
  {id: 4, name: "latest_check_date", label:"チェック日"},
  {id: 5, name: "priority", label: priority()},
  {id: 6, name: "button", display: false},
] as ColumnType[]




interface Props {
  results: any[]
}



const Result: NextPage = (props) => {

  const {results} = props as Props
  const router = useRouter()
  results.map((row) => {
    row.latest_check_date = dateFormatter(row.latest_check_date)
    const sum = row.priorities.sum
    const colors = {high: highColor, middle: middleColor, low: lowColor, unknown: unknownColor}
    const priorities = {...row.priorities}
    delete priorities.sum
    row.priority = (
      <div>
      <div className={styles.prioritiesContainer}>
        {Object.keys(priorities).map((key) => (
          <div className={styles.priorityContainer}>
          <div className={styles.priorityBox} style={{backgroundColor: colors[key]}}></div>
          <p>{row.priorities[key]}</p>
          </div>
        ))}
      </div>
      <PercentageBar {...row.priorities}/>
      </div>

    )
    row.button = (
      <div className='table-button-container'>
       <ColorButton color={blue} label="詳細"
       onClick={() => {router.push(`/results/${row.id}`)}}/>
      </div>
    )
    return row
  })
    return (
      <Container>
        <ColorButton color={blue} label="絞り込む" onClick={() => {console.log('clicked')}} className='margin-button'/>
          <Table columns={columns} rows={results}/>
      </Container>
    )
  }

  export async function getStaticProps() {

    let results:any[] = []
    try {
      const res = await backendAxios.get('api/v1/result/product/')
      results = res.data
    } catch(err) {
      console.log(err)
    }
    return {
      props: {
        results
      },
    }
  }


  export default Result