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
import { useSession} from "next-auth/react"
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {addRow, closeForm, insertRows, changeCurrentPage, insertRowsCount, changeEndpoint} from '../../store/reducers/tableReducer'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';


function ResultDetailForm(props:FormProps) {
    const title = "チェック結果詳細を絞り込む"
    const formModalProps = {open: props.open, title}
    const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
    const [priorities, setPriorities] = useState<number[]>([])
    const [confirmeds, setConfirmeds] = useState<boolean[]>([])
    const [order, setOrder] = useState<string>("created_at")
    const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc")
    const dispatch = useAppDispatch()
    const { data: session } = useSession()
    console.log(session)
    const userId = session?.id

    useEffect(() => {
        setPriorities([])
        setConfirmeds([])
    }, [])
    const router = useRouter()
    const { id:productId } = router.query
    const onPriorityChange = (checked: boolean, priority:number) => {

        if (checked && !priorities.includes(priority)) {
            setPriorities([...priorities, priority])
            setValue("priority", [...priorities, priority])
        }
        if (!checked && priorities.includes(priority)) {
            const newPriorities = priorities.filter((currentPriority) => currentPriority != priority)
            setPriorities(newPriorities)
            setValue("priority", newPriorities)
        }
      }
      
    const onConfirmedChange = (checked: boolean, confirmed:boolean) => {

        if (checked && !confirmeds.includes(confirmed)) {
            setConfirmeds([...confirmeds, confirmed])
            setValue("confirmed", [...confirmeds, confirmed])
        }
        if (!checked && confirmeds.includes(confirmed)) {
            const newConfirmeds = confirmeds.filter((currentConfirmed) => currentConfirmed != confirmed)
            setConfirmeds(newConfirmeds)
            setValue("priority", newConfirmeds)
        }
      }
    const onSubmit = async (data:any) => {
        const ordering = orderBy==="asc"?""  + order:"-" + order
        data.ordering = ordering
        const query = convertObjectToQuery(data) + `&product_id=${productId}&user=${userId}`
        try {
            const endpoint = `api/v1/result/list${query}`
            const res = await backendAxios.get(endpoint)
            const newRows = res.data.results
            const rowsCount = res.data.count
            console.log(newRows)
            dispatch(insertRows(newRows))
            dispatch(changeCurrentPage(1))
            dispatch(insertRowsCount(rowsCount))
            dispatch(changeEndpoint(endpoint))
            dispatch(closeForm())
            setPriorities([])
            setConfirmeds([])
        } catch(err) {
            console.log(err)
        }
    }
    const handleOrderChange = (event: SelectChangeEvent) => {
        setOrder(event.target.value as string);
      };
    const handleOrderByChange = (event: SelectChangeEvent) => {
        setOrderBy(event.target.value as "asc" | "desc");
      };

    return (
        <FormModal {...formModalProps}>
            <form  onSubmit={handleSubmit(onSubmit)}>
                <CustomField label="優先度" mandatory={false}>
                <FormControl style={{flexDirection: "row"}}>
                <FormControlLabel control={<Checkbox />} label="高"
                checked={priorities.includes(1)}
                onChange={(event:any, checked:boolean)  => onPriorityChange(checked, 1)}/>
                <FormControlLabel control={<Checkbox />} label="中" 
                checked={priorities.includes(2)}
                onChange={(event:any, checked:boolean)  => onPriorityChange(checked, 2)}/>
                <FormControlLabel control={<Checkbox />} label="低" 
                checked={priorities.includes(3)}
                onChange={(event:any, checked:boolean)  => onPriorityChange(checked, 3)}/>
                <FormControlLabel control={<Checkbox />} label="判定中" 
                checked={priorities.includes(4)}
                onChange={(event:any, checked:boolean)  => onPriorityChange(checked, 4)}/>
                </FormControl>
                </CustomField>

                
                <CustomField label="確認状況" mandatory={false}>
                <FormControl style={{flexDirection: "row"}}>
                <FormControlLabel control={<Checkbox />} label="確認済み" 
                checked={confirmeds.includes(true)}
                onChange={(event:any, checked:boolean) => onConfirmedChange(checked, true)}/>
                <FormControlLabel control={<Checkbox />} label="未確認" 
                checked={confirmeds.includes(false)}
                onChange={(event:any, checked:boolean) => onConfirmedChange(checked, false)}/>
                </FormControl>
                </CustomField>
                

                <CustomField label="ドメイン" mandatory={false}>
                <Input {...register('domain')}/>
                </CustomField>

                <div  className={styles.datepickersContainer}>
            <FormControl>
                <InputLabel id="demo-simple-select-label">並べ替え</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={order}
                label="並べ替え"
                onChange={handleOrderChange}
                >
                <MenuItem value="created_at">チェック結果作成日</MenuItem>
                <MenuItem value="url__domain__domain">ドメイン</MenuItem>
                <MenuItem value="url__url">URL</MenuItem>
                <MenuItem value="priority">優先度</MenuItem>
                <MenuItem value="confirmed">確認状況</MenuItem>
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel id="demo-simple-select-label">順序</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderBy}
                label="順序"
                onChange={handleOrderByChange}
                >
                <MenuItem value="asc">昇順</MenuItem>
                <MenuItem value="desc">降順</MenuItem>
                </Select>
            </FormControl>
            </div>

                    <div className="form-modal-button-container">
                    <Button variant="outlined" onClick={() => dispatch(closeForm())}>キャンセル</Button>
                    <Button variant="contained" type="submit">絞り込む</Button>
                    </div>
            </form>
        </FormModal>
    )
}

export default ResultDetailForm
