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
import {RowType, ColumnType} from '../src/components/CustomTable'
import dateFormatter from '../src/helpers/dateFormatter';

const columns = [
  {id: 1, name: "trademark", label: "商標"},
  {id: 2, name: "domain", label: "ドメイン"},
  {id: 3, name: "type_display", label:"登録種類"},
  {id: 4, name: "created_at", label:"登録日"},
  {id: 5, name: "button", display: false},
] as ColumnType[]




interface Props {
  trademarks: TrademarkType[],
  domains: any[]
}

const DomainSetting: NextPage = (props) => {
    const {trademarks, domains} = props as Props
    const [open, setOpen] = useState<string>("")
    const [mode, setMode] = useState<"edit" | "create" | "">("")
    const [currentRow, setCurrentRow] = useState<DomainType | null>(null)

    const onEdit = (row:DomainType) => {
      setMode("edit")
      setCurrentRow(row)
      setOpen("DomainForm")
    }
  
    const onCreate = () => {
      setMode("create")
      setCurrentRow(null)
      setOpen("DomainForm")
    }
  
    const onDelete = (row:DomainType) => {
      setOpen("DeleteForm")
      setCurrentRow(row)
    }

    useEffect(() => {
      domains.map((row) => {
        row.created_at = dateFormatter(row.created_at)
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
    }, [])


    return (
      <Container>
        <ColorButton color={blue} label="追加登録" onClick={onCreate} className='margin-button'/>
          <Table columns={columns} rows={domains}/>
          <DomainForm
          open={open==="DomainForm"}
          setOpen={setOpen} mode={mode}
          row={currentRow}
          trademarks={trademarks}
          />
          <DeleteForm open={open==="DeleteForm"} setOpen={setOpen} title={currentRow?.domain} 
        endpoint={`api/v1/domain/${currentRow?.id}/`}/>
      </Container>
    )
  }

  export async function getStaticProps() {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    let trademarks:TrademarkType[] = []
    let domains:any[] = []
    try {
      const res = await backendAxios.get('api/v1/domain/trademark/')
      console.log(res.data)
      trademarks = res.data
    } catch(err) {
      console.log(err)
    }
    try {
      const res = await backendAxios.get('api/v1/domain/')
      console.log(res.data)
      domains = res.data
    } catch(err) {
      console.log(err)
    }

  
  
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        trademarks,
        domains
      },
    }
  }
  export default DomainSetting