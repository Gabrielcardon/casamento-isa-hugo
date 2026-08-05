import { wedding } from '../config/wedding'

export function MessageSection() {
  return (
    <section id="mensagem" className="bg-section-wash px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-moss">
          Um convite ao carinho
        </p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
          Compartilhe conosco
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-champagne" />
        <p className="mt-8 font-display text-xl leading-relaxed text-muted italic md:text-2xl text-balance">
          “{wedding.message}”
        </p>
        {(wedding.venue || wedding.city) && (
          <p className="mt-10 font-sans text-sm text-muted">
            {wedding.venue}
            {wedding.venue && wedding.city ? ' · ' : ''}
            {wedding.city}
          </p>
        )}
      </div>
    </section>
  )
}
