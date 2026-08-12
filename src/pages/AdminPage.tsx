import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { coupleDisplayName } from '../config/wedding'
import { useAuth } from '../hooks/useAuth'
import { useGifts } from '../hooks/useGifts'
import {
  createGift,
  deleteGift,
  importDemoGifts,
  releaseGift,
  setPixPaid,
} from '../services/gifts'
import type { Gift, GiftInput } from '../types/gift'
import { isPaymentFulfillment } from '../types/gift'

const emptyForm: GiftInput = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: '',
  link: '',
  order: 1,
}

function methodLabel(gift: Gift): string {
  if (gift.status !== 'reserved') return 'Disponível'
  if (gift.fulfillmentMethod === 'pix') {
    return gift.pixPaid
      ? `Pix · pago · ${gift.reservedBy ?? '—'}`
      : `Pix · aguardando pagamento · ${gift.reservedBy ?? '—'}`
  }
  if (gift.fulfillmentMethod === 'card') {
    return gift.pixPaid
      ? `Cartão (MP) · pago · ${gift.reservedBy ?? '—'}`
      : `Cartão (MP) · aguardando · ${gift.reservedBy ?? '—'}`
  }
  if (gift.fulfillmentMethod === 'store') {
    return `Presente físico · ${gift.reservedBy ?? '—'}`
  }
  return `Reservado por ${gift.reservedBy ?? '—'}`
}

export function AdminPage() {
  const { isAdmin, loading: authLoading, login, logout, isDemoMode } = useAuth()
  const { gifts, loading } = useGifts()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [form, setForm] = useState<GiftInput>(emptyForm)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const paymentPending = gifts.filter(
    (g) =>
      g.status === 'reserved' &&
      isPaymentFulfillment(g.fulfillmentMethod) &&
      !g.pixPaid,
  )
  const paymentPaidList = gifts.filter(
    (g) =>
      g.status === 'reserved' &&
      isPaymentFulfillment(g.fulfillmentMethod) &&
      g.pixPaid,
  )

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoginError(null)
    try {
      await login(email, password)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Falha no login')
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      await createGift({
        ...form,
        price: Number(form.price),
        order: Number(form.order) || gifts.length + 1,
      })
      setForm({ ...emptyForm, order: gifts.length + 2 })
      setMsg('Presente adicionado.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setBusy(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-linen text-muted">
        Carregando…
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-section-wash px-6">
        <div className="w-full max-w-md border border-sage/30 bg-white/50 p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-moss">Área restrita</p>
          <h1 className="mt-2 font-display text-3xl text-forest">Admin</h1>
          <p className="mt-2 text-sm text-muted">
            {isDemoMode
              ? 'Modo demo: use qualquer e-mail e a senha admin.'
              : 'Entre com o e-mail e senha do Firebase Authentication.'}
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-forest" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-sage/40 px-3 py-2 outline-none focus:border-moss"
              />
            </div>
            <div>
              <label className="text-sm text-forest" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-sage/40 px-3 py-2 outline-none focus:border-moss"
              />
            </div>
            {loginError && <p className="text-sm text-red-800">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-forest py-3 text-sm font-medium text-linen hover:bg-moss"
            >
              Entrar
            </button>
          </form>
          <Link to="/" className="mt-6 block text-center text-sm text-moss hover:underline">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-linen">
      <header className="border-b border-sage/25 bg-white/60 px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-moss">Admin</p>
            <h1 className="font-display text-2xl text-forest">{coupleDisplayName}</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="border border-sage/40 px-4 py-2 text-sm text-forest hover:bg-mist"
            >
              Ver site
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="bg-forest px-4 py-2 text-sm text-linen hover:bg-moss"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-12 px-6 py-10">
        {isDemoMode && (
          <p className="border border-champagne/40 bg-champagne/10 px-4 py-3 text-sm text-forest">
            Você está no modo demo (sem Firebase). Dados ficam no navegador. Siga o
            CONFIGURACAO.md para conectar o projeto de verdade.
          </p>
        )}

        {/* Resumo pagamentos (Pix + cartão MP) */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="border border-champagne/40 bg-champagne/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-moss">
              Aguardando pagamento
            </p>
            <p className="mt-1 font-display text-3xl text-forest">
              {paymentPending.length}
            </p>
            <p className="text-sm text-muted">Pix ou cartão (Mercado Pago)</p>
          </div>
          <div className="border border-sage/30 bg-white/50 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-moss">
              Pagamentos confirmados
            </p>
            <p className="mt-1 font-display text-3xl text-forest">
              {paymentPaidList.length}
            </p>
            <p className="text-sm text-muted">marcados como recebidos</p>
          </div>
        </section>

        {paymentPending.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-forest">
              Confirmar pagamentos
            </h2>
            <p className="mt-2 text-sm text-muted">
              Pix ou cartão (PoC link fixo do MP). Quando o valor chegar, marque
              como pago.
            </p>
            <ul className="mt-6 divide-y divide-sage/25 border border-sage/25">
              {paymentPending.map((gift) => (
                <li
                  key={gift.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-forest">{gift.name}</p>
                    <p className="text-sm text-muted">
                      {gift.reservedBy} ·{' '}
                      {gift.fulfillmentMethod === 'card' ? 'Cartão MP' : 'Pix'} ·{' '}
                      {gift.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-forest px-4 py-2 text-sm text-linen hover:bg-moss"
                    onClick={() => setPixPaid(gift.id, true)}
                  >
                    Marcar como pago
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl text-forest">Novo presente</h2>
          <form
            onSubmit={handleCreate}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <Field
              label="Nome"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <Field
              label="Categoria"
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            />
            <Field
              label="Preço (R$)"
              type="number"
              value={String(form.price || '')}
              onChange={(v) => setForm((f) => ({ ...f, price: Number(v) }))}
              required
            />
            <Field
              label="Ordem"
              type="number"
              value={String(form.order || '')}
              onChange={(v) => setForm((f) => ({ ...f, order: Number(v) }))}
            />
            <Field
              label="URL da imagem"
              value={form.imageUrl}
              onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
              className="sm:col-span-2"
            />
            <Field
              label="Link da loja (opcional — para quem escolher comprar no site)"
              value={form.link}
              onChange={(v) => setForm((f) => ({ ...f, link: v }))}
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <label className="text-sm text-forest">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="mt-1 w-full border border-sage/40 px-3 py-2 outline-none focus:border-moss"
              />
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="bg-forest px-5 py-2.5 text-sm text-linen hover:bg-moss disabled:opacity-60"
              >
                {busy ? 'Salvando…' : 'Adicionar presente'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true)
                  setMsg(null)
                  try {
                    await importDemoGifts()
                    setMsg('Presentes demo importados.')
                  } catch (err) {
                    setMsg(err instanceof Error ? err.message : 'Erro na importação')
                  } finally {
                    setBusy(false)
                  }
                }}
                className="border border-sage/40 px-5 py-2.5 text-sm text-forest hover:bg-mist"
              >
                Importar presentes demo
              </button>
            </div>
            {msg && <p className="text-sm text-moss sm:col-span-2">{msg}</p>}
          </form>
        </section>

        <section>
          <h2 className="font-display text-2xl text-forest">
            Presentes ({loading ? '…' : gifts.length})
          </h2>
          <ul className="mt-6 divide-y divide-sage/25 border border-sage/25">
            {gifts.map((gift) => (
              <li
                key={gift.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-forest">{gift.name}</p>
                  <p className="text-sm text-muted">
                    {gift.category || 'Sem categoria'} ·{' '}
                    {gift.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}{' '}
                    · {methodLabel(gift)}
                  </p>
                  {gift.status === 'reserved' &&
                    isPaymentFulfillment(gift.fulfillmentMethod) && (
                    <p
                      className={`mt-1 text-xs font-medium ${
                        gift.pixPaid ? 'text-moss' : 'text-amber-800'
                      }`}
                    >
                      {gift.pixPaid
                        ? gift.fulfillmentMethod === 'card'
                          ? 'Cartão MP confirmado'
                          : 'Pix confirmado'
                        : gift.fulfillmentMethod === 'card'
                          ? 'Aguardando pagamento (Mercado Pago)'
                          : 'Aguardando confirmação do Pix'}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {gift.status === 'reserved' &&
                    isPaymentFulfillment(gift.fulfillmentMethod) &&
                    !gift.pixPaid && (
                      <button
                        type="button"
                        className="bg-forest px-3 py-1.5 text-sm text-linen hover:bg-moss"
                        onClick={() => setPixPaid(gift.id, true)}
                      >
                        Marcar pago
                      </button>
                    )}
                  {gift.status === 'reserved' &&
                    isPaymentFulfillment(gift.fulfillmentMethod) &&
                    gift.pixPaid && (
                      <button
                        type="button"
                        className="border border-sage/40 px-3 py-1.5 text-sm hover:bg-mist"
                        onClick={() => setPixPaid(gift.id, false)}
                      >
                        Desfazer pago
                      </button>
                    )}
                  {gift.status === 'reserved' && (
                    <button
                      type="button"
                      className="border border-sage/40 px-3 py-1.5 text-sm hover:bg-mist"
                      onClick={() => releaseGift(gift.id)}
                    >
                      Liberar
                    </button>
                  )}
                  <button
                    type="button"
                    className="border border-red-200 px-3 py-1.5 text-sm text-red-900 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Remover “${gift.name}”?`)) deleteGift(gift.id)
                    }}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
            {!loading && gifts.length === 0 && (
              <li className="px-4 py-8 text-center text-muted">
                Nenhum presente ainda. Adicione o primeiro acima.
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label className="text-sm text-forest">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-sage/40 px-3 py-2 outline-none focus:border-moss"
      />
    </div>
  )
}
