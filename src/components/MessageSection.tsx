import { wedding } from '../config/wedding'

export function MessageSection() {
  return (
    <section id="mensagem" className="bg-section-wash px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-px w-16 bg-sage" />
        <p className="mt-10 font-display text-xl leading-relaxed text-muted md:text-2xl text-balance">
          {wedding.message}
        </p>
      </div>
    </section>
  )
}
