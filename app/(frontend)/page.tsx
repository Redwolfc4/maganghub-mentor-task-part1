import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import { fileURLToPath } from 'node:url'

import config from '@/payload.config'
import './styles.css'
import Header from './component/Header'
/**
 * Home Page
 * 
 * The landing page of the application.
 * Displays a welcome message and a link to the products page.
 */
export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 justify-center">
      <Image src="/next.svg" alt="Next.js Logo" className="dark:invert dark:bg-white" width={180} height={37} priority />
      <Header>
        <h1 className='text-center mb-4 text-4xl font-semibold'>Welcome To The Jungle</h1>
      </Header>
      <a className='/products' href="/products">ke product</a>
    </div>
  )
}
