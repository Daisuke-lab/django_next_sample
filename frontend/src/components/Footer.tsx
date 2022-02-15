import React from 'react'
import Button from '@mui/material/Button';
import backendAxios from '../helpers/axios'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {resetCheckedRows} from '../../store/reducers/tableReducer'
import { useSnackbar } from 'notistack';
function Footer() {
    const checkedRows = useAppSelector(state => state.tables.checkedRows)
    const dispatch = useAppDispatch()
    const { enqueueSnackbar } = useSnackbar();
    const onClick = async () => {
        if (checkedRows.length > 0) {
            const data = {"product_ids": checkedRows}
            console.log(data)
            try {
                const res = await backendAxios.post('check_start/', data)
                console.log(res)
                dispatch(resetCheckedRows())
                enqueueSnackbar('チェックの開始に成功しました。', { variant: "success" });
            } catch (err) {
                console.log(err)
                enqueueSnackbar('チェックの開始に失敗しました。', { variant: "error" });
            }
        } else {
            enqueueSnackbar('チェックする商品を選択してください。', { variant: "error" });
        }
    }
    const buttons = () => {
        const pathname = window.location.pathname
        switch(pathname) {
            case "/products":
                return <Button variant="contained" onClick={onClick}>チェック開始</Button>
            default:
                return 
        }
    }
    return (
        <div style={{textAlign: "center"}}>
            {buttons()}
        </div>
    )
}

export default Footer
