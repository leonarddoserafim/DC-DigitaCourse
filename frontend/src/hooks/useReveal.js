import { useEffect } from 'react'

export default function useReveal(dependency) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((element) => {
        element.classList.add('is-visible')
      })
      return undefined
    }

    const observed = new WeakSet()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )

    const register = (root) => {
      if (!root) return
      const elements = []
      if (root.nodeType === Node.ELEMENT_NODE && root.matches('[data-reveal]')) {
        elements.push(root)
      }
      if (root.querySelectorAll) elements.push(...root.querySelectorAll('[data-reveal]'))

      elements.forEach((element) => {
        if (observed.has(element)) return
        observed.add(element)
        if (element.classList.contains('is-visible')) return
        observer.observe(element)
      })
    }

    register(document.body)

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) register(node)
        })
      })
    })

    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [dependency])
}
