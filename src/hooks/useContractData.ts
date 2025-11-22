'use client'

import { useState, useEffect, useCallback } from 'react'
import { CONTRACT_CONFIG } from '@/config/contract'
import { ethers } from 'ethers'

interface ContractData {
  mintPrice: string
  maxMintPerAddress: number
  totalSupply: number
  maxSupply: number
  mintingEnabled: boolean
  loading: boolean
  error: string | null
  userBalance: number
  refetch: () => void
}

export function useContractData(userAddress?: string): ContractData {
  const [data, setData] = useState<Omit<ContractData, 'refetch'>>({
    mintPrice: '0',
    maxMintPerAddress: 0,
    totalSupply: 0,
    maxSupply: 1000,
    mintingEnabled: false,
    loading: true,
    error: null,
    userBalance: 0
  })

  const fetchData = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl)

      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        provider
      )

      const [
        mintPriceRaw,
        maxMintPerAddressRaw,
        totalSupplyRaw,
        maxSupplyRaw,
        mintingEnabledRaw,
        userBalanceRaw
      ] = await Promise.all([
        contract.mintPrice(),
        contract.maxMintPerAddress(),
        contract.totalSupply(),
        contract.maxSupply(),
        contract.mintingEnabled(),
        userAddress ? contract.balanceOf(userAddress) : BigInt(0)
      ])

      const mintPrice = ethers.formatEther(mintPriceRaw)
      const maxMintPerAddress = Number(maxMintPerAddressRaw)
      const totalSupply = Number(totalSupplyRaw)
      const maxSupply = Number(maxSupplyRaw)
      const mintingEnabled = Boolean(mintingEnabledRaw)
      const userBalance = Number(userBalanceRaw)

      setData({
        mintPrice,
        maxMintPerAddress,
        totalSupply,
        maxSupply,
        mintingEnabled,
        loading: false,
        error: null,
        userBalance
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contract data'
      }))
    }
  }, [userAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...data, refetch: fetchData }
}
