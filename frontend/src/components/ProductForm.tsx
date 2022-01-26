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
    genres: GenreType[],
    row: ProductType | null
}
function ProductForm(props:Props) {
    const title = props.mode==="edit"?"調査対象編集":"調査対象登録"
    const [trademarks, setTrademarks] = useState<string[]>([])
    const formModalProps = {open: props.open, setOpen: props.setOpen, title}
    const {row, mode} = props
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const { data: session } = useSession()
    useEffect(() => {
        if (row !== null) {
            setTrademarks(row.trademarks)
            setValue('name', row.name, { shouldValidate: true })
            setValue('memo', row.memo)
            setValue('genre', row.genre)
            setValue('product_condition', row.product_condition)
        }
    }, [row])
    const onSubmit = async (data:any) => {
        data.trademark_names = trademarks
        data.user = session?.user?.id
        console.log(data)
        try {
            if (mode==="create") {
                const res = await backendAxios.post('/api/v1/product/', data)
            } else {
                const res = await backendAxios.put(`/api/v1/product/${row?.id}/`, data)
            }
            props.setOpen("")
        } catch(err) {
            console.log(err)
        }
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
                defaultValue={row!==null?row.product_condition:""}
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
                defaultValue={row!==null?row.genre:""}
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
            <Button variant="outlined" onClick={() => props.setOpen('')}>キャンセル</Button>
            <Button variant="contained" type="submit">保存する</Button>
            </div>

            </form>
        </FormModal>
    )
}

export default ProductForm
