'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_CONFIG } from '@/config/contract'
import { readContract } from '@wagmi/core'
import { wagmiConfig } from '@/config/wagmi'

interface MintResult {
  mintNFT: (quantity: number, mintPrice: string) => Promise<number[] | undefined>
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: Error | null
  transactionHash: string | undefined
  mintedIds: number[]
}

export function useMint(): MintResult {
  const { address } = useAccount()
  const [transactionHash, setTransactionHash] = useState<string | undefined>()
  const [error, setError] = useState<Error | null>(null)
  const [mintedIds, setMintedIds] = useState<number[]>([])

  const { writeContractAsync, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}` | undefined,
  })

  const mintNFT = async (quantity: number, mintPrice: string): Promise<number[] | undefined> => {
    if (!address) {
      setError(new Error('Wallet not connected'))
      return undefined
    }

    try {
      setError(null)

      const totalSupplyBefore = Number(
        await readContract(wagmiConfig, {
          address: CONTRACT_CONFIG.address,
          abi: CONTRACT_CONFIG.abi,
          functionName: 'totalSupply',
        })
      )

      const totalValue = parseEther((Number(mintPrice) * quantity).toString())

      const txHash: string = await writeContractAsync({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'mint',
        args: [BigInt(quantity)],
        value: totalValue,
      })
      setTransactionHash(txHash)

      const receiptTotalSupply = await new Promise<number>((resolve) => {
        const interval = setInterval(async () => {
          const now = Number(
            await readContract(wagmiConfig, {
              address: CONTRACT_CONFIG.address,
              abi: CONTRACT_CONFIG.abi,
              functionName: 'totalSupply',
            })
          )
          if (now >= totalSupplyBefore + quantity) {
            clearInterval(interval)
            resolve(now)
          }
        }, 1000)
      })

      const arr: number[] = []
      for (let i = totalSupplyBefore + 1; i <= receiptTotalSupply; i++) {
        arr.push(i)
      }

      setMintedIds(arr)
      return arr
    } catch (err) {
      const e = err as Error
      setError(e)
      console.error('Mint error:', e)
      return undefined
    }
  }

  return {
    mintNFT,
    isPending,
    isConfirming,
    isSuccess,
    error,
    transactionHash,
    mintedIds,
  }
}
