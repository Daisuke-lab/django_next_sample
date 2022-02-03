import React, {useState} from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux'
import {changeCurrentPage, insertRows} from '../../store/reducers/tableReducer'
import backendAxios from '../helpers/axios';

function CustomPagination() {
    const rowsCount = useSelector(state => state.tables.rowsCount)
    const currentPage = useSelector(state => state.tables.currentPage)
    const endpoint = useSelector(state => state.tables.endpoint)
    const dispatch = useDispatch()
    const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
      try {
        const url = `${endpoint}?page=${value}`
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
