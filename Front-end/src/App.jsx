import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import ProgressSection from './components/ProgressSection'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import Toast from './components/Toast'
import useReveal from './hooks/useReveal'

export default function App() {
  const [toast, setToast] = useState(null)
  useReveal()

  const showComingSoon = useCallback(() => {
    setToast({
      id: Date.now(),
      title: 'Em breve',
      message:
        'O cadastro e o acesso à plataforma serão liberados nas próximas etapas do projeto.',
    })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4600)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <div id="top">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Navbar onComingSoon={showComingSoon} />

      <main id="conteudo">
        <Hero onComingSoon={showComingSoon} />
        <Marquee />
        <Features />
        <HowItWorks />
        <ProgressSection />
        <Faq />
        <FinalCta onComingSoon={showComingSoon} />
      </main>

      <Footer />
      <Toast toast={toast} />
      <div className="sr-only" role="status" aria-live="polite">
        {toast ? `${toast.title}. ${toast.message}` : ''}
      </div>
    </div>
  )
}
