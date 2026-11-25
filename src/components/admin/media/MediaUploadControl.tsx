'use client'

import {
  toast,
  useConfig,
  useForm,
  useFormFields,
  useUploadControls,
  useUploadHandlers,
} from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  CLIP_MAX_SECONDS,
  SHORT_CLIP_SECONDS,
  RejectedFileError,
  convertClip,
  convertImage,
  detectKind,
  isPdfFile,
  prepareDocument,
  formatBytes,
  formatSeconds,
  isVideoFile,
  type UploadKind,
} from './convert'

/**
 * „Alege și convertește” (S-14 … S-14e, design/flows/flow-incarcare-media.mmd).
 * Se afișează în zona de încărcare a Bibliotecii media (upload.admin.components.controls).
 * Fișierul convertit intră în fluxul standard Payload (useUploadControls), deci urcă direct
 * în Supabase Storage prin clientUploads (ADR-003).
 */

const KIND_OPTIONS: { value: UploadKind | 'auto'; label: string }[] = [
  { value: 'auto', label: 'Detectez singur (fotografie, clip sau PDF)' },
  { value: 'photo', label: 'Fotografie' },
  { value: 'clip', label: 'Clip video (cel mult 120 s)' },
  { value: 'logo', label: 'Logo (PNG sau SVG)' },
  { value: 'badge', label: 'Logo oficial de premiu (neatins)' },
  { value: 'document', label: 'Document PDF (de exemplu lista de vinuri)' },
]

const ACCEPT = 'image/*,video/*,.heic,.heif,.mov,.mp4,.m4v,.svg,.pdf,application/pdf'

type State =
  | { status: 'idle' }
  | { status: 'working'; stage: string; progress: number }
  | { status: 'rejected'; message: string }
  | { status: 'failed'; message: string; file: File }

export const MediaUploadControl: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [kindChoice, setKindChoice] = useState<UploadKind | 'auto'>('auto')
  const [state, setState] = useState<State>({ status: 'idle' })

  const { setUploadControlFile } = useUploadControls()
  const { getUploadHandler } = useUploadHandlers()
  const { setModified } = useForm()
  const dispatch = useFormFields(([, d]) => d)
  const tenant = useFormFields(([fields]) => fields?.tenant?.value)
  const {
    config: {
      serverURL,
      routes: { api },
    },
  } = useConfig()

  const setField = useCallback(
    (path: string, value: unknown) => dispatch({ type: 'UPDATE', path, value } as any),
    [dispatch],
  )

  /** Încarcă o variantă (clip eficient sau poster) ca fișier separat, ascuns în bibliotecă. */
  const uploadVariant = useCallback(
    async (file: File, data: Record<string, unknown>): Promise<number | string> => {
      const handler = getUploadHandler({ collectionSlug: 'media' })
      let filePart: Blob | string = file
      if (typeof handler === 'function') {
        let filename = file.name
        const clientUploadContext = await handler({
          file,
          updateFilename: (value: string) => {
            filename = value
          },
        })
        filePart = JSON.stringify({
          clientUploadContext,
          collectionSlug: 'media',
          filename,
          mimeType: file.type,
          size: file.size,
        })
      }
      const body = new FormData()
      body.append('_payload', JSON.stringify({ ...data, tenant }))
      body.append('file', filePart)
      const response = await fetch(`${serverURL || ''}${api}/media`, {
        method: 'POST',
        body,
        credentials: 'include',
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok || !json?.doc?.id) {
        throw new Error(json?.errors?.[0]?.message || `Încărcarea variantei a eșuat (${response.status}).`)
      }
      return json.doc.id
    },
    [api, getUploadHandler, serverURL, tenant],
  )

  const handleFile = useCallback(
    async (file: File) => {
      const kind: UploadKind = kindChoice === 'auto' ? detectKind(file) : kindChoice
      if (kind !== 'clip' && isVideoFile(file)) {
        setState({ status: 'rejected', message: 'Ai ales un tip de imagine, dar fișierul este un clip video.' })
        return
      }
      if (kind === 'clip' && !isVideoFile(file)) {
        setState({ status: 'rejected', message: 'Ai ales „Clip video”, dar fișierul nu este un clip (MP4 sau MOV).' })
        return
      }
      if (kind !== 'document' && isPdfFile(file)) {
        setState({ status: 'rejected', message: 'Fișierul este un PDF: alege „Document PDF” la „Ce încarci?”.' })
        return
      }

      try {
        if (kind === 'clip') {
          setState({ status: 'working', stage: 'Pregătesc conversia pe dispozitiv…', progress: 0 })
          const result = await convertClip(file, ({ stage, progress }) =>
            setState({ status: 'working', stage, progress: progress * 0.85 }),
          )
          setState({ status: 'working', stage: 'Se încarcă imaginea de început…', progress: 0.88 })
          const posterId = await uploadVariant(result.poster, { kind: 'video-poster', alt: '' })
          let efficientId: number | string | null = null
          if (result.efficient) {
            setState({ status: 'working', stage: 'Se încarcă varianta eficientă…', progress: 0.93 })
            efficientId = await uploadVariant(result.efficient, {
              kind: 'video-variant',
              codec: result.efficientCodec,
            })
          }
          setField('kind', 'clip')
          setField('originalName', file.name)
          setField('originalBytes', file.size)
          setField('durationSeconds', result.durationSeconds)
          // D-73: în panou se vede dacă clipul are sunet, fără să fie ascultat.
          const sound = result.audio === 'kept' ? 'cu sunet' : result.audio === 'lost' ? 'FĂRĂ SUNET (pierdut la conversie)' : 'fără sunet (originalul n-are)'
          setField('codec', `${['H.264', result.efficientCodec?.toUpperCase()].filter(Boolean).join(' + ')} · ${sound}`)
          setField('poster', posterId)
          if (efficientId) setField('efficientVariant', efficientId)
          setModified(true)
          setUploadControlFile(result.h264)
          const total = result.h264.size + (result.efficient?.size ?? 0) + result.poster.size
          toast.success(
            `Clip convertit în ${formatSeconds(result.ms)}: ${formatBytes(file.size)} → ${formatBytes(total)} (H.264${result.efficientCodec ? ` + ${result.efficientCodec.toUpperCase()}` : ''} + imagine de început, ${result.audio === 'kept' ? 'cu sunet' : 'fără sunet'}). Completează textul alternativ și apasă Salvează.`,
            { duration: 12000 },
          )
          if (result.audio === 'lost') {
            toast.warning(
              `Sunetul nu s-a putut păstra: ${result.audioNote}. Clipul se salvează fără sunet. Pentru sunet, încarcă-l din Chrome sau Edge pe calculator.`,
              { duration: 20000 },
            )
          }
          setState({ status: 'idle' })
          return
        }

        if (kind === 'document') {
          const pdf = await prepareDocument(file)
          setField('kind', 'document')
          setField('originalName', file.name)
          setField('originalBytes', file.size)
          setModified(true)
          setUploadControlFile(pdf)
          toast.success(`PDF pregătit, neschimbat (${formatBytes(file.size)}). Apasă Salvează.`, { duration: 10000 })
          setState({ status: 'idle' })
          return
        }

        setState({ status: 'working', stage: 'Se convertește pe dispozitiv…', progress: 0.3 })
        const result = await convertImage(file, kind)
        setField('kind', kind)
        setField('originalName', file.name)
        setField('originalBytes', file.size)
        setModified(true)
        setUploadControlFile(result.file)
        toast.success(
          result.decoder === 'neschimbat'
            ? `Fișier pregătit, neschimbat (${formatBytes(file.size)}). ${kind === 'badge' ? 'Logo-ul oficial rămâne exact cum l-ai primit.' : ''}`
            : `Convertit în ${formatSeconds(result.ms)}: ${formatBytes(file.size)} → ${formatBytes(result.file.size)}, ${result.width} × ${result.height} px. Completează textul alternativ, alege punctul focal și apasă Salvează.`,
          { duration: 10000 },
        )
        result.warnings.forEach((warning) => toast.warning(warning, { duration: 12000 }))
        setState({ status: 'idle' })
      } catch (error) {
        if (error instanceof RejectedFileError) {
          setState({ status: 'rejected', message: error.message })
        } else {
          setState({
            status: 'failed',
            message: error instanceof Error ? error.message : String(error),
            file,
          })
        }
      }
    },
    [kindChoice, setField, setModified, setUploadControlFile, uploadVariant],
  )

  // Fișierele trase peste zonă sau lipite trec tot prin conversie, nu direct pe server.
  useEffect(() => {
    const zone = rootRef.current?.closest('.dropzone')
    if (!zone) return
    const intercept = (event: Event) => {
      const files =
        (event as DragEvent).dataTransfer?.files ?? (event as ClipboardEvent).clipboardData?.files
      if (!files || files.length === 0) return
      event.preventDefault()
      event.stopImmediatePropagation()
      zone.dispatchEvent(new Event('dragleave'))
      void handleFile(files[0])
    }
    zone.addEventListener('drop', intercept, true)
    zone.addEventListener('paste', intercept, true)
    return () => {
      zone.removeEventListener('drop', intercept, true)
      zone.removeEventListener('paste', intercept, true)
    }
  }, [handleFile])

  const busy = state.status === 'working'

  return (
    <div className="media-convert" ref={rootRef}>
      <label className="media-convert__kind">
        <span>Ce încarci?</span>
        <select
          value={kindChoice}
          disabled={busy}
          onChange={(e) => setKindChoice(e.target.value as UploadKind | 'auto')}
        >
          {KIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="btn btn--style-primary btn--size-small media-convert__btn"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        Alege și convertește
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) void handleFile(file)
        }}
      />
      <p className="media-convert__note">
        Fotografii JPG, PNG, HEIC · clipuri MP4, MOV de cel mult {CLIP_MAX_SECONDS} s · logo-uri SVG sau
        PNG · documente PDF (de exemplu lista de vinuri), neschimbate. Păstrează originalul la tine; pe site rămâne doar varianta optimizată. Clipurile de peste{' '}
        {SHORT_CLIP_SECONDS} s se fac la 720p, se convertesc în câteva minute și merg pe paginile proprii; în
        hero-ul de pe Acasă intră doar clipuri de cel mult {SHORT_CLIP_SECONDS} s.
      </p>

      {state.status === 'working' && (
        <div className="media-convert__status" role="status" aria-live="polite">
          <progress max={1} value={state.progress} />
          <span>{state.stage}</span>
          <small>Nu închide pagina. Întâi se convertește pe dispozitiv, apoi se încarcă.</small>
        </div>
      )}
      {state.status === 'rejected' && (
        <div className="media-convert__error" role="alert">
          <strong>Fișier respins.</strong> {state.message}
        </div>
      )}
      {state.status === 'failed' && (
        <div className="media-convert__error" role="alert">
          <strong>Conversia a eșuat.</strong> Fișierul tău nu a fost modificat. Detalii: {state.message}
          <div className="media-convert__actions">
            <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => void handleFile(state.file)}>
              Încearcă din nou
            </button>
            <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => setState({ status: 'idle' })}>
              Renunță
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
