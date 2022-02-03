import React, {useEffect, useState} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomTablePaginationActions from './CustomTablePaginationActions';
import CustomTableHeader from './CustomTableHeader';
import Footer from './Footer'
import Checkbox from '@mui/material/Checkbox';
import { useSelector, useDispatch } from 'react-redux'
import {addRow, closeForm, insertRows, insertCheckedRows} from '../../store/reducers/tableReducer'
import formatter from '../helpers/formatter';
import CustomPagination from './CustomPagination';
export interface RowType {
    [key: string] : any
}

export interface ColumnType {
  id: number,
  name: any,
  display?: boolean,
  label: string

}
 interface Props {
   columns: ColumnType[],
   customizeRow?: (row:any) => void
  }
 
export default function CustomTable(props:Props) {
  const [page, setPage] = useState<number>(0);
  const {customizeRow} = props
  const dispatch = useDispatch()
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const rowsData = useSelector(state => state.tables.rows)
  const checkedRows = useSelector(state => state.tables.checkedRows)
  const [rows, setRows] = useState<RowType[]>(rowsData)
  
  useEffect(() => {
    const newRowsData = rowsData.map((row:any) => {
      const newRow = customizeRow !== undefined?customizeRow(row):row
      return newRow
    })
    console.log(newRowsData)
    setRows(newRowsData)
  }, [rowsData])

  // useEffect(() => {
  //   setRows(props.rows)
  // }, [props.rows])


  const handleChangePage = (e:React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage:number) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event:React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => checkedRows.indexOf(id) !== -1;

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = checkedRows.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(checkedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(checkedRows.slice(1));
    } else if (selectedIndex === checkedRows.length - 1) {
      newSelected = newSelected.concat(checkedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        checkedRows.slice(0, selectedIndex),
        checkedRows.slice(selectedIndex + 1),
      );
    }
    dispatch(insertCheckedRows(newSelected))
  };
 
  return (
    <>
    <Paper sx={{ width: '90%', overflow: 'hidden', marginTop: '20px',
    marginLeft: "auto", marginRight: "auto", marginBottom: "20px" }}>
      <TableContainer sx={{ maxHeight: 400 }}>
      <Table sx={{ minWidth: 700 }}  stickyHeader aria-label="sticky table">
        <CustomTableHeader columns={props.columns} rows={rows}
         setRows={setRows} numSelected={checkedRows.length}/>
        <TableBody>
          {rows
            .map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={`table-row-${index}`}>
                  <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row.id)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                  {props.columns.map((column) => {
                    const value = row[column.name];
                    return (
                      <TableCell key={column.id}>
                        {formatter(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
    </Paper>
    <CustomPagination/>
    </>
  );
}
