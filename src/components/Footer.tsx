import { coupleDisplayName, wedding } from '../config/wedding'

export function Footer() {
  return (
    <footer className="bg-[#170909] px-6 py-16 text-center text-mist/80 md:px-10">
      <p className="font-display text-3xl text-champagne-soft md:text-4xl">
        {coupleDisplayName}
      </p>
      <p className="mt-4 font-sans text-sm tracking-wide">
        {wedding.dateLabel}
        <span className="mx-1.5 opacity-50">•</span>
        {wedding.timeLabel}
        {(wedding.venue || wedding.city)
          ? ` • ${wedding.venue || wedding.city}`
          : ''}
      </p>
      <p className="mt-6 text-xs tracking-wide text-mist/50">
        Desenvolvido por GSC Tecnologia da Informação
      </p>
    </footer>
  )
}
