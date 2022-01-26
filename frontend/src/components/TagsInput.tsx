import React, {useState} from 'react'
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller } from "react-hook-form";

interface Props {
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    register: any,
    control: any,
    error: any,
    name:string

}
function TagsInput(props:Props) {
    const {items, setItems, register, error, control, name} = props
    const [input, setInput] = useState<string>("")
    const handleDelete = (item:string) => () => {
        const newItems = [...items];
        newItems.splice(newItems.indexOf(item), 1);
        setItems(newItems)
      };

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        if (e.keyCode === 13 && target.value !== "") {
            // エンターキー押下時の処理
            if (!items.includes(target.value)) {
                console.log(target.value);
                const newItem = target.value as string
                setItems([...items, newItem])
            }
            setInput('')
            }
    }

    const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(event.target.value);
    }


    return (
        <FormControl error={error?true:false}>
            <Controller
                control={control}
                rules={{
                validate: {
                    itemsRequired: () => items.length > 0
                }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextField
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={input}
            className="form-modal-field"
            multiline={true}
            InputProps={{
                startAdornment: items.map((item, index) => (
                  <Chip
                    key={`item-${index}`}
                    tabIndex={-1}
                    label={item}
                    onDelete={handleDelete(item)}
                    style={{margin: "3px"}}
                  />
                )),
                style: {flexWrap: "wrap"}
                }}
            />
                )}
                name={name}
            />
            <FormHelperText>{error?"この項目は必須です。":""}</FormHelperText>
        </FormControl>
    )
}

export default TagsInput
