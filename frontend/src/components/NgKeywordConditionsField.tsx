import React, {useState, useEffect} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import {NgKeywordConditionType} from './ConditionForm'
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from '../../styles/NgKeywordConditionsField.module.css'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

interface Props {
    ngKeywords: string[],
    control: any,
    register: any,
    errors: {
        [x: string]: any;
    }
}
function NgWordConditionsField(props:Props) {
    const {ngKeywords, control, register, errors} = props
    const { fields, append,  remove } = useFieldArray({
        control,
        name: "ng_keyword_conditions"
      });

    // useEffect(() => {
    //     remove(0)
    // }, [])


    const onAdd = () => {
        const newNgKeywordCondition = {
            ng_keyword: "全体",
            composite_keyword: "",
            front_check_word_count: 0,
            back_check_word_count: 0,
            check_target_period: 0,
            period_unit: 1
        } as NgKeywordConditionType
        append(newNgKeywordCondition)
    }
    const onDelete = (index:number) => {
        remove(index);
    }
    console.log(fields)
    return (
        <>
        <div style={{width: "350px"}}>
        {fields.map((ngKeywordCondition, index) => (
            <div key={ngKeywordCondition.id} className={styles.fieldsContainer}>
            <FormControl error={errors.ng_keyword_conditions?.[index]?.ng_keyword?true:false}>
            <Autocomplete
                className="form-modal-field"
                options={["全体", ...ngKeywords]}
                defaultValue="全体"
                renderInput={(params) => <TextField {...params} label="NGキーワード"
                {...register(`ng_keyword_conditions.${index}.ng_keyword`,{
                    required: true
                  })}
                variant="standard"/>}
                />
            <FormHelperText>{errors.ng_keyword_conditions?.[index]?.ng_keyword?"この項目は必須です。":""}</FormHelperText>
            </FormControl>
            <FormControl error={errors.ng_keyword_conditions?.[index]?.composite_keyword?true:false}>
            <TextField
                label="複合キーワード"
                variant="standard"
                className="form-modal-field"
                {...register(`ng_keyword_conditions.${index}.composite_keyword`, {
                    required: true
                  })}
                />
            <FormHelperText>{errors.ng_keyword_conditions?.[index]?.composite_keyword?"この項目は必須です。":""}</FormHelperText>
            </FormControl>

            <FormControl error={errors.ng_keyword_conditions?.[index]?.front_check_word_count?true:false}>
                <Controller control={control} name={`ng_keyword_conditions.${index}.front_check_word_count`}
                 render={({ field }) => ( 
                <TextField {...field} label="チェック文字数（前）"
                className="form-modal-field"
                InputProps={{
                    endAdornment: <InputAdornment position="end">文字以内</InputAdornment>,
                }}
                type="number"
                variant="standard" /> 
                )} />
                <FormHelperText>{errors.ng_keyword_conditions?.[index]?.front_check_word_count?"1以上を入力して下さい。":""}</FormHelperText>
            </FormControl>
            <FormControl error={errors.ng_keyword_conditions?.[index]?.back_check_word_count?true:false}>
            <Controller control={control} name={`ng_keyword_conditions.${index}.back_check_word_count`}
                 render={({ field }) => ( 
                <TextField {...field} label="チェック文字数（後）"
                className="form-modal-field"
                InputProps={{
                    endAdornment: <InputAdornment position="end">文字以内</InputAdornment>,
                }}
                type="number"
                variant="standard" /> 
                )} />
                <FormHelperText>{errors.ng_keyword_conditions?.[index]?.back_check_word_count?"1以上を入力して下さい。":""}</FormHelperText>
            </FormControl>

            <FormControl error={errors.ng_keyword_conditions?.[index]?.check_target_peirod?true:false}>
                <Controller control={control} name={`ng_keyword_conditions.${index}.check_targe_period`}
                 render={({ field }) => ( 
                    <TextField
                    className="form-modal-field"
                    label="チェック対象期間"
                    type="number"

                    variant="standard"
                    {...field}
                    />
                )} />
                <FormHelperText>{errors.ng_keyword_conditions?.[index]?.check_target_period?"1以上を入力して下さい。":""}</FormHelperText>
            </FormControl>
            <IconButton onClick={() => onDelete(index)}>
                <CancelIcon/>
            </IconButton>
            </div>
        ))}
        <div style={{textAlign: "center"}}>
        <IconButton onClick={onAdd}>
            <AddCircleIcon/>
        </IconButton>
        </div>
        </div>
        </>
    )
}

export default NgWordConditionsField
