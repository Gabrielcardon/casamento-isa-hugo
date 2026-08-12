import { useMemo, useState } from 'react'
import type { FulfillmentMethod, Gift } from '../types/gift'
import { ReserveModal } from './ReserveModal'

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

interface GiftListProps {
  gifts: Gift[]
  loading: boolean
  onReserve: (
    giftId: string,
    reservedBy: string,
    method: FulfillmentMethod,
  ) => Promise<void>
}

export function GiftList({ gifts, loading, onReserve }: GiftListProps) {
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved'>('all')
  const [selected, setSelected] = useState<Gift | null>(null)

  const categories = useMemo(() => {
    const set = new Set(gifts.map((g) => g.category).filter(Boolean))
    return Array.from(set).sort()
  }, [gifts])

  const [category, setCategory] = useState<string>('all')

  const filtered = useMemo(() => {
    return gifts.filter((g) => {
      if (filter === 'available' && g.status !== 'available') return false
      if (filter === 'reserved' && g.status !== 'reserved') return false
      if (category !== 'all' && g.category !== category) return false
      return true
    })
  }, [gifts, filter, category])

  return (
    <section id="presentes" className="bg-section-wash px-6 pb-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-forest md:text-5xl">
            Nossa Lista de Presentes
          </h2>
          <p className="mt-5 text-muted leading-relaxed text-balance">
            Selecionamos alguns itens que farão parte do início do nosso novo
            lar. Para tornar tudo mais prático, você pode escolher o presente e
            a forma de presentear que preferir.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <p className="font-sans text-sm font-semibold tracking-wide text-forest">
              Receberemos o Presente
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Compre o item na loja de sua preferência (ou utilize nosso link de
              referência) e entregue pessoalmente ou envie diretamente para
              nossa casa.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-sans text-sm font-semibold tracking-wide text-forest">
              Contribuir com o valor
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Selecione o presente desejado e contribua com o valor
              correspondente via PIX ou cartão (link Mercado Pago).
            </p>
          </div>
        </div>

        {!loading && (
          <p className="mt-10 text-center text-sm text-muted">
            {gifts.filter((g) => g.status === 'available').length} de{' '}
            {gifts.length} disponíveis
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 border-y border-sage/25 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {(
              [
                ['all', 'Todos'],
                ['available', 'Disponíveis'],
                ['reserved', 'Reservados'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm transition ${
                  filter === key
                    ? 'bg-forest text-linen'
                    : 'text-muted hover:text-forest'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {categories.length > 0 && (
            <label className="flex items-center justify-center gap-3 text-sm text-muted md:justify-end">
              Categoria
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-sage/40 bg-white/60 px-3 py-2 text-ink outline-none focus:border-moss"
              >
                <option value="all">Todas</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {loading ? (
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] animate-pulse bg-sage/20" />
                <div className="h-5 w-2/3 animate-pulse bg-sage/20" />
                <div className="h-4 w-1/3 animate-pulse bg-sage/15" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-16 text-center font-display text-2xl italic text-muted">
            Nenhum presente neste filtro.
          </p>
        ) : (
          <ul className="mt-14 grid list-none gap-x-8 gap-y-14 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((gift, index) => {
              const reserved = gift.status === 'reserved'
              return (
                <li
                  key={gift.id}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
                >
                  <article>
                    <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                      {gift.imageUrl ? (
                        <img
                          src={gift.imageUrl}
                          alt=""
                          loading="lazy"
                          className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] ${
                            reserved ? 'grayscale-[35%] opacity-75' : ''
                          }`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-mist to-sage/30 font-display text-3xl text-moss/40">
                          {gift.name.slice(0, 1)}
                        </div>
                      )}
                      {reserved && (
                        <span className="absolute inset-x-0 bottom-0 bg-forest-deep/75 px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-champagne-soft">
                          Já reservado
                          {gift.fulfillmentMethod === 'pix' ? ' · Pix' : ''}
                          {gift.fulfillmentMethod === 'card' ? ' · Cartão' : ''}
                          {gift.fulfillmentMethod === 'store'
                            ? ' · Presente físico'
                            : ''}
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      {gift.category && (
                        <p className="text-xs uppercase tracking-[0.2em] text-sage">
                          {gift.category}
                        </p>
                      )}
                      <h3 className="mt-1 font-display text-2xl font-medium text-forest">
                        {gift.name}
                      </h3>
                      {gift.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {gift.description}
                        </p>
                      )}
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <p className="font-sans text-sm font-semibold tabular-nums text-forest">
                          {formatPrice(gift.price)}
                        </p>
                        {reserved ? (
                          <span className="text-sm text-muted">Obrigado</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelected(gift)}
                            className="border border-forest/25 px-4 py-2 text-sm font-medium text-forest transition hover:border-forest hover:bg-forest hover:text-linen"
                          >
                            Reservar
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {selected && (
        <ReserveModal
          gift={selected}
          onClose={() => setSelected(null)}
          onConfirm={(name, method) => onReserve(selected.id, name, method)}
        />
      )}
    </section>
  )
}
