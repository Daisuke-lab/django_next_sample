import React from 'react'
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
interface Props extends FormProps{
    productConditions: any[],
    genres: GenreType[]
}
function ProductForm(props:Props) {
    const title = props.mode==="edit"?"調査対象編集":"調査対象登録"
    const formModalProps = {open: props.open, setOpen: props.setOpen, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const onSubmit = async (data:any) => {
        console.log(data)
        try {
            const res = await backendAxios.post('/api/v1/product/', data)
            console.log(res)
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
                renderInput={(params) => <TextField {...params} label="選択してください"
                variant="standard" {...register('product_condition',{
                    required: true
                  })} />}
                />
                <FormHelperText>{errors.product_condition?"この項目は必須です。":""}</FormHelperText>
                </FormControl>
            </CustomField>
            <CustomField label="商標KW" mandatory={true}>
            <FormControl error={errors.trademark?true:false}>
                <Input {...register('trademark',{
                    required: true
                  })} className="form-modal-field"/>
            <FormHelperText>{errors.trademark?"この項目は必須です。":""}</FormHelperText>
            </FormControl>
            </CustomField>
            <CustomField label="ジャンル" mandatory={true}>
            <FormControl error={errors.genre?true:false}>
            <Autocomplete
                className="form-modal-field"
                options={props.genres.map((option) => option.name)}
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
