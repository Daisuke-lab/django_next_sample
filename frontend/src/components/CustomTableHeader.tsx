import React, {useState, useEffect} from 'react'
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { visuallyHidden } from '@mui/utils';
import sort from '../helpers/sort';
import Tooltip from '@mui/material/Tooltip';
import {RowType, ColumnType} from './CustomTable'
import Checkbox from '@mui/material/Checkbox';
import {addRow, closeForm, insertRows, insertCheckedRows} from '../../store/reducers/tableReducer'
import { useAppSelector, useAppDispatch } from '../../store/hooks'

interface Props {
  columns: ColumnType[],
  rows: RowType[],
  setRows: React.Dispatch<React.SetStateAction<RowType[]>>,
  numSelected: number
}


function CustomTableHeader(props:Props) {
    const [order, setOrder] = React.useState<"asc"|"desc"|undefined>('asc');
    const [orderBy, setOrderBy] = React.useState<string>('id');
    const {columns, rows, setRows, numSelected } = props;
    const rowCount = rows.length;
    const dispatch = useAppDispatch()
    const handleRequestSort = (columnName:string) => {
        const isAsc = orderBy === columnName && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnName);
      };
 
    useEffect(() => {
        const newOrderedRows = rows.slice().sort(sort(order, orderBy))
        setRows(newOrderedRows)
    }, [order, orderBy])


    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelecteds = rows.map((row) => row.id);
        if (numSelected > 0 && numSelected < rowCount) {
          dispatch(insertCheckedRows([]))
        } else {
          dispatch(insertCheckedRows(newSelecteds))
        }
        return;
      }
      dispatch(insertCheckedRows([]))
    };
 
   
    return (
        <TableHead>
          <TableRow>
          <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
            {columns.map((column, index) => (
              <TableCell
                key={column.name}
              >
                <TableSortLabel
              active={orderBy === column.name}
              direction={orderBy === column.name ? order : 'asc'}
              onClick={() => handleRequestSort(column.name)}
            >
              {orderBy === column.name ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
              {column.display === false?"":column.label}
            </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
    )
}
 
export default CustomTableHeader