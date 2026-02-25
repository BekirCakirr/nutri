import { useCallback, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { Upload, X, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  maxSize?: number
  onUpload: (files: File[]) => void
  multiple?: boolean
  className?: string
}

export function FileUpload({
  accept,
  maxSize = 5 * 1024 * 1024,
  onUpload,
  multiple = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const valid: File[] = []
      for (const file of files) {
        if (file.size > maxSize) {
          setError(
            `${file.name} dosyası çok büyük. Maksimum ${Math.round(maxSize / 1024 / 1024)}MB.`,
          )
          continue
        }
        valid.push(file)
      }
      return valid
    },
    [maxSize],
  )

  const handleFiles = useCallback(
    (files: File[]) => {
      setError(null)
      const valid = validateFiles(files)
      if (valid.length > 0) {
        setSelectedFiles(valid)
        onUpload(valid)
      }
    },
    [validateFiles, onUpload],
  )

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(multiple ? files : files.slice(0, 1))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    handleFiles(files)
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Dosyaları sürükleyin veya{' '}
          <label className="cursor-pointer font-medium text-primary hover:underline">
            seçin
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleInputChange}
              className="hidden"
            />
          </label>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Maks. {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="space-y-1">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-md border px-3 py-2"
            >
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)}KB
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
