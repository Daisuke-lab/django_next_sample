import React from 'react'
import FormControl, { useFormControl } from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import styles from "../../styles/CustomField.module.css"
import Chip from '@mui/material/Chip';
import { useForm, Controller } from "react-hook-form";
import { ComponentPropsToStylePropsMapKeys } from '@aws-amplify/ui-react';

interface Props {
    mandatory: boolean,
    label: string,
    children: any,
}
function CustomField(props:Props) {
    return (
            <div className={styles.inputContainer}>
                <InputLabel>{props.label}</InputLabel>
                {props.mandatory?<Chip color="error" size="small" label="必須" className={styles.essentialChip}/>:<></>}
                {props.children}
            </div>
    )
}

export default CustomField
