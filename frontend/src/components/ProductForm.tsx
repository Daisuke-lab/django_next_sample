import React from 'react'
import FormModal from './FormModal'
import { useForm, Controller } from "react-hook-form";
import Input from '@mui/material/Input';
import CustomField from './CustomField'
import Button from '@mui/material/Button';
import styles from '../../styles/ProductForm.module.css'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {FormProps as Props} from '../GlobalType'

function ProductForm(props:Props) {
    const title = props.mode==="edit"?"調査対象編集":"調査対象登録"
    const formModalProps = {open: props.open, setOpen: props.setOpen, title}
    const { register, handleSubmit, control } = useForm();
    const onSubmit = (data:any) => {console.log(data)}
    const options = [
        { label: 'The Godfather', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
      ];
    return (
        <FormModal {...formModalProps}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <CustomField label="商品名" mandatory={true}>
                <Input {...register('name')} className="form-modal-field"/>
            </CustomField>
            <CustomField label="チェック条件" mandatory={false}>
            <Autocomplete
                className="form-modal-field"
                options={options.map((option) => option.label)}
                renderInput={(params) => <TextField {...params} label="選択してください"
                variant="standard" {...register('conditions')} />}
                />
            </CustomField>
            <CustomField label="商標KW" mandatory={false}>
                <Input {...register('trademark')} className="form-modal-field"/>
            </CustomField>
            <CustomField label="ジャンル" mandatory={false}>
            <Autocomplete
                className="form-modal-field"
                options={options.map((option) => option.label)}
                renderInput={(params) => <TextField {...params} label="選択してください"
                variant="standard" {...register('genre')} />}
                />
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
