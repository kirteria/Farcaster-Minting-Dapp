import { ethers } from 'ethers'

export const CONTRACT_CONFIG = {
  address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!) as `0x${string}`,
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  abi: [
    { inputs: [], name: 'mintPrice', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'maxMintPerAddress', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [], name: 'maxSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'pure', type: 'function' },
    { inputs: [], name: 'mintingEnabled', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'quantity', type: 'uint256' }], name: 'mint', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'payable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }], name: 'tokenURI', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },

    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'from', type: 'address' },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
      ],
      name: 'Transfer',
      type: 'event'
    }
  ]
} as const

export type ContractConfig = typeof CONTRACT_CONFIG
