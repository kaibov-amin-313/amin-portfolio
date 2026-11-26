import Hero from '@/components/Hero'
import Preloader from '@/components/Preloader'
import RevealScope from '@/components/RevealScope'
import About from '@/components/sections/About'
import Awards from '@/components/sections/Awards'
import Contact from '@/components/sections/Contact'
import Manifesto from '@/components/sections/Manifesto'
import Security from '@/components/sections/Security'
import Work from '@/components/sections/Work'

export default function Home() {
  return (
    <>
      <Preloader />
      <RevealScope id="main">
        <Hero />
        <Manifesto />
        <Work />
        <Awards />
        <Security />
        <About />
        <Contact />
      </RevealScope>
    </>
  )
}
