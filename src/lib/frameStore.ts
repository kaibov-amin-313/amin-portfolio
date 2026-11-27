import { FRAMES, type FrameSize } from './frames'

type Listener = (progress: number) => void

/** Every Nth frame (plus the last) gates the preloader; the rest stream in behind it. */
const KEY_STEP = 4

const images: (HTMLImageElement | null)[] = Array(FRAMES.count).fill(null)
const listeners = new Set<Listener>()
let ready: Promise<void> | null = null
let keysLoaded = 0
const keyIndices = Array.from({ length: FRAMES.count }, (_, i) => i).filter((i) => i % KEY_STEP === 0 || i === FRAMES.count - 1)

function pickSize(): FrameSize {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return matchMedia('(orientation: portrait)').matches || conn?.saveData ? 'portrait' : 'landscape'
}

function load(size: FrameSize, i: number) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = FRAMES.path(size, i)
    // decode() keeps the first scroll-draw of each frame from stalling on image decoding.
    img
      .decode()
      .then(() => void (images[i] = img))
      .catch(() => {})
      .finally(resolve)
  })
}

/** Resolves once the key frames are in; the full sequence keeps loading afterwards. */
export function loadFrames() {
  if (ready) return ready
  const size = pickSize()
  ready = Promise.all(
    keyIndices.map((i) =>
      load(size, i).then(() => {
        keysLoaded++
        listeners.forEach((l) => l(keysLoaded / keyIndices.length))
      }),
    ),
  ).then(() => {
    const rest = images.map((_, i) => i).filter((i) => !keyIndices.includes(i))
    // A few at a time so the background fill never competes with what the user is doing.
    const next = (): Promise<void> | undefined => {
      const i = rest.shift()
      return i === undefined ? undefined : load(size, i).then(next)
    }
    for (let k = 0; k < 4; k++) next()
  })
  return ready
}

/** The requested frame, or the nearest one that has loaded so far. */
export function getFrame(i: number) {
  for (let d = 0; d < FRAMES.count; d++) {
    const img = images[i - d] ?? images[i + d]
    if (img) return img
  }
  return null
}

export function onFrameProgress(listener: Listener) {
  listeners.add(listener)
  listener(keysLoaded / keyIndices.length)
  return () => listeners.delete(listener)
}

export const KEY_FRAME_COUNT = keyIndices.length

/** True once the key frames are in — e.g. when coming back to the home page in the same visit. */
export function framesReady() {
  return keysLoaded === keyIndices.length
}
