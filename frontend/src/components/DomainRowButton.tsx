import React from 'react';
import ColorButton from './ColorButton';
import { red, blue, teal } from '@mui/material/colors';
import { useSelector, useDispatch } from 'react-redux'
import {changeMode, changeOpendForm, changeCurrentRow} from '../../store/reducers/tableReducer'

interface Props {
    row: any
}
function DomainRowButton(props:Props) {
    const {row} = props
    const dispatch = useDispatch()
    const onEdit = (row:any) => {
        dispatch(changeMode('edit'))
        dispatch(changeOpendForm('DomainForm'))
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
   <ColorButton color={red} label="削除"
   onClick={() => onDelete(row)}/>
  </div>)
}

export default DomainRowButton;
