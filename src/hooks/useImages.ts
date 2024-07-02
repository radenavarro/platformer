import { useEffect, useRef, useState } from 'react'

export const useImages = ({ spriteReference }) => {
  const imagesRef = useRef<Record<string, HTMLImageElement[]>>({})
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (spriteReference) {
      loadAllImages(spriteReference)
    }
  }, [spriteReference])

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const loadAllImages = async (spriteRef) => {
    try {
      const loadedImages: Record<string, HTMLImageElement[]> = {}
      for (const [key, value] of Object.entries(spriteRef.current)) {
        loadedImages[key] = await Promise.all(value.sprites.map(loadImage))
      }
      imagesRef.current = loadedImages
      setImagesLoaded(true)
    } catch (error) {
      console.error('Failed to load one or more images', error)
    }
  }

  return { imagesRef, imagesLoaded }
}
