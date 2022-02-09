import React, {useState} from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {changeCurrentPage, insertRows} from '../../store/reducers/tableReducer'
import backendAxios from '../helpers/axios';

function CustomPagination() {
    const rowsCount = useAppSelector(state => state.tables.rowsCount)
    const currentPage = useAppSelector(state => state.tables.currentPage)
    const endpoint = useAppSelector(state => state.tables.endpoint)
    const dispatch = useAppDispatch()
    const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
      try {
        let url:string = ""
        if (endpoint.includes("?")) {
          url = `${endpoint}&page=${value}`
        } else {
          url = `${endpoint}?page=${value}`
        }
        const res = await backendAxios.get(url)
        dispatch(insertRows(res.data.results))
        dispatch(changeCurrentPage(value))
      } catch (err) {
        console.log(err)
      }
      };
    const rowsPerPage = 100
    var count:number = Math.floor(rowsCount / rowsPerPage)
    if (rowsCount%rowsPerPage !== 0) {
      count += 1
    }
  return (
    <Stack spacing={2} className="pagination-container">
        <Pagination count={count} color="primary" page={currentPage} onChange={handleChange} />
    </Stack>
  )
}

export default CustomPagination;
