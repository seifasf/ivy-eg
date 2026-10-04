// Shrinks photos in the browser before upload so a 5MB phone picture uploads as a few
// hundred KB. The server still does the final resize/convert; this only saves upload time.
const MAX_DIMENSION = 2000
const SKIP_BELOW_BYTES = 400 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const loadBitmap = async (file) => {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Fall back to <img> decoding (handles HEIC on Safari)
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality))

export const prepareImage = async (file) => {
  if (ACCEPTED_TYPES.includes(file.type) && file.size <= SKIP_BELOW_BYTES) return file

  let source
  try {
    source = await loadBitmap(file)
  } catch {
    if (ACCEPTED_TYPES.includes(file.type)) return file
    throw new Error(`"${file.name}" can't be read. Please use a JPG, PNG or WebP image.`)
  }

  const width = source.width
  const height = source.height
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)

  // Safari can't encode WebP and silently returns PNG, so fall back to JPEG
  let blob = await canvasToBlob(canvas, 'image/webp', 0.88)
  let ext = 'webp'
  if (!blob || blob.type !== 'image/webp') {
    // JPEG has no transparency; paint white behind transparent PNGs
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    blob = await canvasToBlob(canvas, 'image/jpeg', 0.88)
    ext = 'jpg'
  }
  source.close?.()
  if (!blob) throw new Error(`"${file.name}" could not be processed`)

  if (ACCEPTED_TYPES.includes(file.type) && blob.size >= file.size) return file

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}.${ext}`, { type: blob.type })
}
