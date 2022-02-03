import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import Container from '../../src/components/Container'
import Link from 'next/link'
import ColorButton from '../../src/components/ColorButton';
import { red, blue } from '@mui/material/colors';
import styles from '../../styles/Results.module.css'
import {RowType, ColumnType} from '../../src/components/CustomTable'
import backendAxios from '../../src/helpers/axios'
import Table from '../../src/components/CustomTable'
import Chip from '@mui/material/Chip';
import {highColor, middleColor, lowColor, unknownColor} from "../../src/helpers/colors"
import ResultDetailForm from '../../src/components/ResultDetailForm';
import { useSelector, useDispatch } from 'react-redux'
import {insertRows, changeMode, changeOpendForm, changeCurrentPage, insertRowsCount, changeEndpoint} from '../../store/reducers/tableReducer'


const columns = [
    {id: 1, name: "domain", label: "ドメイン"},
    {id: 2, name: "url", label: "URL"},
    {id: 3, name: "ng_keywords", label:"NGKW"},
    {id: 4, name: "priority", label:"優先度"},
    {id: 6, name: "button", label: "確認状況"},
  ] as ColumnType[]

  interface Props {
    results: any[],
    rowsCount : number,
    productId: number
  }

const Result: NextPage = (props) => {
  const [confirmedResult, setConfirmedResult] = useState<number[]>([])
  const {results, rowsCount, productId} = props as Props
  const dispatch = useDispatch()
  const openedForm = useSelector(state => state.tables.openedForm)
  useEffect(() => {
    dispatch(insertRows(results))
    dispatch(changeCurrentPage(1))
    dispatch(insertRowsCount(rowsCount))
    dispatch(changeEndpoint(`api/v1/result/list?product_id=${productId}`))
  }, [])

  const custmizeRow = (row:any) => {
    const priorities = {
      "高": highColor,
      "中": middleColor,
      "低": lowColor,
      "判定中": unknownColor

    }
    const priority_display = row.priority_display as "高" | "中" | "低" | "判定中"

    const priority = (
      <Chip label={row.priority_display} size="small"
       style={{backgroundColor: priorities[priority_display],
      color: "white"}}/>
    )

    const button = (
      <div className='table-button-container'>
       <ColorButton color={blue} label="確認済"
       disabled={row.confirmed || confirmedResult.includes(row.id)}
       onClick={() => {onConfirm(row)}}/>
      </div>
    )
    const newRow = {...row, button, priority}
    return newRow
  }
  const onConfirm = async (row:any) => {
    try {
      const data = {confirmed: true}
      const res = await backendAxios.put(`api/v1/result/${row.id}/`, data)
      setConfirmedResult([...confirmedResult, row.id])
    } catch(err) {
      console.log(err)
    }
  }


    return (
        <Container>
            <div className={styles.headerContainer}>
            <div>
            <Link href="/results">
                    <a>チェック結果一覧</a>
            </Link>
            {"　＞　"}チェック結果詳細
            </div >
            <ColorButton color={blue} label="絞り込む" onClick={() => dispatch(changeOpendForm('ResultDetailForm'))} className='margin-button'/>
            </div>
            <Table columns={columns}/>
            <ResultDetailForm
            open={openedForm==="ResultDetailForm"}
            />
        </Container>
    )
}

export async function getServerSideProps(context:any)  {
    const productId = context.query.id;
    let results:any[] = []
    try {
      const res = await backendAxios.get(`api/v1/result/list?product_id=${productId}`)
      results = res.data.results
    } catch(err) {
      console.log(err)
    }
    return {
      props: {
        results,
        productId
      },
    }
  }

export default Result
