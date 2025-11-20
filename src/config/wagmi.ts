
'use client'

import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

export const wagmiConfig = createConfig({
chains: [baseSepolia],
connectors: [farcasterMiniApp()],
multiInjectedProviderDiscovery: false,
transports: {
[baseSepolia.id]: http(RPC_URL),
},
ssr: true,
})
