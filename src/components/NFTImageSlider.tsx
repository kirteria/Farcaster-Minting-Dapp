'use client'

import Image from 'next/image'

export function NFTImageSlider({ className = '' }) {
  return (
    <div
      className={`aspect-square bg-[#101010] rounded-2xl overflow-hidden relative ${className}`}
    >
      <Image
        src="/preview.gif"
        alt="nft"
        fill
        sizes="280px"
        className="object-cover absolute inset-0"
      />
    </div>
  )
}
