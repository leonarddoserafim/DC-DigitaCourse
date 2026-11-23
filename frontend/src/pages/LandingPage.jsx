import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import ProgressSection from '../components/ProgressSection'
import Faq from '../components/Faq'
import FinalCta from '../components/FinalCta'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

export default function LandingPage() {
  usePageMeta(
    'DigitaCourse — Suas ideias merecem dedos mais rápidos',
    'Trilhas guiadas, exercícios interativos e feedback em tempo real para você digitar com mais velocidade, precisão e confiança.',
  )

  return (
    <div id="top">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Navbar />

      <main id="conteudo">
        <Hero />
        <Marquee />
        <Features />
        <HowItWorks />
        <ProgressSection />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
