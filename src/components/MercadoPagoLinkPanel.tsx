import {
  getMercadoPagoPaymentLink,
  hasMercadoPagoLink,
} from '../config/wedding'

interface MercadoPagoLinkPanelProps {
  amount: number
  giftName: string
}

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * PoC: redireciona a um link fixo do Mercado Pago.
 * Não sincroniza valor por presente nem webhook de pagamento.
 */
export function MercadoPagoLinkPanel({
  amount,
  giftName,
}: MercadoPagoLinkPanelProps) {
  const link = getMercadoPagoPaymentLink()
  const ready = hasMercadoPagoLink()

  if (!ready) {
    return (
      <div className="border border-champagne/40 bg-champagne/10 px-4 py-4 text-left text-sm text-forest">
        <p className="font-medium">PoC Mercado Pago — link não configurado</p>
        <p className="mt-2 leading-relaxed text-muted">
          Cole o link de pagamento em{' '}
          <code className="text-xs">src/config/wedding.ts</code> →{' '}
          <code className="text-xs">mercadoPagoPaymentLink</code>.
        </p>
        <p className="mt-2 text-xs text-muted">
          No app/site do MP: criar link de cobrança e colar a URL aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-center">
      <div className="border border-sage/30 bg-white/70 px-4 py-4 text-left text-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-moss">
          Mercado Pago · PoC
        </p>
        <p className="mt-2 font-display text-xl text-forest">{giftName}</p>
        <p className="mt-1 font-semibold tabular-nums text-forest">
          Valor do presente: {formatPrice(amount)}
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-muted">
          <li>
            Este é um <strong className="font-medium text-forest">link fixo</strong>{' '}
            — o valor do item pode precisar ser informado por você no checkout
            do MP.
          </li>
          <li>
            O site <strong className="font-medium text-forest">não</strong>{' '}
            confere o pagamento sozinho. Os noivos marcam como pago no admin.
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

export function openMercadoPagoLink() {
  const link = getMercadoPagoPaymentLink()
  if (link.startsWith('http')) {
    window.open(link, '_blank', 'noopener,noreferrer')
  }
}
