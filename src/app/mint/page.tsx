'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Minus, Plus } from 'lucide-react'
import { useContractData } from '@/hooks/useContractData'
import { useMint } from '@/hooks/useMint'
import { NFTImageSlider } from '@/components/NFTImageSlider'
import { sdk } from '@farcaster/miniapp-sdk'
import { notFound } from 'next/navigation'

export default function MintPage() {
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'failed'>('idle')
  const [isInFarcaster, setIsInFarcaster] = useState<boolean | null>(null)

  const { address, isConnected } = useAccount()

  const {
    totalSupply,
    maxSupply,
    userBalance,
    maxMintPerAddress,
    mintingEnabled,
    loading,
    mintPrice,
    refetch
  } = useContractData(address)

  const { mintNFT } = useMint()

  const remainingMints = Math.max((maxMintPerAddress || 0) - (userBalance || 0), 0)
  const maxQuantity = remainingMints
  const isSoldOut = totalSupply >= maxSupply
  const progressPercentage = (totalSupply / maxSupply) * 100
  const formatEth = (v: number) => parseFloat(v.toFixed(7)).toString()
  const reset = () => setTimeout(() => setStatus('idle'), 1000)

  useEffect(() => {
    sdk.isInMiniApp()
      .then(inApp => setIsInFarcaster(inApp))
      .catch(() => setIsInFarcaster(false))
  }, [])

  if (isInFarcaster === false) {
    notFound()
  }

  if (isInFarcaster === null) return null

  const handleMint = async () => {
    if (!isConnected || !mintPrice) return

    try {
      setStatus('pending')
      const mintedIds = await mintNFT(quantity, mintPrice)

      if (!mintedIds || mintedIds.length === 0) {
        setStatus('failed')
        reset()
        return
      }

      setStatus('confirming')

      const lastTokenId = mintedIds[mintedIds.length - 1]
      const cid = process.env.NEXT_PUBLIC_NFT_CID!
      const appUrl = process.env.NEXT_PUBLIC_APP_URL!
      const collectionName = process.env.NEXT_PUBLIC_NFT_NAME!
      const nftImageUrl = `https://ipfs.io/ipfs/${cid}/${lastTokenId}.png`

      await sdk.actions.composeCast({
        text: `Just minted ${collectionName} #${lastTokenId}! 🔥\n${appUrl}`,
        embeds: [nftImageUrl]
      })

      setStatus('idle')
      await refetch()
    } catch {
      setStatus('failed')
      reset()
    }
  }

  const getButtonText = () => {
    if (status === 'pending') return 'Confirm Transaction'
    if (status === 'confirming') return 'Casting'
    if (status === 'success') return 'Mint Successfully'
    if (status === 'failed') return 'Mint Rejected'
    if (loading) return 'Loading'
    if (isSoldOut) return 'Minted Out'
    if (!mintingEnabled) return 'Mint Disabled'
    if (remainingMints <= 0) return 'Max Mint Reached'
    return 'Mint'
  }

  const disabled =
    !isConnected ||
    loading ||
    isSoldOut ||
    !mintingEnabled ||
    status === 'pending' ||
    status === 'confirming' ||
    remainingMints <= 0

  const xUrl = process.env.NEXT_PUBLIC_X_URL
  const farcasterUrl = process.env.NEXT_PUBLIC_FARCASTER_URL
  const openseaUrl = process.env.NEXT_PUBLIC_OPENSEA_URL

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-10 px-4"
      style={{ background: 'linear-gradient(to bottom, #3B82F6, #F0F9FF)' }}
    >
      <div className="fixed top-6 right-4 flex gap-3 z-50">
        {xUrl && <a href={xUrl} target="_blank"><img src="/x.png" className="w-8 h-8 object-contain" /></a>}
        {farcasterUrl && <a href={farcasterUrl} target="_blank"><img src="/farcaster.png" className="w-8 h-8 object-contain" /></a>}
        {openseaUrl && <a href={openseaUrl} target="_blank"><img src="/opensea.png" className="w-8 h-8 object-contain" /></a>}
      </div>

      <div className="w-full max-w-md mx-auto mb-4 mt-16">
        <NFTImageSlider className="w-full aspect-square" />
      </div>

      <div className="w-full max-w-md mx-auto mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-bold text-white">Minted</span>
          <span className="font-semibold text-white">{loading ? '...' : `${totalSupply}/${maxSupply}`}</span>
        </div>
        <Progress value={progressPercentage} className="h-2 rounded-full" />
      </div>

      {!loading && mintPrice && (
        <p className="text-3xl font-bold text-center mb-3 text-white">
          {formatEth(Number(mintPrice) * quantity)} ETH
        </p>
      )}

      <div className="flex items-center justify-center gap-3 mb-4">
        <Button
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          disabled={quantity <= 1}
          className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="w-16 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">{quantity}</span>
        </div>
        <Button
          onClick={() => quantity < maxQuantity && setQuantity(quantity + 1)}
          disabled={quantity >= maxQuantity}
          className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Button
        onClick={handleMint}
        disabled={disabled}
        className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white h-15 text-xl font-semibold rounded-full shadow-xl disabled:opacity-50"
      >
        {getButtonText()}
      </Button>
    </div>
  )
}
