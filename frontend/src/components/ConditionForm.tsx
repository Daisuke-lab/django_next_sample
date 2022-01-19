import React, {useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {FormProps as Props} from '../GlobalType'
import FormModal from './FormModal'
import { useForm, Controller } from "react-hook-form";
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import CustomField from './CustomField'
import Button from '@mui/material/Button';
import TagsInput from './TagsInput'
import NgWordConditionsField from './NgWordConditionsField'
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

export interface NgKeywordConditionType {
    ngKeyword: string,
    compositeKeyword: string,
    frontCheckWordCount: number,
    backCheckWordCount: number,
    checkTargetPeirod: number,
    periodUnit: "days" | "months" | "years"
}

function ConditionForm(props:Props) {
    const title = props.mode==="edit"?"チェック条件編集":"チェック条件登録"
    const formModalProps = {open: props.open, setOpen: props.setOpen, title}
    const { register, handleSubmit, control, formState:{ errors } } = useForm();
    const [ngKeywords, setNgKeywords] = useState<string[]>([])
    const [ngKewwordsError, setNgKeywordError] = useState<string>("")
    const onSubmit = (data:any) => {
        if (ngKeywords.length > 0) {
            console.log(data)
        } else {
            setNgKeywordError('この項目は必須です。')
        }
    }

    const checkKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') e.preventDefault();
      };

    return (
        <FormModal {...formModalProps}>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <CustomField label="タイトル" mandatory={true}>
            <FormControl error={errors.title?true:false}>
                <Input {...register('title',{
                    required: true
                  })} className="form-modal-field"/>
                <FormHelperText>{errors.title?"この項目は必須です。":""}</FormHelperText>
            </FormControl>
            </CustomField>
            <CustomField label="NGキーワード" mandatory={true}>
                <TagsInput
                items={ngKeywords}
                setItems={setNgKeywords}
                register={register}
                errors={errors}
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
            <Button variant="outlined" onClick={() => props.setOpen('')}>キャンセル</Button>
            <Button variant="contained" type="submit">保存する</Button>
            </div>

            </form>
        </FormModal>
    )
}

export default ConditionForm
