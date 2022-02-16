import type { NextPage } from 'next'
import Head from 'next/head'
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
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { useEffect } from 'react';
import backendAxios from '../../src/helpers/axios';
import { updatePgId } from '../../store/reducers/userReducer';
const MyPage: NextPage = () => {
    const { data: session, ...others } = useSession()
    const dispatch = useAppDispatch()
    const pgId = useAppSelector(state => state.users.pg_id)
    useEffect(() => {
      if (pgId === null) {
        getPgId()
      }
    }, [])
    const getPgId = async () => {
      try {
        const res = await backendAxios.get(`api/v1/user/${session?.id}`)
        dispatch(updatePgId(res.data.pg_id))
      } catch (err) {
        console.log(err)
      }
    }
  return (
    <div>
            <div className={styles.header}>
                <div  className={styles.banner}>
                <Image src={defaultBanner} layout="fill"/>
                </div>
                <div className={styles.personalIcon}>
                <img className={styles.icon} src={session?.user?.image !== null?session?.user?.image:undefined}/>
                    <p>{session?.user?.name}</p>
                    <p>{session?.user?.email}</p>
                </div>
                <div className="follow-button" style={{margin: "10px"}}>
                <Button variant="contained" style={{float: "right"}} href="mypage/edit">編集</Button>
                </div>
            </div>

            {pgId === null?
            <div className={styles.cardContainer}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div" textAlign="center" style={{color: "#fc4d4d"}}>
                  <CampaignIcon/>注意
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  右上の編集ボタンで必ずプログラムIDを入力して使用を開始するようにしてください。
                  入力されていない場合、結果が正しく表示されなくなる場合がございます。
                </Typography>
              </CardContent>
            </Card>
            </div>
            :<></>}

        </div>
  )
}
export default MyPage