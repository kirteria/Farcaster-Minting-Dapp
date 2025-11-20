## 🚀 Farcaster Minting Dapp

A simple NFT minting dApp designed for **Farcaster Miniapps / Frames**, allowing users to mint NFTs directly inside Warpcast or any Farcaster client.

Supports:
- **Base Mainnet**
- **Base Sepolia Testnet**

---

## 📦 Features

- Simple minting dapp
- Mint NFTs directly inside Farcaster  
- Fully client-side mint flow  
- Wagmi + Farcaster Miniapp connector  
- Auto wallet detection  
- Supports Base & Base Sepolia  
- Uses IPFS metadata (matching CID from smart contract)  

---

## ⚙️ Update (`.env.local`)

Create `.env.local` in your project root:

```
NEXT_PUBLIC_NFT_NAME=Your nft name
NEXT_PUBLIC_CONTRACT_ADDRESS=Your contract address
NEXT_PUBLIC_CHAIN_ID=8543 or 85432

# RPC for Base or Base Sepolia
NEXT_PUBLIC_RPC_URL=https://base-sepolia-rpc.publicnode.com
# or:
# NEXT_PUBLIC_RPC_URL=https://base-rpc.publicnode.com

# MUST match your NFT metadata CID used in contract
NEXT_PUBLIC_NFT_CID=Your IPFS CID

# App URLs
NEXT_PUBLIC_APP_URL=https://your-app-url.com
NEXT_PUBLIC_FARCASTER_APP_URL=https://farcaster.xyz/miniapps/YOUR_ID/YOUR_SLUG

# External links
NEXT_PUBLIC_X_URL=https://x.com
NEXT_PUBLIC_FARCASTER_URL=https://warpcast.com
NEXT_PUBLIC_OPENSEA_URL=https://opensea.io
```

---

## 🔄 Switching testnet & mainnet

### `wagmi.ts` 

Default (Base Sepolia):

```ts
import { baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [farcasterMiniApp()],
  multiInjectedProviderDiscovery: false,
  transports: {
    [baseSepolia.id]: http(RPC_URL),
  },
  ssr: true,
})
```

### To use Base Mainnet:

1. Import Base  
2. Replace chain everywhere  

```ts
import { base } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [farcasterMiniApp()],
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: http(RPC_URL),
  },
  ssr: true,
})
```

---

## 🧩 Update `layout.tsx` Metadata

```ts
export const metadata: Metadata = {
  title: "Your app name",
  description: "Your app description",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://your-image-url",
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          name: "Your app name",
          url: "https://your-app-url",
          splashImageUrl: "https://your-splash-image-url",
          splashBackgroundColor: "#ffffff",
        }
      }
    })
  }
};

```

---

## 📄 Update `farcaster.json`

```
{
  "accountAssociation": {
    "header": "Get from farcaster-dev tool",
    "payload": "",
    "signature": ""
  },
  "miniapp": {
    "version": "1",
    "subtitle": "Your shorten description",
    "description": "Your app description",
    "name": "Your app name",
    "iconUrl": "Your app icon url",
    "homeUrl": "Your app url",
    "imageUrl": "Your image url",
    "buttonTitle": "Open App",
    "splashImageUrl": "Your splash image url",
    "splashBackgroundColor": "#ffffff",
    "tags": [
      "base"
    ],
    "primaryCategory": "utility",
    "ogTitle": "Your app OG title",
    "ogImageUrl": "Your OG url"
  },
  "baseBuilder": {
    "allowedAddresses": [
      "Your Base address"
    ]
  }
}
```

---

## ▶️ Run Locally

```
npm install
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 📤 Deploy to Vercel

1. Push project to GitHub  
2. Import into Vercel  
3. Add `.env.local` variables  
4. Deploy  
5. Copy deployed URL → update your Farcaster metadata 

---

## 🧪 Beta Notice

This app is still in **beta / experimental stage** and will continue improving.

Follow me on Farcaster
👉 https://farcaster.xyz/weak
