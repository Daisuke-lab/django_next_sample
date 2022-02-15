import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/MyPage.module.css'
import background from '../public/medicine_robo.png'
import LoginButton from '../src/components/LoginButton'
import { Footer } from '../src/ui-components';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';

const MyPage: NextPage = () => {
  return (
    <div>
            <div className="container">
                <div className="banner">
                    <img src={profile.banner}></img>
                </div>
                <div className="personal-icon">
                    <img className="icon" src={profile.icon}/>
                    <p>{profile.last_name} {profile.first_name}</p>
                    <p>@{profile.last_name}{profile.first_name}{profile.id}</p>
                </div>
                <div className="follow-button" style={{margin: "10px"}}>
                <Button variant="contained" style={{float: "right"}} href={`/profiles/edit/${profileId}`}>編集</Button>
                </div>
            </div>
            <div className="description">
                <p>
                    {profile.introduction}
                </p>
                <p style={{display: "flex"}}>
                    <span>
                        <LocationOnIcon/>
                        Seattle, WA
                    </span>
                    <span>
                        <LinkIcon/>
                        <a href="#">test</a>
                    </span>
                    <span>
                        <DateRangeIcon/>
                        2009年6月からTwitterを利用しています
                    </span>
                </p>
                <p>
                    <span>342 フォロー中</span>
                    <span>5,628万 フォロワー</span>
                </p>
            </div>
            <CustomTabs/>
        </div>
  )
}
export default MyPage