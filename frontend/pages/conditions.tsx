import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import Container from '../src/components/Container'
import Table from '../src/components/CustomTable'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ColorButton from '../src/components/ColorButton';
import { red, blue, teal } from '@mui/material/colors';
import {RowType, ColumnType} from '../src/components/CustomTable'
import {productColumns} from '../src/helpers/formColumns'
import FormModal, {FormColumnType, FormType} from '../src/components/FormModal'
import ConditionForm, {ProductConditionType} from "../src/components/ConditionForm"
import backendAxios from '../src/helpers/axios'
import DeleteForm from '../src/components/DeleteForm';
import { useSession,getSession } from "next-auth/react"
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {insertRows, changeMode, changeOpendForm, changeCurrentPage, insertRowsCount, changeEndpoint} from '../store/reducers/tableReducer'
import ConditionRowButton from '../src/components/ConditionRowButton'
const columns = [
  {id: 2, name: "title", label: "タイトル"},
  {id: 3, name: "ng_keywords", label: "NGキーワード"},
  {id: 4, name: "button", display:false, label:""},
] as ColumnType[]



interface Props {
  productConditions : any[],
  rowsCount: number,
  endpoint: string
}


const Condition: NextPage = (props) => {
  console.log(props)
  const {productConditions, rowsCount, endpoint} = props as Props 
  const openedForm = useAppSelector(state => state.tables.openedForm)
  const currentRow = useAppSelector(state => state.tables.currentRow)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(insertRows(productConditions))
    dispatch(changeCurrentPage(1))
    dispatch(insertRowsCount(rowsCount))
    dispatch(changeEndpoint(endpoint))
  }, [])
  const customizeRow = (row:any) => {
    const newRow = {...row, button: <ConditionRowButton row={row}/>}
    return newRow
  }

  const onCreate = () => {
    dispatch(changeOpendForm('ConditionForm'))
    dispatch(changeMode('new'))
  }

    return (
      <Container>
        <div  className='header-button-container'>
        <ColorButton color={blue} label="追加登録" onClick={onCreate} className='margin-button'/>
        </div>
        <Table columns={columns} customizeRow={customizeRow}/>
        <ConditionForm open={openedForm==="ConditionForm"}/>
        <DeleteForm open={openedForm==="DeleteForm"} title={currentRow?.title}
        endpoint={`api/v1/condition/${currentRow?.id}/`}/>
      </Container>
    )
  }

  export async function getServerSideProps(context:any) {
    const session = await getSession(context) 
    const userId = session?.id

    let productConditions:any[] = []
    let rowsCount:number = 0
    const endpoint = `api/v1/condition/?user=${userId}`
    try {
      const res = await backendAxios.get(endpoint)
      productConditions = res.data?.results !== undefined ?res.data?.results:[]
      rowsCount = res.data?.count !== undefined ?res.data?.count:0
    } catch(err) {
      console.log(err)
    }
    return {
      props: {
        productConditions,
        rowsCount,
        endpoint 
      },
    }
  }

  export default Condition
  
