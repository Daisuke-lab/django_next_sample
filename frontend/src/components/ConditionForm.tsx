import React, {useState, useEffect, KeyboardEventHandler} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {FormProps} from '../GlobalType'
import FormModal from './FormModal'
import { useForm, Controller } from "react-hook-form";
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import CustomField from './CustomField'
import Button from '@mui/material/Button';
import TagsInput from './TagsInput'
import NgWordConditionsField from './NgKeywordConditionsField'
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import backendAxios from '../helpers/axios'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {addRow, closeForm, insertRows} from '../../store/reducers/tableReducer'
import { useSession} from "next-auth/react"
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export interface NgKeywordConditionType {
    id?: any
    ng_keyword: string,
    composite_keyword: string,
    front_check_word_count: number,
    back_check_word_count: number
}

export interface ProductConditionType {
    title : string,
    id: number,
    check_target_period: number,
    period_unit: 1 | 2 | 3
    ng_keywords: string[]
    ng_keyword_conditions: {
        ng_keyword: string,
        composite_keyword: string,
        front_check_word_count: number,
        back_check_word_count: number
    }[]
}


function ConditionForm(props:FormProps) {
    const mode = useAppSelector(state => state.tables.mode)
    const modeJapanese = mode==="edit"?"編集":"作成"
    const dispatch = useAppDispatch()
    const rows = useAppSelector(state => state.tables.rows)
    const currentRow = useAppSelector(state => state.tables.currentRow)
    const title = `チェック条件${modeJapanese}`
    const formModalProps = {open: props.open, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const [ngKeywords, setNgKeywords] = useState<string[]>([])
    const [generalError, setGeneralError] = useState<string>("")
    const { data: session } = useSession()
    useEffect(() => {
        if (currentRow !== null) {
            console.log(currentRow)
            setNgKeywords(currentRow.ng_keywords)
            setValue('title', currentRow.title, { shouldValidate: true })
            setValue('check_target_period', currentRow.check_target_period, { shouldValidate: true })
            setValue('period_unit', currentRow.period_unit, { shouldValidate: true })
            //setValue('ng_keyword_conditions', currentRow.ng_keyword_conditions)
        } else {
            setNgKeywords([])
            setValue('title', "")
            setValue('ng_keyword_conditions', [])
            setValue("period_unit", 1)
            setValue("check_target_period", "")
        }
        setGeneralError("")
    }, [currentRow])
    const onSubmit = async (data:any) => {
        data.ng_keywords = ngKeywords
        data.user = session?.id
        console.log(data)
        try {
            if (mode === "new") {
                const res = await backendAxios.post(`api/v1/condition/`, data)
                console.log(res)
                const newRow = res.data
                dispatch(addRow(newRow))
            } else {
                const res = await backendAxios.put(`api/v1/condition/${currentRow?.id}/`, data)
                console.log(res)
                const newRow = res.data
                const filteredRows = rows.filter((row:any) => row !== currentRow)
                const newRows = [...filteredRows, newRow]
                dispatch(insertRows(newRows))
            }
            dispatch(closeForm())
        } catch (err:any) {
            const errorMessages = err?.response?.data
            if(errorMessages?.title !== undefined) {
                setGeneralError('同じタイトルのチェック条件が既に存在しています。')
            }
            
        }

    }

    const checkKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') event.preventDefault();
      }

    return (
        <FormModal {...formModalProps}>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={checkKeyDown as KeyboardEventHandler}>
            <CustomField label="タイトル" mandatory={true}>
            <FormControl error={errors.title?true:false}>
                <Input {...register('title',{
                    required: true
                  })}
                  className="form-modal-field"/>
                <FormHelperText>{errors.title?"この項目は必須です。":""}</FormHelperText>
            </FormControl>
            </CustomField>
            <CustomField label="NGキーワード" mandatory={true}>
                <TagsInput
                items={ngKeywords}
                setItems={setNgKeywords}
                register={register}
                error={errors.ng_keywords}
                name="ng_keywords"
                control={control}
                />
            </CustomField>
            <CustomField label="チェック対象期間" mandatory={false}>
            <FormControl error={errors.check_target_peirod?true:false}>
                <Controller control={control} name={`check_target_period`}
                 render={({ field }) => ( 
                    <TextField
                    className="form-modal-field"
                    label=""
                    type="number"
                    InputProps={{
                        endAdornment: (
                            <Controller control={control} name={`period_unit`}
                     render={({ field }) => ( 
                        <Select {...field} defaultValue="1">
                        <MenuItem value="1">日以内</MenuItem>
                        <MenuItem value="2">カ月以内</MenuItem>
                        <MenuItem value="3">年以内</MenuItem>
                        </Select>
                    )} />),
                    }}
                    variant="standard"
                    {...field}
                    />
                )} />
                <FormHelperText>{errors.check_target_period?"1以上を入力して下さい。":""}</FormHelperText>
            </FormControl>
            </CustomField>
            <CustomField label="複合チェックキーワード" mandatory={false}>
                <NgWordConditionsField
                ngKeywords={ngKeywords}
                control={control}
                register={register}
                errors={errors}
                />
            </CustomField>

            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={() => dispatch(closeForm())}>キャンセル</Button>
            <Button variant="contained" type="submit">保存する</Button>
            </div>
            </form>
            {generalError.length > 0?
            <Alert severity="error" style={{margin: "10px"}}>
                <AlertTitle>チェック条件の{modeJapanese}に失敗しました。</AlertTitle>
                <strong>{generalError}</strong>
            </Alert>:
            <></>
            }
        </FormModal>
    )
}

export default ConditionForm
