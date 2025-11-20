'use client'  
  
import { useManifestStatus } from '@/hooks/useManifestStatus'  
import { useRef, useEffect } from 'react'  
  
interface ManifestResult {  
  header: string  
  payload: string  
  signature: string  
}  
  
interface FarcasterToastManagerProps {  
  children: (handlers: {  
    onManifestSuccess: (result: ManifestResult) => void  
    onManifestError: (errorMessage: string, errorType: string) => void  
  }) => React.ReactNode  
}  
  
export default function FarcasterToastManager({ children }: FarcasterToastManagerProps): JSX.Element {  
  const { refetch } = useManifestStatus()  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)  
    
  useEffect(() => {  
    return () => {  
      if (timeoutRef.current) {  
        clearTimeout(timeoutRef.current)  
      }  
    }  
  }, [])  
  
  const handleManifestSuccess = (result: ManifestResult): void => {  
    refetch()  
    console.log('Manifest signed successfully:', result)  
  }  
  
  const handleManifestError = (errorMessage: string, errorType: string): void => {  
    console.error('Manifest signing failed:', errorType, errorMessage)  
  }  
  
  return (  
    <>  
      {children({  
        onManifestSuccess: handleManifestSuccess,  
        onManifestError: handleManifestError,  
      })}  
    </>  
  )  
}  
  
export type { ManifestResult }
