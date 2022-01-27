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
const columns = [
  {id: 2, name: "title", label: "タイトル"},
  {id: 3, name: "ng_keywords", label: "NGキーワード"},
  {id: 4, name: "button", display:false, label:""},
] as ColumnType[]



interface Props {
  productConditions : any[]
}


const Condition: NextPage = (props) => {
  const {productConditions} = props as Props 
  const [open, setOpen] = useState<string>("")
  const [currentRow, setCurrentRow] = useState<ProductConditionType | null>(null)
  const [mode, setMode] = useState<"edit" | "create" | "">("")

  productConditions.map((row) => {
    row.button = (
      <div className='table-button-container'>
      <ColorButton color={teal} label="編集"
       onClick={() => onEdit(row)}/>
       <ColorButton color={blue} label="複製"
       onClick={() => onEdit(row)}/>
       <ColorButton color={red} label="削除"
       onClick={() => onDelete(row)}/>
      </div>
    )
    return row
  })

  const onEdit = (row:ProductConditionType) => {
    setCurrentRow(row)
    setMode("edit")
    setOpen("ProductForm")
  }

  const onCreate = () => {
    setMode("create")
    setOpen("ProductForm")
  }

  const onDelete = (row:ProductConditionType) => {
    setOpen("DeleteForm")
    setCurrentRow(row)
  }
    return (
      <Container>
        <ColorButton color={blue} label="追加登録" onClick={onCreate} className='margin-button'/>
        <Table columns={columns} rows={productConditions}/>
        <ConditionForm open={open==="ProductForm"} setOpen={setOpen} mode={mode} row={currentRow}/>
        <DeleteForm open={open==="DeleteForm"} setOpen={setOpen} title={currentRow?.title} 
        endpoint={`api/v1/condition/${currentRow?.id}/`}/>
      </Container>
    )
  }

  export async function getStaticProps() {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    let productConditions:any[] = []
    try {
      const res = await backendAxios.get('api/v1/condition/')
      productConditions = res.data
      for (let i = 0; i < productConditions.length; i++) {
        const ngKeywords = []
        const ngKeywordConditions = productConditions[i].ng_keyword_conditions
        for (let j = 0; j < ngKeywordConditions.length; j++) {
          const ngKeywordCondition = ngKeywordConditions[j]
          ngKeywords.push(ngKeywordCondition["ng_keyword"])
        }
        productConditions[i].ng_keywords = ngKeywords
      }
    } catch(err) {
      console.log(err)
    }
  
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        productConditions,
      },
    }
  }

  export default Condition
  
