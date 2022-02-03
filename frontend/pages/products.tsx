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
import { useSelector, useDispatch } from 'react-redux'
import DeleteForm from '../src/components/DeleteForm';
import {insertRows, changeMode, changeOpendForm, insertRowsCount, changeCurrentPage, changeEndpoint} from '../store/reducers/tableReducer'
import ConditionRowButton from '../src/components/ConditionRowButton';
import ProductRowButton from '../src/components/ProductRowButton';
import Footer from "../src/components/Footer"
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
  productConditions: any[],
  rowsCount: number
}


const Main: NextPage = (props) => {
  const {genres, products, productConditions, rowsCount} = props as Props
  const openedForm = useSelector(state => state.tables.openedForm)
  const currentRow = useSelector(state => state.tables.currentRow)
  const dispatch = useDispatch()

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

  export async function getStaticProps() {

    let productConditions:any[] = []
    let genres:any[] = []
    let products:any[] = []
    let rowsCount:number = 0
    try {
      const res = await backendAxios.get('api/v1/condition/list/')
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
      const res = await backendAxios.get('api/v1/product/')
      products = res.data.results
      rowsCount = res.data.count
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
  
