import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import background from '../public/medicine_robo.png'
import LoginButton from '../src/components/LoginButton'
import { Footer } from '../src/ui-components';


const Home: NextPage = () => {
  return (
    <div>
      <Image
        src={background}
        layout="fill"
        objectFit="cover"
        alt="yakuji-background"
        //
      />
    </div>
  )
}
export default Home
