import React, {useState} from 'react'
import FormModal from './FormModal'
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import backendAxios from '../helpers/axios'

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<string>>,
    title:string | undefined,
    endpoint: string
}
function DeleteForm(props:Props) {
    const title = props.title!==undefined?`${props.title}の削除`:"削除"
    const formModalProps = {open: props.open, setOpen: props.setOpen, title}
    const [input, setInput] = useState<string>('')

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const onClick = async () => {
        try {
            const res = await backendAxios.delete(props.endpoint)
            props.setOpen("")
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
            <Button variant="outlined" onClick={() => props.setOpen('')}>キャンセル</Button>
            <Button variant="contained" color="error" disabled={input!=="delete me"}
            onClick={onClick}>削除する</Button>
            </div>
        </FormModal>
    )
}

export default DeleteForm
