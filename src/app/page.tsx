'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { sdk } from '@farcaster/miniapp-sdk'

export default function HomePage() {
  const nftName = process.env.NEXT_PUBLIC_NFT_NAME

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        if (document.readyState !== 'complete') {
          await new Promise<void>(resolve => {
            window.addEventListener('load', () => resolve(), { once: true })
          })
        }
        await sdk.actions.ready()
        console.log('Farcaster SDK initialized')
      } catch (err) {
        console.error('Farcaster SDK init failed', err)
      }
    }

    initFarcaster()
  }, [])

  const handleOpenApp = () => {
    window.location.href = process.env.NEXT_PUBLIC_FARCASTER_APP_URL!
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full flex flex-col items-center text-center space-y-4">
        <div className="w-30 h-30 rounded-2xl overflow-hidden shadow-lg">
          <img src="/favicon.ico" alt="Logo" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {nftName}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Farcaster client required
          </p>
        </div>

        <Button
          onClick={handleOpenApp}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-5 text-base sm:text-lg rounded-xl shadow-lg w-full"
        >
          Farcaster
        </Button>

        <p className="text-xs sm:text-sm text-gray-500">
          Open this mini app inside Farcaster or Base app.
        </p>
      </div>
    </div>
  )
}
