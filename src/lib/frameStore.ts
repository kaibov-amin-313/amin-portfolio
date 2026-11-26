import { FRAMES } from './frames'

type Listener = (progress: number) => void

let images: HTMLImageElement[] | null = null
let loaded = 0
let ready: Promise<HTMLImageElement[]> | null = null
const listeners = new Set<Listener>()

/** Loads the hero frame sequence once; the preloader and the hero share the same images. */
export function loadFrames() {
  if (ready) return ready
  images = Array.from({ length: FRAMES.count }, () => new Image())
  ready = Promise.all(
    images.map(
      (img, i) =>
        new Promise<void>((resolve) => {
          const done = () => {
            loaded++
            listeners.forEach((l) => l(loaded / FRAMES.count))
            resolve()
          }
          img.onload = done
          img.onerror = done
          img.decoding = 'async'
          img.src = FRAMES.path(i)
        }),
    ),
  ).then(() => images!)
  return ready
}

export function onFrameProgress(listener: Listener) {
  listeners.add(listener)
  listener(images ? loaded / FRAMES.count : 0)
  return () => listeners.delete(listener)
}
