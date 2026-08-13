import { coupleDisplayName, wedding } from '../config/wedding'
import { isFirebaseConfigured } from '../lib/firebase'

export function Footer() {
  return (
    <footer className="bg-forest-deep px-6 py-16 text-center text-mist/80 md:px-10">
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
      {wedding.pixKey && (
        <p className="mx-auto mt-8 max-w-md text-sm text-mist/60">
          Também aceitamos Pix: <span className="text-champagne-soft">{wedding.pixKey}</span>
          {wedding.pixName ? ` (${wedding.pixName})` : ''}
        </p>
      )}
      <p className="mt-12 text-xs text-mist/40">
        Com carinho, obrigado por fazer parte da nossa história.
      </p>
      <p className="mt-6 text-xs tracking-wide text-mist/35">
        Desenvolvido por GSC Tecnologia da Informação
      </p>
      {!isFirebaseConfigured && (
        <p className="mt-4 text-xs text-champagne/50">
          Modo demo · dados locais · configure o Firebase conforme CONFIGURACAO.md
        </p>
      )}
    </footer>
  )
}
