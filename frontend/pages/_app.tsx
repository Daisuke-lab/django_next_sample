import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '../src/components/Layout'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react'
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import CircularProgress from '@mui/material/CircularProgress';
import Amplify from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import {AmplifyProvider} from "@aws-amplify/ui-react";
import { useRouter } from 'next/router'



export default function App({
  Component,
  pageProps: { session, ...pageProps },
 }:AppProps) {
  return (
    <AmplifyProvider>
    <SessionProvider session={session}>
        <Layout>
        <Auth>
          <Component {...pageProps} />
        </Auth>
        </Layout>
    </SessionProvider>
    </AmplifyProvider>
  )
 }


 function Auth({ children }:any) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  const [noAuth, setNoAuth] = useState<boolean>(false)
  const noAuthPages = ["/"]
  const router = useRouter()
  useEffect(() => {
    const isNoAuth = noAuthPages.includes(window.location.pathname)
    setNoAuth(isNoAuth)
    if (status === "loading") return // Do nothing while loading
    if (!isUser &&!isNoAuth) return signIn() // If not authenticated, force log in
    if (noAuth && isUser) {router.push('/products')}
  }, [isUser, status])


  if (isUser || noAuth) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div style={{textAlign: "center", marginTop: "100px"}}>
          <CircularProgress color="secondary" style={{width: "70px", height: "70px"}}/>
          </div>
}

