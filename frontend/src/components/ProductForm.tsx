import React, {useState, useEffect} from 'react'
import FormModal from './FormModal'
import { useForm, Controller } from "react-hook-form";
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
import { useSelector, useDispatch } from 'react-redux'
import {addRow, closeForm, insertRows} from '../../store/reducers/tableReducer'
import { removeBlank } from '../helpers/removeBlank';
export interface ProductType {
    id: number,
    user: string,
    memo?: string,
    name: string,
    product_condition: string,
    genre: string,
    trademarks : string[]
    created_at: Date,
    updated_at: Date
}

interface Props extends FormProps{
    productConditions: any[],
    genres: GenreType[]
}
function ProductForm(props:Props) {
    console.log(props)
    const dispatch = useDispatch()
    const mode = useSelector(state => state.tables.mode)
    const rows = useSelector(state => state.tables.rows)
    const currentRow = useSelector(state => state.tables.currentRow)
    const title = mode==="edit"?"調査対象編集":"調査対象登録"
    const [trademarks, setTrademarks] = useState<string[]>([])
    const formModalProps = {title, open: props.open}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const { data: session } = useSession()
    useEffect(() => {
        if (currentRow !== null) {
            setTrademarks(currentRow.trademarks)
            setValue('name', currentRow.name, { shouldValidate: true })
            setValue('memo', currentRow.memo)
            setValue('genre', currentRow.genre)
            setValue('product_condition', currentRow.product_condition)
        } else {
            setValue('name', "")
            setValue('memo', "")
            setValue('genre', "")
            setValue('product_condition', "")
        }
    }, [currentRow])
    const onSubmit = async (data:any) => {
        data.trademarks = trademarks
        data.user = session?.id
        removeBlank(data)
        console.log(data)
        try {
            if (mode==="new") {
                const res = await backendAxios.post('/api/v1/product/', data)
                const newRow = res.data
                dispatch(addRow(newRow))
            } else {
                const res = await backendAxios.put(`/api/v1/product/${currentRow?.id}/`, data)
                const newRow = res.data
                const filteredRows = rows.filter((row:any) => row !== currentRow)
                const newRows = [...filteredRows, newRow]
                dispatch(insertRows(newRows))
            }
            onClose()
        } catch(err) {
            console.log(err)
        }
    }

    const onClose = () => {
        setTrademarks([])
        dispatch(closeForm())
    }
    return (
        <FormModal {...formModalProps}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <CustomField label="商品名" mandatory={true}>
            <FormControl error={errors.name?true:false}>
                <Input {...register('name',{
                    required: true
                  })} className="form-modal-field"/>
                  <FormHelperText>{errors.name?"この項目は必須です。":""}</FormHelperText>
                  </FormControl>
            </CustomField>
            <CustomField label="チェック条件" mandatory={true}>
            <FormControl error={errors.product_condition?true:false}>
            <Autocomplete
                className="form-modal-field"
                options={props.productConditions.map((option) => option.title)}
                defaultValue={currentRow!==null?currentRow.product_condition:""}
                renderInput={(params) => <TextField {...params} label="選択してください"
                variant="standard" {...register('product_condition',{
                    required: true
                  })} />}
                />
                <FormHelperText>{errors.product_condition?"この項目は必須です。":""}</FormHelperText>
                </FormControl>
            </CustomField>
            <CustomField label="商標KW" mandatory={true}>
                    <TagsInput
                    items={trademarks}
                    setItems={setTrademarks}
                    register={register}
                    error={errors.trademarks}
                    name="trademarks"
                    control={control}
                    />
            </CustomField>
            <CustomField label="ジャンル" mandatory={true}>
            <FormControl error={errors.genre?true:false}>
            <Autocomplete
                className="form-modal-field"
                options={props.genres.map((option) => option.name)}
                defaultValue={currentRow!==null?currentRow.genre:""}
                renderInput={(params) => <TextField {...params} label="選択してください"
                variant="standard" {...register('genre',{
                    required: true
                  })} />}
                />
                <FormHelperText>{errors.genre?"この項目は必須です。":""}</FormHelperText>
                </FormControl>
            </CustomField>
            <CustomField label="メモ" mandatory={false}>
                <Input {...register('memo')} className="form-modal-field"/>
            </CustomField>

            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={onClose}>キャンセル</Button>
            <Button variant="contained" type="submit">保存する</Button>
            </div>

            </form>
        </FormModal>
    )
}

export default ProductForm
