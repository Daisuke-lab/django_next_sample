import React, {useState, useEffect} from 'react'
import FormModal from './FormModal'
import { useForm, Controller,useWatch } from "react-hook-form";
import Input from '@mui/material/Input';
import CustomField from './CustomField'
import Button from '@mui/material/Button';
import styles from '../../styles/ProductForm.module.css'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {FormProps} from '../GlobalType'
import {GenreType} from '../GlobalType'
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import backendAxios from '../helpers/axios'
import TagsInput from './TagsInput'
import { useSession} from "next-auth/react"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AnyRecord } from 'dns';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {addRow, closeForm, insertRows} from '../../store/reducers/tableReducer'

export interface  TrademarkType {
    id: number,
    name: string
}

export interface DomainType {
    id: number,
    domain: string,
    _type: number,
    trademark: number,
    created_at: Date,
    updated_at: Date,
    trademark_data: TrademarkType
}


interface Props extends FormProps{
    trademarks: TrademarkType[]
}


function DomainForm(props:Props) {
    const {open} = props
    const mode = useAppSelector(state => state.tables.mode)
    const rows = useAppSelector(state => state.tables.rows)
    const currentRow = useAppSelector(state => state.tables.currentRow)
    const dispatch = useAppDispatch()
    const title = mode==="edit"?"ドメイン編集":"ドメイン登録"
    const formModalProps = {open: props.open, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const domain = useWatch({
        control,
        name: "domain"
      });
    useEffect(() => {
        console.log(domain)
        const newDomain = domain.replace('https://', '').replace('http://', '').split('/')[0]
        setValue("domain", newDomain)
    }, [domain])
    const [type, setType] = useState<1 | 2>(1)
    const [trademark, setTrademark] = useState<number>(0)

    useEffect(() => {
        if (currentRow !== null) {
            setTrademark(currentRow.trademark)
            setType(currentRow._type as 1 | 2)
            setValue('domain', currentRow.domain, { shouldValidate: true })

        }
    }, [currentRow])


    const onSubmit = async (data:any) => {
        console.log(data)
        data._type = type
        data.trademark = trademark
        try {
            if (mode === "new") {
                const res = await backendAxios.post('/api/v1/domain/', data)
                const newRow = res.data
                dispatch(addRow(newRow))
            } else {
                const res = await backendAxios.put(`/api/v1/domain/${currentRow?.id}/`, data)
                const newRow = res.data
                const filteredRows = rows.filter((row:any) => row !== currentRow)
                const newRows = [...filteredRows, newRow]
                dispatch(insertRows(newRows))
            }
            dispatch(closeForm())
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (event: SelectChangeEvent) => {
        let newValue:number = parseInt(event.target.value)
        newValue = [1,2].includes(newValue)?newValue:1
        setType(newValue as 1 | 2);
      };

    const onTrademarkChange = (event:React.SyntheticEvent<Element, Event>, value:TrademarkType | null) => {
        setTrademark(value !== null?value.id:1)
    }
    return (
        <FormModal {...formModalProps}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <CustomField label="ドメイン" mandatory={true}>
            <FormControl error={errors.domain?true:false}>
                <Input {...register('domain',{
                    required: true
                  })} className="form-modal-field"/>
                  <FormHelperText>{errors.domain?"この項目は必須です。":""}</FormHelperText>
                  </FormControl>
            </CustomField>
            <CustomField label="商標KW" mandatory={true}>
                <FormControl error={errors.trademark?true:false}>
                <Autocomplete
                    className="form-modal-field"
                    options={props.trademarks}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => onTrademarkChange(event, value)}
                    defaultValue={currentRow!==null?currentRow.trademark_data:null}
                    renderInput={(params) => <TextField {...params} label="選択してください"
                    variant="standard" {...register('trademark',{
                        required: true
                    })} />}
                    />
                  <FormHelperText>{errors.trademark?"この項目は必須です。":""}</FormHelperText>
                  </FormControl>
            </CustomField>

            <CustomField label="登録種類" mandatory={true}>
                <FormControl error={errors._type?true:false}>
                <Select
                        className="form-modal-field"
                        value={type.toString()}
                        label="登録種類"
                        onChange={handleChange}
                        >
                        <MenuItem value={1}>除外</MenuItem>
                        <MenuItem value={2}>必須</MenuItem>
                </Select>
                  </FormControl>
            </CustomField>

            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={() => dispatch(closeForm())}>キャンセル</Button>
            <Button variant="contained" type="submit">保存する</Button>
            </div>

            </form>
        </FormModal>
    )
}

export default DomainForm
