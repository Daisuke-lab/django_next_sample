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
import { useSelector, useDispatch } from 'react-redux'
import {insertRows, changeMode, changeOpendForm, changeCurrentPage, insertRowsCount, changeEndpoint} from '../store/reducers/tableReducer'
import ConditionRowButton from '../src/components/ConditionRowButton'
const columns = [
  {id: 2, name: "title", label: "タイトル"},
  {id: 3, name: "ng_keywords", label: "NGキーワード"},
  {id: 4, name: "button", display:false, label:""},
] as ColumnType[]



interface Props {
  productConditions : any[],
  rowsCount: number
}


const Condition: NextPage = (props) => {
  const {productConditions, rowsCount} = props as Props 
  const openedForm = useSelector(state => state.tables.openedForm)
  const currentRow = useSelector(state => state.tables.currentRow)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(insertRows(productConditions))
    dispatch(changeCurrentPage(1))
    dispatch(insertRowsCount(rowsCount))
    dispatch(changeEndpoint("api/v1/condition/"))
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

  export async function getStaticProps() {
    let productConditions:any[] = []
    let rowsCount:number = 0
    try {
      const res = await backendAxios.get('api/v1/condition/')
      productConditions = res.data.results
      rowsCount = res.data.count
    } catch(err) {
      console.log(err)
    }
    return {
      props: {
        productConditions,
        rowsCount
      },
    }
  }

  export default Condition
  
