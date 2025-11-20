'use client'  
  
import type { ReactNode } from 'react'  
import { WagmiProvider } from 'wagmi'  
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'  
import { wagmiConfig } from '@/config/wagmi'  
  
const queryClient = new QueryClient()  
  
interface ProvidersProps {  
  children: ReactNode  
}  
  
export function Providers({ children }: ProvidersProps): JSX.Element {  
  return (  
    <WagmiProvider config={wagmiConfig}>  
      <QueryClientProvider client={queryClient}>  
        {children}  
      </QueryClientProvider>  
    </WagmiProvider>  
  )  
}
