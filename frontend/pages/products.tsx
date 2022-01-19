import React, {useState} from 'react'
import type { NextPage } from 'next'
import Container from '../src/components/Container'
import Table from '../src/components/CustomTable'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ColorButton from '../src/components/ColorButton';
import { red, blue, teal } from '@mui/material/colors';
import {RowType, ColumnType} from '../src/components/CustomTable'
import {productColumns} from '../src/helpers/formColumns'
import FormModal, {FormColumnType, FormType} from '../src/components/FormModal'
import ProductForm from '../src/components/ProductForm';
const columns = [
  {id: 1, name: "id"},
  {id: 2, name: "lastName"},
  {id: 3, name: "firstName"},
  {id: 4, name: "age"},
  {id: 5, name: "button", display:false},
] as ColumnType[]

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
] as RowType[]





const Main: NextPage = () => {
  const [open, setOpen] = useState<string>("")
  const [mode, setMode] = useState<"edit" | "create" | "">("")
  const onEdit = (row:RowType) => {
    productColumns.map((column) => {
      column.defaultValue = row[column.name]
      return column
    })
    setMode("edit")
    setOpen("ProductForm")
  }

  const onCreate = () => {
    setMode("create")
    setOpen("ProductForm")
  }
  rows.map((row) => {
    row.button = (
      <div className='table-button-container'>
      <ColorButton color={teal} label="編集"
       onClick={() => onEdit(row)}/>
       <ColorButton color={red} label="削除"
       onClick={() => {console.log('clicked')}}/>
      </div>
    )
    return row
  })
    return (
      <Container>
        <ColorButton color={blue} label="商品登録" onClick={onCreate} className='margin-button'/>
        <ColorButton color={red} label="一括削除" onClick={() => {console.log('clicked')}} className='margin-button'/>
        <Table columns={columns} rows={rows}/>
        <ProductForm open={open==="ProductForm"} setOpen={setOpen} mode={mode}/>
      </Container>
    )
  }
  export default Main
  
