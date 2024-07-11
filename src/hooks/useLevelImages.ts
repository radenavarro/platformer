import { useEffect, useRef, useState } from 'react'

export const useLevelImages = ({ levelMap }) => {
  const imagesRef = useRef<Record<string, HTMLImageElement[]>>({})
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (levelMap) {
      loadAllImages(levelMap)
    }
  }, [levelMap])

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const loadAllImages = async (lvlmap) => {
    try {
      // console.log(lvlmap)
      const loadedImages: Record<string, HTMLImageElement[]> = {}
      for (const [key, value] of Object.entries(lvlmap)) {
        for (const [subkey, subvalue] of Object.entries(value)) {
          if (subkey === 'src') {
            loadedImages[key] = await Promise.resolve(loadImage(subvalue))
          }
        }
      }
      imagesRef.current = loadedImages
      setImagesLoaded(true)
    } catch (error) {
      console.log(error)
      console.error('Failed to load one or more images', error)
    }
  }

  return { imagesRef, imagesLoaded }
}
