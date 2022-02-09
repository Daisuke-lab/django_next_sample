import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoginButton from './LoginButton'
import Divider from '@mui/material/Divider';
import styles from '../../styles/LoginModal.module.css'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: "17px",
  boxShadow: 24,
  p: 4,
};

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TransitionsModal(props:Props) {

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={() => props.setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              ログインする方法を選んでください。
            </Typography>
            <Divider/>
            <div className={styles.buttonContainer}>
              <LoginButton provider="google"/>
              <LoginButton provider="facebook"/>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}