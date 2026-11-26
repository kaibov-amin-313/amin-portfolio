// The preloader resolves this once it has finished leaving; the hero waits on it to play its intro.
let resolveIntro: () => void = () => {}
export const introDone = new Promise<void>((resolve) => {
  resolveIntro = resolve
})
export function startIntro() {
  resolveIntro()
}
