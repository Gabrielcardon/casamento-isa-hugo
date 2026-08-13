import { coupleDisplayName, wedding } from '../config/wedding'
import { WeddingCountdown } from './WeddingCountdown'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-hero-atmosphere px-6 pb-16 pt-28 md:px-10 md:pb-24"
    >
      <div
        className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full border border-champagne-soft/25 animate-float md:h-96 md:w-96"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-32 h-64 w-64 rounded-full border border-linen/20 opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-px w-[min(70%,28rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-champagne-soft/50 to-transparent animate-fade-in"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <p className="animate-fade-up font-sans text-xs font-medium uppercase tracking-[0.35em] text-champagne-soft/95 md:text-sm">
          Casamento
        </p>

        <h1 className="animate-fade-up delay-1 mt-6 font-display text-[clamp(2.75rem,11vw,6.5rem)] font-medium leading-[0.95] tracking-tight text-linen">
          {wedding.partnerOne}
          <span className="mx-3 inline-block font-display text-[0.55em] font-normal italic text-champagne-soft md:mx-5">
            &
          </span>
          {wedding.partnerTwo}
        </h1>

        <p className="animate-fade-up delay-2 mx-auto mt-6 max-w-lg font-sans text-base text-linen/90 md:text-lg">
          {wedding.dateLabel}
          <span className="mx-2 text-champagne-soft/80">•</span>
          {wedding.timeLabel}
          <span className="mx-2 text-champagne-soft/80">•</span>
          {wedding.venue || wedding.city}
        </p>

        <WeddingCountdown />

        <div className="animate-fade-up delay-3 mt-12">
          <a
            href="#presentes"
            className="inline-flex items-center gap-2 border border-linen/40 bg-linen/10 px-8 py-3.5 text-sm font-medium tracking-wide text-linen backdrop-blur-sm transition-all duration-300 hover:border-linen hover:bg-linen/20"
          >
            Ver lista de presentes
            <span aria-hidden className="text-champagne-soft">
              ↓
            </span>
          </a>
        </div>

        <p className="animate-fade-in delay-4 mt-16 font-display text-sm italic tracking-wide text-linen/50">
          {coupleDisplayName}
        </p>
      </div>
    </section>
  )
}
