import type { NextPage } from 'next'
import { useEffect } from 'react';
import Image from 'next/image'
import Button from '@mui/material/Button';
import { useSession,getSession } from "next-auth/react"
import defaultBanner from '../../public/default_banner.png'
import styles from '../../styles/MyPage.module.css'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CampaignIcon from '@mui/icons-material/Campaign';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";
import backendAxios from '../../src/helpers/axios';
import { useRouter } from 'next/router'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { updatePgId } from '../../store/reducers/userReducer';

const MyPageEdit: NextPage = () => {
const { register, handleSubmit, control, formState:{ errors }, setValue } = useForm();
const { data: session } = useSession()
const router = useRouter()
const dispatch = useAppDispatch()
const pgId = useAppSelector(state => state.users.pg_id)

useEffect(() => {
    if (pgId !== null) {
        setValue('pg_id', pgId)
    }
}, [])



const onSubmit = async (data:any) => {
    console.log(data)
    try {
        const res = await backendAxios.put(`api/v1/user/${session?.id}/`, data)
        console.log(res)
        dispatch(updatePgId(res.data.pg_id))
        router.push("/mypage")
    } catch(err) {
        console.log(err)
    }
}

  return (
    <div className={styles.cardContainer} style={{marginTop: "30px"}}>
     <Card sx={{ minWidth: 275 }}>
         <form  onSubmit={handleSubmit(onSubmit)}>
      <CardContent>
        <Typography variant="h5" component="div">
          ユーザー情報の編集
        </Typography>
        <Typography variant="body2">
        <TextField id="standard-basic" label="プログラムID" variant="standard" 
        type="number"
        {...register('pg_id',{
            required: true
          })}/>
        </Typography>
      </CardContent>
      <CardActions style={{justifyContent:"right"}}>
        <Button size="small" variant="contained" type="submit">保存</Button>
      </CardActions>
      </form>
    </Card>
    </div>
  )
}
export default MyPageEdit