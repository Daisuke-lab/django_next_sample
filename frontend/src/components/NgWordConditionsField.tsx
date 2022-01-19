import React, {useState} from 'react'
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
import { useForm, useFieldArray } from "react-hook-form";
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
        name: "ngKeywordConditions"
      });


    const onAdd = () => {
        const newNgKeywordCondition = {
            ngKeyword: "全体",
            compositeKeyword: "",
            frontCheckWordCount: 0,
            backCheckWordCount: 0,
            checkTargetPeirod: 0,
            periodUnit: "days"
        } as NgKeywordConditionType
        append(newNgKeywordCondition)
    }
    const onDelete = (index:number) => {
        remove(index);
    }
    return (
        <>
        <div style={{width: "350px"}}>
        {fields.map((ngKeywordCondition, index) => (
            <div key={ngKeywordCondition.id} className={styles.fieldsContainer}>
            <FormControl error={errors.ngKeywordConditions?.[index]?.ngKeyword?true:false}>
            <Autocomplete
                className="form-modal-field"
                options={["全体", ...ngKeywords]}
                defaultValue="全体"
                renderInput={(params) => <TextField {...params} label="NGキーワード"
                {...register(`ngKeywordConditions.${index}.ngKeyword`,{
                    required: true
                  })}
                variant="standard"/>}
                />
            <FormHelperText>{errors.ngKeywordConditions?.[index]?.ngKeyword?"この項目は必須です。":""}</FormHelperText>
            </FormControl>
            <FormControl error={errors.ngKeywordConditions?.[index]?.compositeKeyword?true:false}>
            <TextField
                label="複合キーワード"
                variant="standard"
                className="form-modal-field"
                {...register(`ngKeywordConditions.${index}.compositeKeyword`, {
                    required: true
                  })}
                />
            <FormHelperText>{errors.ngKeywordConditions?.[index]?.compositeKeyword?"この項目は必須です。":""}</FormHelperText>
            </FormControl>
            <FormControl error={errors.ngKeywordConditions?.[index]?.frontCheckWordCount?true:false}>
            <TextField
                label="チェック文字数（前）"
                className="form-modal-field"
                InputProps={{
                    endAdornment: <InputAdornment position="end">文字以内</InputAdornment>,
                }}
                type="number"
                variant="standard"
                {...register(`ngKeywordConditions.${index}.frontCheckWordCount`, {
                    min: 1,
                    required: true
                  })}
                />
                <FormHelperText>{errors.ngKeywordConditions?.[index]?.frontCheckWordCount?"1以上を入力して下さい。":""}</FormHelperText>
            </FormControl>
            <FormControl error={errors.ngKeywordConditions?.[index]?.backCheckWordCount?true:false}>
                <TextField
                className="form-modal-field"
                label="チェック文字数（後）"
                InputProps={{
                    endAdornment: <InputAdornment position="end">文字以内</InputAdornment>,
                }}
                type="number"
                variant="standard"
                {...register(`ngKeywordConditions.${index}.backCheckWordCount`, {
                    min: 1,
                    required: true
                  })}
                />
                <FormHelperText>{errors.ngKeywordConditions?.[index]?.backCheckWordCount?"1以上を入力して下さい。":""}</FormHelperText>
                </FormControl>
                <FormControl error={errors.ngKeywordConditions?.[index]?.checkTargetPeirod?true:false}>
                <TextField
                className="form-modal-field"
                label="チェック対象期間"
                InputProps={{
                    endAdornment: (<Select
                    {...register(`ngKeywordConditions.${index}.periodUnit`)}
                    defaultValue="days">
                                        <MenuItem value="days">日以内</MenuItem>
                                        <MenuItem value="month">月以内</MenuItem>
                                        <MenuItem value="year">年以内</MenuItem>
                                    </Select>),
                }}
                type="number"
                variant="standard"
                {...register(`ngKeywordConditions.${index}.checkTargetPeirod`, {
                    min: 1,
                    required: true
                  })}
                />
                <FormHelperText>{errors.ngKeywordConditions?.[index]?.checkTargetPeirod?"1以上を入力して下さい。":""}</FormHelperText>
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
