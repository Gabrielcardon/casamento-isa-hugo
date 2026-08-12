import { useId, useState } from 'react'
import { hasMercadoPagoLink } from '../config/wedding'
import type { FulfillmentMethod, Gift } from '../types/gift'
import {
  MercadoPagoLinkPanel,
  openMercadoPagoLink,
} from './MercadoPagoLinkPanel'
import { PixPayment } from './PixPayment'

interface ReserveModalProps {
  gift: Gift
  onClose: () => void
  onConfirm: (name: string, method: FulfillmentMethod) => Promise<void>
}

export function ReserveModal({ gift, onClose, onConfirm }: ReserveModalProps) {
  const id = useId()
  const [name, setName] = useState('')
  const [method, setMethod] = useState<FulfillmentMethod | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<
    'form' | 'pix-done' | 'card-done' | 'store-done'
  >('form')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!method) {
      setError('Escolha como deseja presentear.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await onConfirm(name, method)
      if (method === 'pix') {
        setStep('pix-done')
      } else if (method === 'card') {
        setStep('card-done')
        if (hasMercadoPagoLink()) {
          openMercadoPagoLink()
        }
      } else {
        setStep('store-done')
        if (gift.link) {
          window.open(gift.link, '_blank', 'noopener,noreferrer')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível reservar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-forest-deep/55 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto animate-fade-up border border-sage/25 bg-linen p-6 shadow-xl md:p-8">
        {step === 'form' && (
          <>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-moss">
              Reservar
            </p>
            <h3
              id={`${id}-title`}
              className="mt-2 font-display text-3xl font-medium text-forest"
            >
              {gift.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-muted">
              Informe seu nome e como pretende presentear. O item ficará
              indisponível para os demais convidados.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor={`${id}-name`}
                  className="block text-sm font-medium text-forest"
                >
                  Seu nome
                </label>
                <input
                  id={`${id}-name`}
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border border-sage/40 bg-white/70 px-4 py-3 text-ink outline-none transition focus:border-moss focus:ring-1 focus:ring-moss/30"
                  placeholder="Nome completo"
                />
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-forest">
                  Como deseja presentear?
                </legend>
                <div className="mt-3 grid gap-3">
                  <MethodOption
                    id={`${id}-store`}
                    name={`${id}-method`}
                    checked={method === 'store'}
                    onChange={() => setMethod('store')}
                    title="Receberemos o Presente"
                    description={
                      gift.link
                        ? 'Compre na loja (ou pelo link de referência) e entregue ou envie para nossa casa.'
                        : 'Compre na loja de sua preferência e entregue pessoalmente ou envie para nossa casa.'
                    }
                  />
                  <MethodOption
                    id={`${id}-pix`}
                    name={`${id}-method`}
                    checked={method === 'pix'}
                    onChange={() => setMethod('pix')}
                    title="Contribuir via PIX"
                    description="Contribua com o valor do presente via PIX. Mostramos o QR Code após a reserva."
                  />
                  <MethodOption
                    id={`${id}-card`}
                    name={`${id}-method`}
                    checked={method === 'card'}
                    onChange={() => setMethod('card')}
                    title="Cartão via Mercado Pago"
                    description="PoC: abriremos um link fixo do MP (sem valor automático por presente)."
                  />
                </div>
              </fieldset>

              {method === 'pix' && (
                <div className="border border-sage/25 bg-white/50 p-4">
                  <p className="mb-4 text-center text-xs text-muted">
                    Após confirmar, o QR fica disponível. Valor sugerido:
                  </p>
                  <PixPayment amount={gift.price} giftName={gift.name} compact />
                </div>
              )}

              {method === 'card' && (
                <div className="border border-sage/25 bg-white/50 p-4">
                  <MercadoPagoLinkPanel
                    amount={gift.price}
                    giftName={gift.name}
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-800/90" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 text-sm font-medium text-muted transition hover:text-forest"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !method}
                  className="bg-forest px-6 py-3 text-sm font-medium tracking-wide text-linen transition hover:bg-moss disabled:opacity-60"
                >
                  {loading ? 'Reservando…' : 'Confirmar reserva'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'pix-done' && (
          <div className="text-center">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-moss">
              Reserva feita
            </p>
            <h3
              id={`${id}-title`}
              className="mt-2 font-display text-3xl font-medium text-forest"
            >
              Obrigado, {name.trim().split(' ')[0]}!
            </h3>
            <p className="mt-2 text-sm text-muted">
              Use o Pix abaixo para o valor de{' '}
              <strong className="text-forest">
                {gift.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
              . Os noivos confirmarão o pagamento no painel.
            </p>
            <div className="mt-6 border border-sage/25 bg-white/60 p-4">
              <PixPayment amount={gift.price} giftName={gift.name} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full bg-forest px-6 py-3 text-sm font-medium text-linen hover:bg-moss"
            >
              Concluir
            </button>
          </div>
        )}

        {step === 'card-done' && (
          <div className="text-center">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-moss">
              Reserva feita
            </p>
            <h3
              id={`${id}-title`}
              className="mt-2 font-display text-3xl font-medium text-forest"
            >
              Obrigado, {name.trim().split(' ')[0]}!
            </h3>
            <p className="mt-2 text-sm text-muted">
              O presente está reservado. Finalize o pagamento no Mercado Pago
              com o valor de{' '}
              <strong className="text-forest">
                {gift.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
              .
            </p>
            <div className="mt-6 border border-sage/25 bg-white/60 p-4">
              <MercadoPagoLinkPanel amount={gift.price} giftName={gift.name} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full border border-sage/40 px-6 py-3 text-sm font-medium text-forest hover:bg-mist"
            >
              Concluir
            </button>
          </div>
        )}

        {step === 'store-done' && (
          <div className="text-center">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-moss">
              Reserva feita
            </p>
            <h3
              id={`${id}-title`}
              className="mt-2 font-display text-3xl font-medium text-forest"
            >
              Obrigado, {name.trim().split(' ')[0]}!
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              O presente <strong className="text-forest">{gift.name}</strong> está
              reservado em seu nome.
              {gift.link
                ? ' Abrimos a loja em uma nova aba — se não abriu, use o botão abaixo.'
                : ' Compre e entregue/envie aos noivos quando preferir.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {gift.link && (
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-forest px-6 py-3 text-sm font-medium text-linen hover:bg-moss"
                >
                  Abrir loja
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="border border-sage/40 px-6 py-3 text-sm font-medium text-forest hover:bg-mist"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MethodOption({
  id,
  name,
  checked,
  onChange,
  title,
  description,
}: {
  id: string
  name: string
  checked: boolean
  onChange: () => void
  title: string
  description: string
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer gap-3 border px-4 py-3 transition ${
        checked
          ? 'border-forest bg-forest/5'
          : 'border-sage/35 bg-white/50 hover:border-sage'
      }`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 accent-[var(--color-forest)]"
      />
      <span className="text-left">
        <span className="block text-sm font-medium text-forest">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
          {description}
        </span>
      </span>
    </label>
  )
}
