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
import { useSelector, useDispatch } from 'react-redux'
import {addRow, closeForm, insertRows} from '../../store/reducers/tableReducer'

function ResultForm(props:FormProps) {
    const title = "チェック結果を絞り込む"
    const {open} = props
    const formModalProps = {open, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const dispatch = useDispatch()
    const onSubmit = async (data:any) => {
        const query = convertObjectToQuery(data)
        try {
            const res = await backendAxios.get(`api/v1/result/product${query}`)
            const newRows = res.data
            dispatch(insertRows(newRows))
            dispatch(closeForm())
        } catch(err) {
            console.log(err)
        }
    }

    const handleChange = (newValue: Date | null, type: string) => {
        if (type === "start") {
            setStartDate(newValue)
            setValue("created_at__gt", newValue)
        } else {
            setEndDate(newValue)
            setValue("created_at__lt", newValue)
        }
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
            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={() => dispatch(closeForm())}>キャンセル</Button>
            <Button variant="contained" type="submit">絞り込む</Button>
            </div>
            </form>
        </FormModal>
    )
}

export default ResultForm
