'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface NFTImageSliderProps {
  className?: string
}

export function NFTImageSlider({ className = '' }: NFTImageSliderProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const detectImages = async () => {
      const detected: string[] = []

      for (let i = 1; i <= 100; i++) {
        const imgPath = `/image/nft/${i}.png`

        try {
          const response = await fetch(imgPath, { method: 'HEAD' })
          if (response.ok) detected.push(imgPath)
          else break
        } catch {
          break
        }
      }

      setImages(detected)
    }

    detectImages()
  }, [])

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div
        className={`aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl ${className}`}
      />
    )
  }

  return (
    <div
      className={`aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl overflow-hidden shadow-xl relative ${className}`}
    >
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={img}
            alt=""
            fill
            className="object-cover"
            sizes="280px"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
