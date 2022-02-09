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
import ConditionRowButton from './ConditionRowButton';

export interface NgKeywordConditionType {
    ng_keyword: string,
    composite_keyword: string,
    front_check_word_count: number,
    back_check_word_count: number,
    check_target_period: number,
    period_unit: 1 | 2 | 3
}

export interface ProductConditionType {
    title : string,
    id: number,
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
    useEffect(() => {
        if (currentRow !== null) {
            console.log(currentRow.ng_keywords)
            setNgKeywords(currentRow.ng_keywords)
            setValue('title', currentRow.title, { shouldValidate: true })
            //setValue('ng_keyword_conditions', currentRow.ng_keyword_conditions)
        } else {
            setNgKeywords([])
            setValue('title', "")
            setValue('ng_keyword_conditions', [])
        }
        setGeneralError("")
    }, [currentRow])
    const onSubmit = async (data:any) => {
        data["ng_keywords"] = ngKeywords
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
