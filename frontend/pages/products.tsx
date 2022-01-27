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
import ProductForm, {ProductType} from '../src/components/ProductForm';
import backendAxios from '../src/helpers/axios'
import {GenreType} from '../src/GlobalType'
import dateFormatter from '../src/helpers/dateFormatter';
import DeleteForm from '../src/components/DeleteForm';

const columns = [
  {id: 1, name: "name", label: "商品名"},
  {id: 2, name: "product_condition", label: "チェック条件"},
  {id: 3, name: "genre", label:"ジャンル"},
  {id: 4, name: "created_at", label:"登録日"},
  {id: 5, name: "updated_at", label:"最終チェック日"},
  {id: 5, name: "button", display: false},
] as ColumnType[]




interface Props {
  genres: GenreType[],
  products : any[],
  productConditions: any[]
}


const Main: NextPage = (props) => {
  const [open, setOpen] = useState<string>("")
  const [mode, setMode] = useState<"edit" | "create" | "">("")
  const [currentRow, setCurrentRow] = useState<ProductType | null>(null)
  const {genres, products, productConditions} = props as Props

  const onEdit = (row:ProductType) => {
    setMode("edit")
    setCurrentRow(row)
    setOpen("ProductForm")
  }

  const onCreate = () => {
    setMode("create")
    setCurrentRow(null)
    setOpen("ProductForm")
  }

  const onDelete = (row:ProductType) => {
    setOpen("DeleteForm")
    setCurrentRow(row)
  }

  products.map((row) => {
    row.created_at = dateFormatter(row.created_at)
    row.updated_at = dateFormatter(row.updated_at)
    row.button = (
      <div className='table-button-container'>
      <ColorButton color={teal} label="編集"
       onClick={() => onEdit(row)}/>
       <ColorButton color={red} label="削除"
       onClick={() => onDelete(row)}/>
      </div>
    )
    return row
  })
    return (
      <Container>
        <ColorButton color={blue} label="商品登録" onClick={onCreate} className='margin-button'/>
        <ColorButton color={red} label="一括削除" onClick={() => {console.log('clicked')}} className='margin-button'/>
        <Table columns={columns} rows={products}/>
        <ProductForm open={open==="ProductForm"} setOpen={setOpen} mode={mode}
        genres={genres}
        row={currentRow}
        productConditions={productConditions}/>
        <DeleteForm open={open==="DeleteForm"} setOpen={setOpen} title={currentRow?.name} 
        endpoint={`api/v1/product/${currentRow?.id}/`}/>
      </Container>
    )
  }

  export async function getStaticProps() {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    let productConditions:any[] = []
    let genres:any[] = []
    let products:any[] = []
    try {
      const res = await backendAxios.get('api/v1/condition/')
      console.log(res.data)
      productConditions = res.data
    } catch(err) {
      console.log(err)
    }

    try {
      const res = await backendAxios.get('api/v1/product/genre/')
      genres = res.data
    } catch(err) {
      console.log(err)
    }

    try {
      const res = await backendAxios.get('api/v1/product')
      products = res.data
      for (let i = 0; i < products.length; i++) {
        const newTrademarks = []
        const trademarks = products[i].trademarks
        for (let j = 0; j < trademarks.length; j++) {
          const trademark = trademarks[j]
          newTrademarks.push(trademark["name"])
        }
        products[i].trademarks = newTrademarks
      }
    } catch(err) {
      console.log(err)
    }
  
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        products,
        genres,
        productConditions
      },
    }
  }
  export default Main
  
