import {
  isGiftSpecificInfinitePayLink,
  resolveInfinitePayLink,
} from '../config/wedding'

interface InfinitePayLinkPanelProps {
  amount: number
  giftName: string
  /** Link específico deste presente (opcional) */
  giftMercadoPagoLink?: string
}

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Link do presente (com valor) tem prioridade; senão usa o link geral sem valor fixo.
 */
export function InfinitePayLinkPanel({
  amount,
  giftName,
  giftMercadoPagoLink = '',
}: InfinitePayLinkPanelProps) {
  const link = resolveInfinitePayLink(giftMercadoPagoLink)
  const ready = link.startsWith('http')
  const hasFixedAmount = isGiftSpecificInfinitePayLink(giftMercadoPagoLink)

  if (!ready) {
    return (
      <div className="border border-sage/30 bg-white/80 p-4 text-left shadow-sm">
        <p className="mt-2 font-medium text-forest">Link não configurado</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Cadastre um link neste presente no admin, ou o link geral em{' '}
          <code className="text-xs">src/config/wedding.ts</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-full border border-sage/30 bg-white p-4 text-center shadow-sm">
        <p className="mt-2 font-display text-xl leading-tight text-forest">{giftName}</p>
        <p className="mt-1 font-sans text-sm font-semibold tabular-nums text-forest">
          {formatPrice(amount)}
        </p>
        <div className="mt-4 space-y-3 text-xs leading-relaxed text-muted">
          {!hasFixedAmount && (
            <p className="font-medium text-forest/80">
              Você será redirecionado à página do InfinitePay para confirmar o valor e finalizar o pagamento.
            </p>
          )}
          {!hasFixedAmount && (
            <p>
              Link sem valor fixo — informe{' '}
              <strong className="font-medium text-forest">
                {formatPrice(amount)}
              </strong>{' '}
              no checkout do InfinitePay.
            </p>
          )}
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center border border-forest/30 bg-forest/5 px-5 py-2.5 text-sm font-medium text-forest transition hover:bg-forest hover:text-linen"
      >
        Pagar no InfinitePay
      </a>
    </div>
  )
}

export function openInfinitePayLink(giftMercadoPagoLink?: string) {
  const link = resolveInfinitePayLink(giftMercadoPagoLink)
  if (link.startsWith('http')) {
    window.open(link, '_blank', 'noopener,noreferrer')
  }
}
