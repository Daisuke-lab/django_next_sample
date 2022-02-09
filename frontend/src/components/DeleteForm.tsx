import React, {useState} from 'react'
import FormModal from './FormModal'
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import backendAxios from '../helpers/axios'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {closeForm, deleteRow, changeCurrentRow, insertRows} from '../../store/reducers/tableReducer'

interface Props {
    open: boolean,
    title:string | undefined,
    endpoint: string
}
function DeleteForm(props:Props) {
    const title = props.title!==undefined?`${props.title}の削除`:"削除"
    const formModalProps = {open: props.open, title}
    const [input, setInput] = useState<string>('')
    const dispatch = useAppDispatch()
    const currentRow = useAppSelector(state => state.tables.currentRow)
    const rows = useAppSelector(state => state.tables.rows)
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const onClick = async () => {
        try {
            const res = await backendAxios.delete(props.endpoint)
            const newRows = rows.filter((row:any) => row !== currentRow)
            dispatch(insertRows(newRows))
            dispatch(changeCurrentRow(null))
            dispatch(closeForm())
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <FormModal {...formModalProps}>
            <p>{title}をする場合は以下に「delete me」と入力して下さい。</p>
            <div style={{textAlign: "center"}}>
            <Input placeholder="delete me" onChange={onChange}/>
            </div>
            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={() => dispatch(closeForm())}>キャンセル</Button>
            <Button variant="contained" color="error" disabled={input!=="delete me"}
            onClick={onClick}>削除する</Button>
            </div>
        </FormModal>
    )
}

export default DeleteForm
