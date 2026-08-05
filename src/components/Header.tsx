import { coupleDisplayName } from '../config/wedding'

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <a
          href="#inicio"
          className="font-display text-lg tracking-[0.08em] text-champagne-soft transition-opacity hover:opacity-80 md:text-xl"
        >
          {coupleDisplayName}
        </a>
        <nav className="flex items-center gap-6 text-sm text-mist/90">
          <a href="#mensagem" className="transition-colors hover:text-champagne-soft">
            Mensagem
          </a>
          <a href="#presentes" className="transition-colors hover:text-champagne-soft">
            Presentes
          </a>
        </nav>
      </div>
    </header>
  )
}
