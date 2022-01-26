import React from 'react'
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
  const {results} = props as Props
  results.map((row) => {
    const priorities = {
      "高": highColor,
      "中": middleColor,
      "低": lowColor,
      "使用中": unknownColor

    }
    row.button = (
      <div className='table-button-container'>
       <ColorButton color={blue} label="確認済"
       onClick={() => {console.log()}}/>
      </div>
    )
    return row
  })
    return (
        <Container>
            <div className={styles.headerContainer}>
            <div>
            <Link href="/results">
                    <a>チェック結果一覧</a>
            </Link>
            　>　チェック結果詳細
            </div>
            <ColorButton color={blue} label="絞り込む" onClick={() => {console.log('clicked')}} className='margin-button'/>
            </div>
            <Table columns={columns} rows={results}/>
        </Container>
    )
}

export async function getServerSideProps(context:any)  {
    const productId = context.query.id;
    console.log('this is product id', productId)
    let results:any[] = []
    try {
      const res = await backendAxios.get(`api/v1/result/list?product_id=${productId}`)
      console.log(res.data)
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
