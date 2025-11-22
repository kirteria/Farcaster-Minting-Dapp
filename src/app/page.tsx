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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(to bottom, #3B82F6, #F0F9FF)' }}
    >
      <div className="max-w-sm w-full flex flex-col items-center text-center space-y-4">
        <div className="w-30 h-30 rounded-2xl overflow-hidden shadow-lg">
          <img src="/favicon.ico" alt="Logo" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#FFFFFF' }}>
            {nftName}
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#FFFFFF' }}>
            Farcaster client required
          </p>
        </div>

        <Button
          onClick={handleOpenApp}
          className="px-6 py-5 text-base sm:text-lg rounded-full shadow-lg w-full"
          style={{ backgroundColor: '#3B82F6', border: '1px solid #60A5FA', color: '#FFFFFF' }}
        >
          Visit Farcaster
        </Button>

        <p className="text-xs sm:text-sm" style={{ color: '#FFFFFF' }}>
          You need farcaster client to access this mini app
        </p>
      </div>
    </div>
  )
}
