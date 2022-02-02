import React from 'react'
import Button from '@mui/material/Button';
import backendAxios from '../helpers/axios'
interface Props {
    selected: readonly number[]
}
function Footer(props:Props) {

    const onClick = async () => {
        const data = {"product_ids": props.selected}
        console.log(data)
        try {
            const res = await backendAxios.post('check_start/', data)
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }
    const buttons = () => {
        const pathname = window.location.pathname
        switch(pathname) {
            case "/products":
                console.log('you are here')
                return <Button variant="contained" onClick={onClick}>チェック開始</Button>
            default:
                return 
        }
    }
    return (
        <div style={{textAlign: "center"}}>
            {buttons()}
        </div>
    )
}

export default Footer
