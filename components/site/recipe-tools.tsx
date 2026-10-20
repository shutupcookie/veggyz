'use client'

import { useEffect, useRef, useState } from 'react'
import { Printer, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

type Sentinel = { release: () => Promise<void> }

/** Print button + "keep screen on" toggle (Screen Wake Lock API) for cooking from a phone. */
export function RecipeTools() {
  const [supported, setSupported] = useState(false)
  const [awake, setAwake] = useState(false)
  const lock = useRef<Sentinel | null>(null)

  useEffect(() => {
    setSupported(typeof navigator !== 'undefined' && 'wakeLock' in navigator)
  }, [])

  useEffect(() => {
    if (!awake) return
    let cancelled = false
    const request = async () => {
      try {
        const s = await (navigator as unknown as { wakeLock: { request: (t: 'screen') => Promise<Sentinel> } }).wakeLock.request('screen')
        if (cancelled) s.release()
        else lock.current = s
      } catch {
        setAwake(false)
      }
    }
    request()
    // the lock is dropped when the tab is hidden; take it again on return
    const onVis = () => document.visibilityState === 'visible' && request()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVis)
      lock.current?.release().catch(() => {})
      lock.current = null
    }
  }, [awake])

  const btn = 'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors'
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      {supported && (
        <button
          type="button"
          aria-pressed={awake}
          onClick={() => setAwake((a) => !a)}
          className={cn(btn, awake ? 'border-beet bg-beet text-lime' : 'border-border bg-surface hover:border-beet')}
        >
          <Sun className="size-4" aria-hidden /> {awake ? 'Screen stays on' : 'Keep screen on'}
        </button>
      )}
      <button type="button" onClick={() => window.print()} className={cn(btn, 'border-border bg-surface hover:border-beet')}>
        <Printer className="size-4" aria-hidden /> Print
      </button>
    </div>
  )
}
