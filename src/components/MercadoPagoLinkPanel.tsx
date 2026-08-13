import {
  isGiftSpecificMercadoPagoLink,
  resolveMercadoPagoLink,
} from '../config/wedding'

interface MercadoPagoLinkPanelProps {
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
export function MercadoPagoLinkPanel({
  amount,
  giftName,
  giftMercadoPagoLink = '',
}: MercadoPagoLinkPanelProps) {
  const link = resolveMercadoPagoLink(giftMercadoPagoLink)
  const ready = link.startsWith('http')
  const hasFixedAmount = isGiftSpecificMercadoPagoLink(giftMercadoPagoLink)

  if (!ready) {
    return (
      <div className="border border-champagne/40 bg-champagne/10 px-4 py-4 text-left text-sm text-forest">
        <p className="font-medium">Mercado Pago — link não configurado</p>
        <p className="mt-2 leading-relaxed text-muted">
          Cadastre um link neste presente no admin, ou o link geral em{' '}
          <code className="text-xs">src/config/wedding.ts</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-center">
      <div className="border border-sage/30 bg-white/70 px-4 py-4 text-left text-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-moss">
          Mercado Pago
          {hasFixedAmount ? ' · valor do presente' : ' · valor a informar'}
        </p>
        <p className="mt-2 font-display text-xl text-forest">{giftName}</p>
        <p className="mt-1 font-semibold tabular-nums text-forest">
          {formatPrice(amount)}
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-muted">
          {hasFixedAmount ? (
            <li>
              Este link já foi criado com o valor do presente no Mercado Pago.
            </li>
          ) : (
            <li>
              Link geral sem valor fixo — informe{' '}
              <strong className="font-medium text-forest">
                {formatPrice(amount)}
              </strong>{' '}
              no checkout do MP.
            </li>
          )}
          <li>
            O site não confere o pagamento sozinho. Os noivos marcam como pago
            no admin.
          </li>
        </ul>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center bg-forest px-6 py-3 text-sm font-medium text-linen transition hover:bg-moss"
      >
        Pagar no Mercado Pago
      </a>

      <p className="text-xs text-muted">
        Cartão de crédito (e demais meios do MP) na página do Mercado Pago.
      </p>
    </div>
  )
}

export function openMercadoPagoLink(giftMercadoPagoLink?: string) {
  const link = resolveMercadoPagoLink(giftMercadoPagoLink)
  if (link.startsWith('http')) {
    window.open(link, '_blank', 'noopener,noreferrer')
  }
}
