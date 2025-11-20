
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { sdk } from '@farcaster/miniapp-sdk'

const FarcasterToastManager = dynamic(() => import('./FarcasterToastManager'), {
ssr: false,
loading: () => null
})

const FarcasterManifestSigner = dynamic(() => import('./FarcasterManifestSigner'), {
ssr: false,
loading: () => null
})

interface FarcasterWrapperProps {
children: React.ReactNode
}

export default function FarcasterWrapper({ children }: FarcasterWrapperProps): JSX.Element {
const [isMounted, setIsMounted] = useState(false)
const router = useRouter()

useEffect(() => {
setIsMounted(true)

const redirectIfMiniApp = async () => {  
  try {  
    const inMiniApp = await sdk.isInMiniApp()  
    if (inMiniApp && window.location.pathname !== '/mint') {  
      router.replace('/mint')  
    }  
  } catch (err) {  
    console.error('Error detecting Farcaster Mini App:', err)  
  }  
}  

redirectIfMiniApp()

}, [router])

if (!isMounted) {
return <>{children}</>
}

return (
<FarcasterToastManager>
{({ onManifestSuccess, onManifestError }) => (
<>
<FarcasterManifestSigner  
onSuccess={onManifestSuccess}  
onError={onManifestError}  
/>
{children}
</>
)}
</FarcasterToastManager>
)
}
