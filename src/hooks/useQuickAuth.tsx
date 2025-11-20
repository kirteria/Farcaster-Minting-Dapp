import { sdk } from '@farcaster/miniapp-sdk'  
import { useEffect, useRef, useState } from 'react'  
import { useConnect, useAccount } from 'wagmi'  
  
interface UserData {  
  fid: number  
  displayName: string  
  username: string  
  pfpUrl?: string  
  primaryAddress?: string  
}  
  
interface QuickAuthResult {  
  userData: UserData | null  
  isAuthenticated: boolean  
}  
  
export function useQuickAuth(isInFarcaster: boolean): QuickAuthResult {  
  const hasAuthenticated = useRef(false)  
  const [userData, setUserData] = useState<UserData | null>(null)  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)  
  const { connect, connectors } = useConnect()  
  const { isConnected } = useAccount()  
  
  useEffect(() => {  
    const authenticateUser = async (): Promise<void> => {  
      try {  
        if (!isInFarcaster) return  
          
        if (hasAuthenticated.current) return  
        hasAuthenticated.current = true  
          
        const response: Response = await sdk.quickAuth.fetch('/api/me')  
          
        if (response.ok) {  
          const data: UserData = await response.json()  
          setUserData(data)  
          setIsAuthenticated(true)  
            
          console.log('Quick Auth successful:', data)  
  
          if (!isConnected) {  
            const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK')  
            if (coinbaseConnector) {  
              setTimeout(() => {  
                connect({ connector: coinbaseConnector })  
              }, 1000)  
            }  
          }  
        }  
      } catch (error) {  
        console.error('Quick Auth error:', error)  
      }  
    }  
  
    authenticateUser()  
  }, [isInFarcaster, connect, connectors, isConnected])  
  
  return { userData, isAuthenticated }  
}
