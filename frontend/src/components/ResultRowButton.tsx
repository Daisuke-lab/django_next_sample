import React from 'react';
import ColorButton from './ColorButton';
import { red, blue, teal } from '@mui/material/colors';
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {changeMode, changeOpendForm, changeCurrentRow} from '../../store/reducers/tableReducer'
import { useRouter } from 'next/router'

interface Props {
    row: any
}

function ResultRowButton(props:Props) {
    const router = useRouter()
  return <div className='table-button-container'>
            <ColorButton color={blue} label="詳細"
            onClick={() => {router.push(`/results/${props.row.id}`)}}/>
            </div>;
}

export default ResultRowButton;
