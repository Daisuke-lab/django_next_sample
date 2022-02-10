import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import Container from '../src/components/Container'
import Table from '../src/components/CustomTable'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ColorButton from '../src/components/ColorButton';
import { red, blue, teal } from '@mui/material/colors';
import DeleteForm from '../src/components/DeleteForm';
import DomainForm, {DomainType, TrademarkType} from '../src/components/DomainForm';
import backendAxios from '../src/helpers/axios'
import { useSession,getSession } from "next-auth/react"
import {RowType, ColumnType} from '../src/components/CustomTable'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {insertRows, changeMode, changeOpendForm, changeCurrentPage, insertRowsCount, changeEndpoint} from '../store/reducers/tableReducer'
import DomainRowButton from '../src/components/DomainRowButton';
const columns = [
  {id: 1, name: "trademark", label: "商標"},
  {id: 2, name: "domain", label: "ドメイン"},
  {id: 3, name: "type_display", label:"登録種類"},
  {id: 4, name: "created_at", label:"登録日"},
  {id: 5, name: "button", display: false},
] as ColumnType[]




interface Props {
  trademarks: TrademarkType[],
  domains: any[],
  rowsCount: number
}

const DomainSetting: NextPage = (props) => {
    const {trademarks, domains, rowsCount} = props as Props
    const openedForm = useAppSelector(state => state.tables.openedForm)
    const currentRow = useAppSelector(state => state.tables.currentRow)
    const dispatch = useAppDispatch()

    useEffect(() => {
      dispatch(insertRows(domains))
      dispatch(changeCurrentPage(1))
      dispatch(insertRowsCount(rowsCount))
      dispatch(changeEndpoint("api/v1/domain/"))
      
    }, [])


  
    const onCreate = () => {
      dispatch(changeOpendForm('DomainForm'))
      dispatch(changeMode('new'))
    }

    const customizeRow = (row:any) => {
      const newRow = {...row, button: <DomainRowButton row={row} />}
      return newRow
    }
  



    return (
      <Container>
        <div className='header-button-container'>
        <ColorButton color={blue} label="追加登録" onClick={onCreate} className='margin-button'/>
        </div>
          <Table columns={columns} customizeRow={customizeRow}/>
          <DomainForm
          open={openedForm==="DomainForm"}
          trademarks={trademarks}
          />
          <DeleteForm open={openedForm==="DeleteForm"} title={currentRow?.domain} 
        endpoint={`api/v1/domain/${currentRow?.id}/`}/>
      </Container>
    )
  }

  export async function getServerSideProps(context:any) {
    const session = await getSession(context) 
    const userId = session?.id
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    let trademarks:TrademarkType[] = []
    let domains:any[] = []
    let rowsCount:number = 0
    try {
      const res = await backendAxios.get(`api/v1/domain/trademark?user=${userId}`)
      trademarks = res.data !== undefined ?res.data:[]
    } catch(err) {
      console.log(err)
    }
    try {
      const res = await backendAxios.get(`api/v1/domain/?user=${userId}`)
      domains = res.data?.results !== undefined ?res.data?.results:[]
      rowsCount = res.data?.count !== undefined ?res.data?.count:0
    } catch(err) {
      console.log(err)
    }
    console.log({
      trademarks,
      domains,
      rowsCount
    })

    return {
      props: {
        trademarks,
        domains,
        rowsCount
      },
    }
  }
  export default DomainSetting