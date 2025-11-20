'use client'

import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useIsManifestSigned } from '@/hooks/useManifestStatus'

export interface ManifestResult {
  header: string
  payload: string
  signature: string
}

interface FarcasterAutoManifestSignerProps {
  onSuccess?: (result: ManifestResult) => void
  onError?: (errorMessage: string, errorType: string) => void
}

export default function FarcasterManifestSigner({
  onSuccess,
  onError
}: FarcasterAutoManifestSignerProps): null {
  const [isProcessing, setIsProcessing] = useState(false)
  const { isSigned: isAlreadySigned, isLoading: isCheckingSignedStatus } =
    useIsManifestSigned()

  const domain =
    typeof window !== 'undefined' ? window.location.origin : 'unknown-domain'

  useEffect(() => {
    const autoSign = async () => {
      try {
        if (isCheckingSignedStatus) return

        const inMiniApp = await sdk.isInMiniApp()
        if (inMiniApp && !isAlreadySigned && !isProcessing) {
          setIsProcessing(true)
          try {
            const result = await sdk.experimental.signManifest({ domain })
            if (onSuccess) onSuccess(result)
          } catch (err: unknown) {
            let message = 'Unknown error'
            let type = 'unknown'
            if (err instanceof Error) {
              message = err.message
              if (message.toLowerCase().includes('rejected')) type = 'user_rejected'
              else if (message.toLowerCase().includes('invalid')) type = 'invalid_domain'
              else type = 'generic_error'
            }
            if (onError) onError(message, type)
          } finally {
            setIsProcessing(false)
          }
        }
      } catch (err) {
        console.error('Error checking Mini App context:', err)
      }
    }

    autoSign()
  }, [isAlreadySigned, isCheckingSignedStatus])

  return null // <- no UI rendered
}
