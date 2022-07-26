import React from 'react';
import ColorButton from './ColorButton';
import { red, blue, teal } from '@mui/material/colors';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {changeMode, changeOpendForm, changeCurrentRow} from '../../store/reducers/tableReducer'

interface Props {
    row: any
}
function ConditionRowButton(props:Props) {
    const {row} = props
    const dispatch = useAppDispatch()
    const onEdit = (row:any) => {
        dispatch(changeMode('edit'))
        dispatch(changeOpendForm('ConditionForm'))
        dispatch(changeCurrentRow(row))
    }

    const onDuplicate = (row:any) => {
        dispatch(changeMode('new'))
        dispatch(changeOpendForm('ConditionForm'))
        dispatch(changeCurrentRow(row))
    }

    const onDelete = (row:any) => {
        dispatch(changeMode('delete'))
        dispatch(changeOpendForm('DeleteForm'))
        dispatch(changeCurrentRow(row))
    }

  return (
    <div className='table-button-container'>
    <ColorButton color={teal} label="編集"
     onClick={() => onEdit(row)}/>
     <ColorButton color={blue} label="複製"
     onClick={() => onDuplicate(row)}/>
     <ColorButton color={red} label="削除"
     onClick={() => onDelete(row)}/>
    </div>
  )
}

export default ConditionRowButton;
