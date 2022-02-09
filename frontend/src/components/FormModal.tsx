import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import styles from '../../styles/FormModal.module.css'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {closeForm} from '../../store/reducers/tableReducer'
export interface FormColumnType {
    type: string,
    name: string,
    defaultValue?: string,
    label: string,
    required?: boolean
}

export interface FormType {
    title: string,
    mainButtonLabel: string
}


interface Props{
    open: boolean,
    children: any,
    title:string
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    maxHeight: "500px",
    overflowY: "scroll",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }  as const;
function FormModal(props:Props) {
  const dispatch = useAppDispatch()
    return (
        <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Box sx={style}>
            <div style={{position: "relative"}}>
            <IconButton className={styles.closeIcon} onClick={() => dispatch(closeForm())}>
              <CloseIcon/>
            </IconButton>
            <h1 className={styles.formTitle}>{props.title}</h1>
            {props.children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
    )
}


export default FormModal
