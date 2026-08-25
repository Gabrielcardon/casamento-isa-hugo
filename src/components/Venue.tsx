import { wedding } from '../config/wedding'

export function Venue() {
  const mapQuery = encodeURIComponent(wedding.venueAddress)

  return (
    <section id="local" className="relative overflow-hidden bg-cream px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32">
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-medium tracking-tight text-olive-deep md:text-5xl">
          Informações
        </h2>

        <div className="mx-auto mt-12 grid gap-5 text-left md:grid-cols-2">
          <div className="border border-olive/20 border-t-4 border-t-champagne bg-white/80 px-6 py-7 text-center shadow-sm md:px-8 md:py-8">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-olive">
              Data e horário
            </p>
            <p className="mt-4 font-display text-2xl font-medium leading-tight text-olive-deep md:text-3xl">
              {wedding.dateLongLabel}
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
              Início {wedding.timeLabel}
            </p>
          </div>

          <div className="border border-olive/20 border-t-4 border-t-moss bg-white/80 px-6 py-7 text-center shadow-sm md:px-8 md:py-8">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-olive">
              Local da cerimônia
            </p>
            <p className="mt-4 font-display text-2xl font-medium leading-tight text-olive-deep md:text-3xl">
              {wedding.venue}
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted">{wedding.venueAddress}</p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden border border-olive/20 shadow-sm">
          <iframe
            title={`Mapa - ${wedding.venue}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-72 w-full grayscale-[15%] md:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-medium tracking-wide text-olive underline decoration-coral/60 decoration-2 underline-offset-4 transition-colors hover:text-coral"
        >
          Ver rota até o local
        </a>
      </div>
    </section>
  )
}