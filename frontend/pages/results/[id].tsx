import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import Container from '../../src/components/Container'
import ColorButton from '../../src/components/ColorButton';
import { red, blue } from '@mui/material/colors';
import styles from '../../styles/Results.module.css'
import {RowType, ColumnType} from '../../src/components/CustomTable'
import backendAxios from '../../src/helpers/axios'
import Table from '../../src/components/CustomTable'
import Chip from '@mui/material/Chip';
import {highColor, middleColor, lowColor, unknownColor} from "../../src/helpers/colors"
import ResultDetailForm from '../../src/components/ResultDetailForm';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {insertRows, changeMode, changeOpendForm, changeCurrentPage,
   insertRowsCount, changeEndpoint, addConfirmedRowId} from '../../store/reducers/tableReducer'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
    productId: number,
    endpoint: string
  }

const Result: NextPage = (props) => {
  console.log(props)
  const {results, rowsCount, productId, endpoint} = props as Props
  const dispatch = useAppDispatch()
  const openedForm = useAppSelector(state => state.tables.openedForm)
  const confirmedRowIds = useAppSelector(state => state.tables.confirmedRowIds)
  const rows = useAppSelector(state => state.tables.rows)
  useEffect(() => {
    dispatch(insertRows(results))
    dispatch(changeCurrentPage(1))
    dispatch(insertRowsCount(rowsCount))
    dispatch(changeEndpoint(endpoint))
  }, [])

  const customizeRow = (row:any) => {
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
       disabled={row.confirmed}
       onClick={() => {onConfirm(row)}}/>
      </div>
    )
    const newRow = {...row, button, priority}
    return newRow
  }
  const onConfirm = async (row:any) => {
    try {
      console.log(row.id)
      const data = {confirmed: true}
      const res = await backendAxios.put(`api/v1/result/${row.id}/`, data)
      const newRows = [...rows]
      const index = newRows.indexOf(row)
      const newRow = {...row, confirmed: true}
      newRows.splice(index, 1, newRow)
      dispatch(insertRows(newRows))
    } catch(err) {
      console.log(err)
    }
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/results">
      チェック結果一覧
    </Link>,
    <Typography key="3" color="text.primary">
      チェック結果詳細
    </Typography>,
  ];


    return (
        <Container>
            <div className={styles.headerContainer}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
            
            <ColorButton color={blue} label="絞り込む" onClick={() => dispatch(changeOpendForm('ResultDetailForm'))} className='margin-button'/>
            </div>
            <Table columns={columns} customizeRow={customizeRow}/>
            <ResultDetailForm
            open={openedForm==="ResultDetailForm"}
            />
        </Container>
    )
}

export async function getServerSideProps(context:any)  {
    const productId = context.query.id;
    let results:any[] = []
    let rowsCount:number = 0
    const endpoint = `api/v1/result/list?product_id=${productId}`
    try {
      const res = await backendAxios.get(endpoint)
      console.log("datat::",res.data)
      results = res.data?.results !== undefined ?res.data?.results:[]
      rowsCount = res.data?.count !== undefined ?res.data?.count:0
    } catch(err) {
      console.log(err)
    }
    return {
      props: {
        results,
        productId,
        endpoint,
        rowsCount
      },
    }
  }

export default Result
