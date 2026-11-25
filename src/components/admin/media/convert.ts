/**
 * Conversia în browser, la încărcare (ADR-004, ADR-005, D-07, D-24, D-27).
 * Rulează doar în panou, pe dispozitivul celui care încarcă. Bibliotecile mari
 * (heic-to ~3 MB, mediabunny) se încarcă doar când e nevoie de ele.
 *
 * Setări măsurate în F0 (docs/spikes/imagini.md, video.md):
 * - fotografie: master JPEG q0,90, cel mult 2560 px pe latura lungă;
 * - HEIC: decodat cu heic-to (serverul nu poate);
 * - logo: PNG sau SVG, niciodată JPEG (se pierde transparența);
 * - BADGE: fișierul oficial, neatins;
 * - clip: MP4 H.264 + AV1 (sau HEVC pe Apple, VP9 ca ultimă variantă) + poster JPEG; fără sunet; cel mult 120 s
 *   (D-61). Peste 30 s, latura lungă e de cel mult 1280 px, ca fișierele să rămână sub 50 MB.
 */

export type UploadKind = 'photo' | 'clip' | 'logo' | 'badge' | 'document'

export const MASTER_MAX_SIDE = 2560
export const JPEG_QUALITY = 0.9
export const CLIP_MAX_SECONDS = 120
/** Până aici clipul rămâne la 1080p; peste, se codează la 720p (D-61). Clipurile din hero: cel mult atât. */
export const SHORT_CLIP_SECONDS = 30
export const VIDEO_MAX_SIDE = 1920
export const LONG_VIDEO_MAX_SIDE = 1280
/** Limita unui fișier încărcat (payload.config, upload.limits; Supabase Storage). */
export const UPLOAD_MAX_BYTES = 50_000_000
export const POSTER_QUALITY = 0.85

export class RejectedFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RejectedFileError'
  }
}

const VIDEO_EXT = /\.(mov|mp4|m4v|webm|3gp)$/i
const HEIC_EXT = /\.(heic|heif)$/i
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|heic|heif|svg)$/i

/** Pe Windows, câmpul `type` al unui .mov vine gol: acceptăm și după extensie (F0, video.md). */
export const isVideoFile = (file: File) => file.type.startsWith('video/') || VIDEO_EXT.test(file.name)
export const isHeicFile = (file: File) => /hei[cf]$/i.test(file.type) || HEIC_EXT.test(file.name)
export const isSvgFile = (file: File) => file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)
export const isImageFile = (file: File) => file.type.startsWith('image/') || IMAGE_EXT.test(file.name)
export const isPdfFile = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name)

export function detectKind(file: File): UploadKind {
  if (isVideoFile(file)) return 'clip'
  if (isPdfFile(file)) return 'document'
  if (isSvgFile(file)) return 'logo'
  return 'photo'
}

const baseName = (name: string) => name.replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}._-]+/gu, '-')

export type PhotoResult = {
  file: File
  width: number
  height: number
  ms: number
  decoder: 'browser' | 'heic-to' | 'neschimbat'
  warnings: string[]
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Conversia imaginii a eșuat.'))), type, quality),
  )
}

async function decode(file: File): Promise<{ bitmap: ImageBitmap; decoder: 'browser' | 'heic-to' }> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { bitmap, decoder: 'browser' }
  } catch (error) {
    if (!isHeicFile(file)) throw error
    const { heicTo } = await import('heic-to/next')
    const bitmap = await heicTo({ blob: file, type: 'bitmap' })
    return { bitmap, decoder: 'heic-to' }
  }
}

async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const size = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return size
  } catch {
    return null
  }
}

/** Avertizare (nu blocare) când fișierul e sub dimensiunea minimă a formatului (content-model 1). */
function sizeWarnings(width: number, height: number): string[] {
  const longSide = Math.max(width, height)
  return longSide < 1600
    ? [`Fotografia are ${width} × ${height} px. Pentru galerie și carduri se recomandă cel puțin 1600 px pe latura lungă.`]
    : []
}

/**
 * Fotografie → master JPEG (PNG dacă are transparență, D-68); logo → PNG (micșorat doar dacă depășește 2560 px) sau SVG neschimbat;
 * BADGE → neatins.
 */
/** Are imaginea pixeli (semi)transparenți? Se verifică un pixel din 16 pe fiecare latură (rapid). */
function hasTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d')
  if (!ctx) return false
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  const step = 16
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] < 250) return true
    }
  }
  return false
}

/**
 * Document PDF (D-69): urcă exact cum e, fără conversie. Se verifică aceleași lucruri ca serverul
 * (Payload 3.94, `validatePDF`): semnătura „%PDF-” la început și „xref” și „%%EOF” în ultimii 1.024 de
 * octeți, plus limita de încărcare. Așa, un fișier stricat e oprit aici, cu mesaj în română.
 */
export async function prepareDocument(file: File): Promise<File> {
  const latin1 = new TextDecoder('latin1')
  const head = latin1.decode(await file.slice(0, 5).arrayBuffer())
  if (head !== '%PDF-') {
    throw new RejectedFileError('Fișierul nu este un PDF. Salvează documentul ca PDF și încearcă din nou.')
  }
  const tail = latin1.decode(await file.slice(Math.max(0, file.size - 1024)).arrayBuffer())
  if (!tail.includes('%%EOF') || !tail.includes('xref')) {
    throw new RejectedFileError('PDF-ul pare incomplet sau stricat. Salvează-l din nou ca PDF (Fișier → Export ca PDF) și încearcă iar.')
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    throw new RejectedFileError(
      `PDF-ul are ${formatBytes(file.size)}; limita este ${formatBytes(UPLOAD_MAX_BYTES)}. Micșorează-l (de exemplu „Reduce File Size” la export) și încearcă din nou.`,
    )
  }
  return file.type === 'application/pdf' ? file : new File([file], file.name, { type: 'application/pdf' })
}

export async function convertImage(file: File, kind: Exclude<UploadKind, 'clip' | 'document'>): Promise<PhotoResult> {
  const t0 = performance.now()

  if (kind === 'badge') {
    if (!isImageFile(file) || isHeicFile(file)) {
      throw new RejectedFileError('Logo-ul oficial al premiului se încarcă așa cum l-ai primit: PNG, SVG, JPG sau WebP.')
    }
    const size = isSvgFile(file) ? null : await readImageSize(file)
    return {
      file,
      width: size?.width ?? 0,
      height: size?.height ?? 0,
      ms: performance.now() - t0,
      decoder: 'neschimbat',
      warnings: [],
    }
  }

  if (kind === 'logo' && isSvgFile(file)) {
    return { file, width: 0, height: 0, ms: performance.now() - t0, decoder: 'neschimbat', warnings: [] }
  }

  if (!isImageFile(file)) {
    throw new RejectedFileError('Formate acceptate: JPG, PNG, HEIC (fotografii); SVG sau PNG (logo-uri); MP4, MOV (clipuri).')
  }

  const { bitmap, decoder } = await decode(file)
  const scale = Math.min(1, MASTER_MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  // Un logo PNG care nu trebuie micșorat urcă exact cum este (fără re-codare).
  if (kind === 'logo' && scale === 1 && file.type === 'image/png') {
    bitmap.close()
    return { file, width, height, ms: performance.now() - t0, decoder, warnings: [] }
  }

  const resized = await createImageBitmap(bitmap, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: 'high',
  })
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(resized, 0, 0)
  bitmap.close()
  resized.close()

  // D-68: o imagine cu transparență (PNG, WebP, AVIF, GIF) rămâne PNG, ca transparența să nu se piardă
  // (JPEG n-are canal alfa). Fotografiile obișnuite merg mai departe ca JPEG.
  const asPng = kind === 'logo' || (/^image\/(png|webp|avif|gif)$/.test(file.type) && hasTransparency(canvas))
  const blob = await canvasToBlob(canvas, asPng ? 'image/png' : 'image/jpeg', asPng ? undefined : JPEG_QUALITY)
  const out = new File([blob], `${baseName(file.name)}.${asPng ? 'png' : 'jpg'}`, {
    type: blob.type,
    lastModified: Date.now(),
  })
  return {
    file: out,
    width,
    height,
    ms: performance.now() - t0,
    decoder,
    warnings: kind === 'photo' ? sizeWarnings(width, height) : [],
  }
}

export type ClipResult = {
  h264: File
  efficient: File | null
  efficientCodec: string | null
  poster: File
  durationSeconds: number
  width: number
  height: number
  ms: number
  /** D-73: sunetul clipului: `none` = originalul n-are sunet; `kept` = păstrat; `lost` = pierdut (motivul în `audioNote`). */
  audio: 'none' | 'kept' | 'lost'
  audioNote: string | null
}

/** Motivele pentru care mediabunny renunță la o pistă, pe înțelesul editorului (D-73). */
const AUDIO_REASON: Record<string, string> = {
  undecodable_source_codec: 'browserul acesta nu poate citi sunetul clipului',
  no_encodable_target_codec: 'browserul acesta nu poate coda sunetul',
  unknown_source_codec: 'formatul sunetului nu e recunoscut',
  cannot_copy: 'sunetul nu poate fi copiat în acest format',
}

export type ClipProgress = { stage: string; progress: number }

/**
 * Clip → MP4 H.264 + variantă eficientă + poster, **cu sunetul originalului** (D-67, D-73).
 * Sunetul se copiază ca atare (fără decodare și recodare), deci merge și în browserele care nu au
 * codor audio; se recodează doar dacă formatul de ieșire nu-l acceptă (de exemplu AAC în WebM).
 */
export async function convertClip(file: File, onProgress: (p: ClipProgress) => void): Promise<ClipResult> {
  const t0 = performance.now()
  onProgress({ stage: 'Se încarcă biblioteca de conversie…', progress: 0 })
  const MB = await import('mediabunny')

  const input = new MB.Input({ source: new MB.BlobSource(file), formats: MB.ALL_FORMATS })
  const duration = await input.computeDuration()
  if (duration > CLIP_MAX_SECONDS + 0.5) {
    throw new RejectedFileError(
      `Clipul are ${duration.toFixed(1).replace('.', ',')} s; limita este ${CLIP_MAX_SECONDS} s (D-61). Scurtează-l pe telefon și încearcă din nou.`,
    )
  }
  const track = await input.getPrimaryVideoTrack()
  if (!track) throw new RejectedFileError('Fișierul nu conține video.')
  const sourceHasAudio = Boolean(await input.getPrimaryAudioTrack())
  let audio: ClipResult['audio'] = sourceHasAudio ? 'kept' : 'none'
  let audioNote: string | null = null
  if (!(await track.canDecode())) {
    throw new RejectedFileError('Browserul acesta nu poate citi clipul. Încearcă din Chrome sau Safari, la zi.')
  }

  const portrait = track.displayHeight > track.displayWidth
  // Clipurile lungi (pentru paginile proprii) se codează la 720p: ~25 MB la 120 s în loc de ~50 MB (D-61).
  const maxSide = duration > SHORT_CLIP_SECONDS + 0.5 ? LONG_VIDEO_MAX_SIDE : VIDEO_MAX_SIDE
  const size = portrait
    ? { height: Math.min(maxSide, track.displayHeight) }
    : { width: Math.min(maxSide, track.displayWidth) }

  // Imaginea de început.
  onProgress({ stage: 'Imaginea de început…', progress: 0.02 })
  const sink = new MB.CanvasSink(track, { ...size })
  const first = await sink.getCanvas(await track.getFirstTimestamp())
  if (!first) throw new Error('Nu am putut citi primul cadru.')
  const frame = first.canvas as HTMLCanvasElement | OffscreenCanvas
  const posterBlob =
    'convertToBlob' in frame
      ? await frame.convertToBlob({ type: 'image/jpeg', quality: POSTER_QUALITY })
      : await canvasToBlob(frame as HTMLCanvasElement, 'image/jpeg', POSTER_QUALITY)
  const posterFile = new File([posterBlob], `${baseName(file.name)}-poster.jpg`, { type: 'image/jpeg' })

  // Varianta eficientă: AV1, apoi HEVC (Safari), apoi VP9.
  let efficientCodec: 'av1' | 'hevc' | 'vp9' | null = null
  for (const codec of ['av1', 'hevc', 'vp9'] as const) {
    if (await MB.canEncodeVideo(codec, { width: 1920, height: 1080 })) {
      efficientCodec = codec
      break
    }
  }

  const jobs: { codec: 'avc' | 'av1' | 'hevc' | 'vp9'; label: string; webm: boolean }[] = [
    { codec: 'avc', label: 'MP4 H.264', webm: false },
  ]
  if (efficientCodec) {
    jobs.push({ codec: efficientCodec, label: `varianta eficientă (${efficientCodec.toUpperCase()})`, webm: efficientCodec === 'vp9' })
  }

  const outputs: File[] = []
  for (const [index, job] of jobs.entries()) {
    const span = 0.96 / jobs.length
    const offset = 0.04 + index * span
    onProgress({ stage: `Se convertește: ${job.label}…`, progress: offset })
    const inp = new MB.Input({ source: new MB.BlobSource(file), formats: MB.ALL_FORMATS })
    const output = new MB.Output({
      format: job.webm ? new MB.WebMOutputFormat() : new MB.Mp4OutputFormat({ fastStart: 'in-memory' }),
      target: new MB.BufferTarget(),
    })
    const conversion = await MB.Conversion.init({
      input: inp,
      output,
      video: { ...size, codec: job.codec, quality: MB.QUALITY_MEDIUM, forceTranscode: true },
      // D-73: fără opțiuni, sunetul se copiază ca atare. Cu `quality` (D-67) trebuia decodat și recodat,
      // iar unde browserul nu putea, mediabunny renunța la el fără să spună (clipul cursului, 25.11.2026).
      audio: {},
      showWarnings: false,
    })
    if (!conversion.isValid) {
      throw new Error(`${job.label}: conversie imposibilă pe acest dispozitiv.`)
    }
    const lostAudio = sourceHasAudio ? conversion.discardedTracks.find((d) => d.track.type === 'audio') : undefined
    if (lostAudio && job.codec === 'avc') {
      audio = 'lost'
      audioNote = AUDIO_REASON[lostAudio.reason] ?? lostAudio.reason
    } else if (lostAudio && audio === 'kept') {
      // Varianta eficientă ar fi mută, deși fișierul principal are sunet: Chrome ar reda varianta, deci o sărim.
      efficientCodec = null
      continue
    }
    conversion.onProgress = (p: number) => onProgress({ stage: `Se convertește: ${job.label}…`, progress: offset + p * span })
    await conversion.execute()
    const buffer = (output.target as InstanceType<typeof MB.BufferTarget>).buffer
    if (!buffer) throw new Error(`${job.label}: rezultat gol.`)
    if (buffer.byteLength > UPLOAD_MAX_BYTES) {
      throw new RejectedFileError(
        `${job.label}: fișierul convertit are ${formatBytes(buffer.byteLength)}; limita este ${formatBytes(UPLOAD_MAX_BYTES)}. Scurtează clipul și încearcă din nou.`,
      )
    }
    const ext = job.webm ? 'webm' : 'mp4'
    const suffix = job.codec === 'avc' ? '' : `-${job.codec}`
    outputs.push(
      new File([buffer], `${baseName(file.name)}${suffix}.${ext}`, { type: job.webm ? 'video/webm' : 'video/mp4' }),
    )
  }

  onProgress({ stage: 'Conversie terminată.', progress: 1 })
  return {
    h264: outputs[0],
    efficient: outputs[1] ?? null,
    efficientCodec,
    poster: posterFile,
    durationSeconds: Math.round(duration * 100) / 100,
    width: track.displayWidth,
    height: track.displayHeight,
    ms: performance.now() - t0,
    audio,
    audioNote,
  }
}

export const formatBytes = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2).replace('.', ',')} MB` : `${Math.round(n / 1e3)} KB`

export const formatSeconds = (ms: number) => `${(ms / 1000).toFixed(1).replace('.', ',')} s`
