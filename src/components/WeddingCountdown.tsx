import { useEffect, useState } from 'react'
import { wedding } from '../config/wedding'

interface Remaining {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getWeddingDate(): Date {
  const [y, m, day] = wedding.dateISO.split('-').map(Number)
  return new Date(y, m - 1, day, wedding.timeHour, wedding.timeMinute, 0, 0)
}

function getRemaining(now = new Date()): Remaining {
  const totalMs = getWeddingDate().getTime() - now.getTime()
  if (totalMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const totalSeconds = Math.floor(totalMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { totalMs, days, hours, minutes, seconds }
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[4.25rem] px-2 text-center sm:min-w-[5rem] sm:px-3">
      <p className="font-display text-3xl tabular-nums leading-none text-linen sm:text-4xl md:text-5xl">
        {String(value).padStart(2, '0')}
      </p>
      <p className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-champagne-soft/75 sm:text-xs">
        {label}
      </p>
    </div>
  )
}

function Divider() {
  return (
    <span
      className="mb-5 hidden h-8 w-px self-end bg-linen/25 sm:mb-6 sm:block"
      aria-hidden
    />
  )
}

export function WeddingCountdown() {
  const [remaining, setRemaining] = useState(() => getRemaining())

  useEffect(() => {
    setRemaining(getRemaining())
    const id = window.setInterval(() => setRemaining(getRemaining()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (remaining.totalMs <= 0) {
    return (
      <div className="animate-fade-up delay-2 mt-10">
        <p className="font-display text-2xl italic text-linen md:text-3xl">
          Celebramos nosso dia
        </p>
      </div>
    )
  }

  const isToday = remaining.days === 0

  return (
    <div className="animate-fade-up delay-2 mt-10">
      <p className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-champagne-soft/85">
        {isToday ? 'Começa em' : 'Contagem regressiva'}
      </p>

      <div className="mt-5 flex items-end justify-center gap-1 sm:gap-2">
        {!isToday && (
          <>
            <Unit
              value={remaining.days}
              label={remaining.days === 1 ? 'dia' : 'dias'}
            />
            <Divider />
          </>
        )}
        <Unit value={remaining.hours} label={remaining.hours === 1 ? 'hora' : 'horas'} />
        <Divider />
        <Unit
          value={remaining.minutes}
          label={remaining.minutes === 1 ? 'min' : 'min'}
        />
        <Divider />
        <Unit value={remaining.seconds} label="seg" />
      </div>

      <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-champagne-soft/50 to-transparent" />
    </div>
  )
}
