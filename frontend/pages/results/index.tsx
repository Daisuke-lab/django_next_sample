import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import Container from '../../src/components/Container'
import Table from '../../src/components/CustomTable'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ColorButton from '../../src/components/ColorButton';
import { red, blue } from '@mui/material/colors';
import {RowType, ColumnType} from '../../src/components/CustomTable'
import backendAxios from '../../src/helpers/axios'
import styles from '../../styles/Results.module.css'
import { workerData } from 'worker_threads';
import PercentageBar from '../../src/components/PercentageBar';
import {highColor, middleColor, lowColor, unknownColor} from "../../src/helpers/colors"
import { useRouter } from 'next/router'
import ResultForm from '../../src/components/ResultForm';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {insertRows, changeMode, changeOpendForm, changeEndpoint, changeCurrentPage, insertRowsCount} from '../../store/reducers/tableReducer'
import ResultRowButton from '../../src/components/ResultRowButton';
import ResultRowPriority from '../../src/components/ResultRowPriority';

export const priorities = [
  {color: highColor, label: "高"},
  {color: middleColor, label: "中"},
  {color: lowColor, label: "低"},
  {color: unknownColor, label: "判定中"},
]

const priority = () => (
  <div>
    <p>優先度割合</p>
    <div className={styles.prioritiesContainer}>
    {priorities.map((priority, index) =>  (
        <div className={styles.priorityContainer} key={`priority-column-${index}`}>
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
  {id: 4, name: "small_genre", label:"ジャンル（小）"},
  {id: 5, name: "latest_check_date", label:"チェック日"},
  {id: 6, name: "priority", label: priority()},
  {id: 7, name: "button", display: false},
] as ColumnType[]




interface Props {
  results: any[],
  rowsCount: number
}



const Result: NextPage = (props) => {

  const {results, rowsCount} = props as Props
  const dispatch = useAppDispatch()
  const openedForm = useAppSelector(state => state.tables.openedForm)
  
  
  const router = useRouter()

  useEffect(() => {
    dispatch(insertRows(results))
    dispatch(changeCurrentPage(1))
    dispatch(insertRowsCount(rowsCount))
    dispatch(changeEndpoint("api/v1/result/product"))
    
  }, [])

  const customizeRow = (row:any) => {
    const newRow = {...row, priority:<ResultRowPriority row={row}/>, button: <ResultRowButton row={row}/>}
    return newRow
  }

  const onFilter = () => {
    dispatch(changeOpendForm('ResultForm'))
  }
    return (
      <Container>
        <div  className='header-button-container'>
        <ColorButton color={blue} label="絞り込む" onClick={onFilter} className='margin-button'/>
        </div>
          <Table columns={columns} customizeRow={customizeRow}/>
          <ResultForm open={"ResultForm"===openedForm}/>
      </Container>
    )
  }

  export async function getServerSideProps(context:any) {

    let results:any[] = []
    let rowsCount:number = 0
    try {
      const res = await backendAxios.get('api/v1/result/product')
      results = res.data?.results !== undefined ?res.data?.results:[]
      rowsCount = res.data?.count !== undefined ?res.data?.count:0
    } catch(err) {
      console.log(err)
    }
    return {
      props: {
        results,
        rowsCount
      },
    }
  }


  export default Result