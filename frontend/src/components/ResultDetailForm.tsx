import React, {useState, useEffect} from 'react'
import backendAxios from '../helpers/axios'
import { useForm, Controller } from "react-hook-form";
import CustomField from './CustomField'
import FormModal from './FormModal'
import {FormProps} from '../GlobalType'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Button from '@mui/material/Button';
import styles from '../../styles/ResultForm.module.css'
import {convertObjectToQuery} from '../../src/helpers/convertObjectToQuery'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router'

interface Props extends FormProps {
    results: any[],
    setResults: React.Dispatch<React.SetStateAction<any[]>>
}
function ResultDetailForm(props:Props) {
    const title = "チェック結果詳細を絞り込む"
    const {results, setResults, setOpen} = props
    const formModalProps = {open: props.open, setOpen: props.setOpen, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const [priorities, setPriorities] = useState<number[]>([])
    const [confirmeds, setConfirmeds] = useState<boolean[]>([])
    useEffect(() => {
        setPriorities([])
        setConfirmeds([])
    }, [results])
    const router = useRouter()
    const { id:productId } = router.query
    const onPriorityChange = (event: React.ChangeEvent<HTMLInputElement>, priority:number) => {

        if (event.target.checked && !priorities.includes(priority)) {
            setPriorities([...priorities, priority])
            setValue("priority", [...priorities, priority])
        }
        if (!event.target.checked && priorities.includes(priority)) {
            const newPriorities = priorities.filter((currentPriority) => currentPriority != priority)
            setPriorities(newPriorities)
            setValue("priority", newPriorities)
        }
      }
      
    const onConfirmedChange = (event: React.ChangeEvent<HTMLInputElement>, confirmed:boolean) => {

        if (event.target.checked && !confirmeds.includes(confirmed)) {
            setConfirmeds([...confirmeds, confirmed])
            setValue("confirmed", [...confirmeds, confirmed])
        }
        if (!event.target.checked && confirmeds.includes(confirmed)) {
            const newConfirmeds = confirmeds.filter((currentConfirmed) => currentConfirmed != confirmed)
            setConfirmeds(newConfirmeds)
            setValue("priority", newConfirmeds)
        }
      }
    const onSubmit = async (data) => {
        console.log(data)
        const query = convertObjectToQuery(data) + `&product_id=${productId}`
        console.log(query)
        try {
            const res = await backendAxios.get(`api/v1/result/list${query}`)
            setResults(res.data)
            setOpen('')
            setPriorities([])
            setConfirmeds([])
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <FormModal {...formModalProps}>
            <form  onSubmit={handleSubmit(onSubmit)}>
                <CustomField label="優先度" mandatory={false}>
                <FormControl style={{flexDirection: "row"}}>
                <FormControlLabel control={<Checkbox />} label="高"
                checked={priorities.includes(1)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onPriorityChange(event, 1)}/>
                <FormControlLabel control={<Checkbox />} label="中" 
                checked={priorities.includes(2)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onPriorityChange(event, 2)}/>
                <FormControlLabel control={<Checkbox />} label="低" 
                checked={priorities.includes(3)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onPriorityChange(event, 3)}/>
                <FormControlLabel control={<Checkbox />} label="判定中" 
                checked={priorities.includes(4)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onPriorityChange(event, 4)}/>
                </FormControl>
                </CustomField>

                
                <CustomField label="確認状況" mandatory={false}>
                <FormControl style={{flexDirection: "row"}}>
                <FormControlLabel control={<Checkbox />} label="確認済み" 
                checked={confirmeds.includes(true)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onConfirmedChange(event, true)}/>
                <FormControlLabel control={<Checkbox />} label="未確認" 
                checked={confirmeds.includes(false)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onConfirmedChange(event, false)}/>
                </FormControl>
                </CustomField>
                

                <CustomField label="ドメイン" mandatory={false}>
                <Input {...register('domain')}/>
                </CustomField>

                    <div className="form-modal-button-container">
                    <Button variant="outlined" onClick={() => props.setOpen('')}>キャンセル</Button>
                    <Button variant="contained" type="submit">絞り込む</Button>
                    </div>
            </form>
        </FormModal>
    )
}

export default ResultDetailForm
