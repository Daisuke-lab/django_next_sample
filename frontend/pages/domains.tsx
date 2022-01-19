import React from 'react'
import type { NextPage } from 'next'
import Container from '../src/components/Container'
import Table from '../src/components/CustomTable'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ColorButton from '../src/components/ColorButton';
import { red, blue } from '@mui/material/colors';



const columns = [
  {id: 1, name: "id"},
  {id: 2, name: "lastName"},
  {id: 3, name: "firstName"},
  {id: 4, name: "age"},
]

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, test:<button>test</button> },
];



const REmovingDomainSetting: NextPage = () => {
    return (
      <Container>
        <ColorButton color={blue} label="商品登録" onClick={() => {console.log('clicked')}} className='margin-button'/>
        <ColorButton color={red} label="一括削除" onClick={() => {console.log('clicked')}} className='margin-button'/>
          <Table columns={columns} rows={rows}/>
      </Container>
    )
  }
  export default REmovingDomainSetting