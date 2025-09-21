import React from 'react'
import {useDropzone} from 'react-dropzone'
import type { ImageItem } from '../types'
import { Button } from './ui/button'

type Props = {
  images: ImageItem[]
  setImages: (imgs: ImageItem[]) => void
  setError: (err: string | null) => void
}

export default function DropzoneUpload({ images, setImages, setError }: Props) {
  const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections?.length) {
      setError("Some files were rejected. Only images are allowed.")
    }
    let current = [...images]
    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.')
        continue
      }
      if (current.length >= 4) {
        setError('You can upload up to 4 images.')
        break
      }
      const id = crypto.randomUUID()
      const url = URL.createObjectURL(file)
      current.push({ id, file, url, name: file.name })
    }
    setImages(current)
  }, [images, setImages, setError])

  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 4,
    noClick: true,
    noKeyboard: true
  })

  function remove(id: string) {
    const found = images.find(x => x.id === id)
    if (found) URL.revokeObjectURL(found.url)
    setImages(images.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Upload Images (max 4)</h3>
          <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG. Drag & drop supported.</p>
        </div>
        <Button onClick={open}>Choose Files</Button>
      </div>

      <div {...getRootProps()} className={`rounded-xl border border-dashed p-6 ${isDragActive ? 'bg-muted/50' : 'bg-card'}`}>
        <input {...getInputProps()} />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? "Drop the images here…" : "Drag & drop images here, or use the button above."}
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, idx) => (
            <div key={img.id} className="relative rounded-lg border overflow-hidden">
              <img src={img.url} alt={img.name} className="w-full h-40 object-cover" />
              <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-0.5 rounded-md">#{idx+1}</span>
              <button onClick={() => remove(img.id)} className="absolute top-2 right-2 text-xs bg-black/60 border border-border px-2 py-1 rounded-md">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
