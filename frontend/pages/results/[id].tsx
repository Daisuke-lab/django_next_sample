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
const columns = [
    {id: 1, name: "domain", label: "ドメイン"},
    {id: 2, name: "url", label: "URL"},
    {id: 3, name: "ng_keywords", label:"NGKW"},
    {id: 4, name: "priority", label:"優先度"},
    {id: 6, name: "button", label: "確認状況"},
  ] as ColumnType[]

  interface Props {
    results: any[]
  }

const Result: NextPage = (props) => {
  const [confirmedResult, setConfirmedResult] = useState<number[]>([])
  const {results:resultData} = props as Props
  const [results, setResults] = useState<any[]>(resultData)
  const [open, setOpen] = useState<string>("")
    results.map((row) => {
      const priorities = {
        "高": highColor,
        "中": middleColor,
        "低": lowColor,
        "使用中": unknownColor
  
      }

      row.priority = (
        <Chip label={row.priority_display} size="small"
         style={{backgroundColor: priorities[row.priority_display],
        color: "white"}}/>
      )
      row.button = (
        <div className='table-button-container'>
         <ColorButton color={blue} label="確認済"
         disabled={row.confirmed || confirmedResult.includes(row.id)}
         onClick={() => {onConfirm(row)}}/>
        </div>
      )
      return row
    })

  const onConfirm = async (row:any) => {
    try {
      const data = {confirmed: true}
      const res = await backendAxios.put(`api/v1/result/${row.id}/`, data)
      setConfirmedResult([...confirmedResult, row.id])
    } catch(err) {
      console.log(err)
    }
  }

  const onFilter = () => {
    setOpen('ResultDetailForm')
  }
    return (
        <Container>
            <div className={styles.headerContainer}>
            <div>
            <Link href="/results">
                    <a>チェック結果一覧</a>
            </Link>
            　>　チェック結果詳細
            </div>
            <ColorButton color={blue} label="絞り込む" onClick={onFilter} className='margin-button'/>
            </div>
            <Table columns={columns} rows={results}/>
            <ResultDetailForm
            open={open==="ResultDetailForm"}
            setOpen={setOpen}
            results={results}
            setResults={setResults}
            mode=""
            />
        </Container>
    )
}

export async function getServerSideProps(context:any)  {
    const productId = context.query.id;
    let results:any[] = []
    try {
      const res = await backendAxios.get(`api/v1/result/list?product_id=${productId}`)
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
