import type { NextFetchEvent, NextRequest } from 'next/server'
import { getSession } from "next-auth/react"

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
}