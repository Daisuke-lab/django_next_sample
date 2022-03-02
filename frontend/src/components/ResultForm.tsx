import React, {useState} from 'react'
import backendAxios from '../helpers/axios'
import { useForm, Controller } from "react-hook-form";
import CustomField from './CustomField'
import FormModal from './FormModal'
import {FormProps} from '../GlobalType'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Button from '@mui/material/Button';
import styles from '../../styles/ResultForm.module.css'
import {convertObjectToQuery} from '../../src/helpers/convertObjectToQuery'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {addRow, closeForm, insertRows, changeCurrentPage, insertRowsCount, changeEndpoint} from '../../store/reducers/tableReducer'
import { useSession} from "next-auth/react"
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

function ResultForm(props:FormProps) {
    const title = "チェック結果を絞り込む"
    const {open} = props
    const formModalProps = {open, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [order, setOrder] = useState<string>("created_at")
    const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc")
    const dispatch = useAppDispatch()
    const { data: session } = useSession()
    const userId = session?.id

    const onSubmit = async (data:any) => {
        const query = convertObjectToQuery(data)
        try {
            const endpoint = `api/v1/result/product${query}&user=${userId}`
            const res = await backendAxios.get(endpoint)
            const newRows = res.data.results
            const rowsCount = res.data.count
            console.log(res.data)
            dispatch(insertRows(newRows))
            dispatch(changeCurrentPage(1))
            dispatch(insertRowsCount(rowsCount))
            dispatch(changeEndpoint(endpoint))
            dispatch(closeForm())
        } catch(err) {
            console.log(err)
        }
    }

    const handleChange = (newValue: Date | null, type: string) => {
        if (type === "start") {
            setStartDate(newValue)
            if (newValue !== null) {
                setValue("latest_check_datetime__gte", newValue)
            }
        } else {
            setEndDate(newValue)
            if (newValue !== null) {
                const newDate = new Date(newValue.getTime());
                newDate.setDate(newDate.getDate() + 1)
                setValue("latest_check_datetime__lte", newDate)
            }
        }
      };
    const handleOrderChange = (event: SelectChangeEvent) => {
        setOrder(event.target.value as string);
      };
    return (
        <FormModal {...formModalProps}>
            <form  onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.datepickersContainer}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                label="開始日"
                inputFormat="MM/dd/yyyy"
                value={startDate}
                onChange={(newValue:Date | null) => handleChange(newValue, "start")}
                renderInput={(params:any) => <TextField {...params} />}
                />
                ～
                <DesktopDatePicker
                label="終了日"
                inputFormat="MM/dd/yyyy"
                value={endDate}
                onChange={(newValue:Date | null) => handleChange(newValue, "end")}
                renderInput={(params:any) => <TextField {...params} />}
                />
            </LocalizationProvider>
            </div>
            {/* <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={order}
                label="並べ替え"
                onChange={handleOrderChange}
                >
                <MenuItem value="name">商品名</MenuItem>
                <MenuItem value="trademarks">チェック日</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            </div> */}

            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={() => dispatch(closeForm())}>キャンセル</Button>
            <Button variant="contained" type="submit">絞り込む</Button>
            </div>
            </form>
        </FormModal>
    )
}

export default ResultForm
