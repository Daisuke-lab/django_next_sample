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
import axios from 'axios'
import Checkbox from '@mui/material/Checkbox';

 
export interface RowType {
    [key: string] : any
}

export interface ColumnType {
  id: number,
  name: string,
  display?: boolean,
  label: string

}
 interface Props {
   rows: RowType[],
   columns: ColumnType[]
 }
 
export default function CustomTable(props:Props) {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rows, setRows] = useState<RowType[]>(props.rows)
  const [selected, setSelected] = useState<readonly number[]>([]);


  const handleChangePage = (e:React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage:number) => {
    setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event:React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };
 
  return (
    <Paper sx={{ width: '90%', overflow: 'hidden', marginTop: '20px',
    marginLeft: "auto", marginRight: "auto", marginBottom: "20px" }}>
      <TableContainer sx={{ maxHeight: 700 }}>
      <Table sx={{ minWidth: 700 }}  stickyHeader aria-label="sticky table">
        <CustomTableHeader columns={props.columns} rows={rows}
         setRows={setRows} numSelected={selected.length} setSelected={setSelected}/>
        <TableBody>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              className="pagination-box"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={CustomTablePaginationActions}
            />
    </Paper>
  );
}
