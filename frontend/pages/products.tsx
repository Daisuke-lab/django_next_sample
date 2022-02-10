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
import { useSession,getSession } from "next-auth/react"
import backendAxios from '../src/helpers/axios'
import {GenreType} from '../src/GlobalType'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import DeleteForm from '../src/components/DeleteForm';
import {insertRows, changeMode, changeOpendForm, insertRowsCount, changeCurrentPage, changeEndpoint} from '../store/reducers/tableReducer'
import ConditionRowButton from '../src/components/ConditionRowButton';
import ProductRowButton from '../src/components/ProductRowButton';
import Footer from "../src/components/Footer"
const columns = [
  {id: 1, name: "name", label: "商品名"},
  {id: 2, name: "product_condition", label: "チェック条件"},
  {id: 3, name: "genre", label:"ジャンル"},
  {id: 4, name: "small_genre", label:"ジャンル（小）"},
  {id: 5, name: "created_at", label:"登録日"},
  {id: 6, name: "updated_at", label:"最終チェック日"},
  {id: 7, name: "button", display: false},
] as ColumnType[]




interface Props {
  genres: GenreType[],
  products : any[],
  productConditions: any[],
  rowsCount: number
}


const Main: NextPage = (props) => {
  const {genres, products, productConditions, rowsCount} = props as Props
  const openedForm = useAppSelector(state => state.tables.openedForm)
  const currentRow = useAppSelector(state => state.tables.currentRow)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(insertRows(products))
    dispatch(insertRowsCount(rowsCount))
    dispatch(changeCurrentPage(1))
    dispatch(changeEndpoint("api/v1/product/"))

    
  }, [])


  const onCreate = () => {
    dispatch(changeOpendForm('ProductForm'))
    dispatch(changeMode('new'))
  }

  const customizeRow = (row:any) => {
    const newRow = {...row, button: <ProductRowButton row={row}/>}
    return newRow
  }


    return (
      <Container>
        <div  className='header-button-container'>
        <ColorButton color={blue} label="商品登録" onClick={onCreate} className='margin-button'/>
        <ColorButton color={red} label="一括削除" onClick={() => {console.log('clicked')}} className='margin-button'/>
        </div>
        <Table columns={columns} customizeRow={customizeRow}/>
        <Footer/>
        <ProductForm open={openedForm==="ProductForm"}
        genres={genres}
        productConditions={productConditions}/>
        <DeleteForm open={openedForm==="DeleteForm"} title={currentRow?.name} 
        endpoint={`api/v1/product/${currentRow?.id}/`}/>
      </Container>
    )
  }

  export async function getServerSideProps(context:any) {
    const session = await getSession(context) 
    const userId = session?.id

    let productConditions:any[] = []
    let genres:any[] = []
    let products:any[] = []
    let rowsCount:number = 0
    try {
      const res = await backendAxios.get(`api/v1/condition/list?user=${userId}`)
      console.log(res.data)
      productConditions = res.data !== undefined ?res.data:[]
    } catch(err) {
      console.log(err)
    }

    try {
      const res = await backendAxios.get('api/v1/product/genre/')
      genres = res.data !== undefined ?res.data:[]
    } catch(err) {
      console.log(err)
    }

    try {
      const res = await backendAxios.get(`api/v1/product/?user=${userId}`)
      products = res.data?.results !== undefined ?res.data?.results:[]
      rowsCount = res.data?.count !== undefined ?res.data?.count:0
    } catch(err) {
      console.log(err)
    }

    return {
      props: {
        products,
        genres,
        productConditions,
        rowsCount
      },
    }
  }
  export default Main
  
