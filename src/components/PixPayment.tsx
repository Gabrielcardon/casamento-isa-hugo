import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { getPixQrPayload, hasPixConfigured, wedding } from '../config/wedding'

interface PixPaymentProps {
  amount?: number
  giftName?: string
  compact?: boolean
}

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function PixPayment({ amount, giftName, compact = false }: PixPaymentProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const payload = getPixQrPayload()
  const copyValue = wedding.pixCopiaECola.trim() || wedding.pixKey.trim()
  const imageSrc = wedding.pixQrImage.trim() || qrDataUrl

  useEffect(() => {
    if (wedding.pixQrImage.trim() || !payload) {
      setQrDataUrl(null)
      return
    }

    let cancelled = false
    QRCode.toDataURL(payload, {
      width: compact ? 180 : 220,
      margin: 2,
      color: { dark: '#14302a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [payload, compact])

  async function copyKey() {
    if (!copyValue) return
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      /* ignore */
    }
  }

  if (!hasPixConfigured()) {
    return (
      <p className="text-sm text-muted">
        Configuração de Pix pendente. Os noivos ainda vão preencher a chave em{' '}
        <code className="text-xs">src/config/wedding.ts</code>.
      </p>
    )
  }

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-3' : 'gap-4'}`}>
      <div className="border border-sage/30 bg-white p-3 shadow-sm">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="QR Code Pix"
            width={compact ? 180 : 220}
            height={compact ? 180 : 220}
            className="block h-auto w-[180px] md:w-[220px]"
          />
        ) : (
          <div
            className="flex items-center justify-center bg-mist text-sm text-muted"
            style={{ width: compact ? 180 : 220, height: compact ? 180 : 220 }}
          >
            Gerando QR…
          </div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-moss">Pix</p>
        {giftName && (
          <p className="mt-1 font-display text-xl text-forest">{giftName}</p>
        )}
        {typeof amount === 'number' && amount > 0 && (
          <p className="mt-1 font-sans text-sm font-semibold tabular-nums text-forest">
            Valor sugerido: {formatPrice(amount)}
          </p>
        )}
        {wedding.pixName && (
          <p className="mt-1 text-sm text-muted">Recebedor: {wedding.pixName}</p>
        )}
      </div>

      {wedding.pixKey && (
        <p className="max-w-xs break-all font-mono text-xs text-ink/80">
          {wedding.pixKey}
        </p>
      )}

      <button
        type="button"
        onClick={copyKey}
        className="border border-forest/30 bg-forest/5 px-5 py-2.5 text-sm font-medium text-forest transition hover:bg-forest hover:text-linen"
      >
        {copied ? 'Copiado!' : 'Copiar chave / Pix'}
      </button>

      <p className="max-w-sm text-xs leading-relaxed text-muted">
        Abra o app do seu banco, escaneie o QR ou cole a chave. Informe o valor
        {typeof amount === 'number' && amount > 0
          ? ` (${formatPrice(amount)})`
          : ''}{' '}
        se o QR não trouxer o valor fixo.
      </p>
    </div>
  )
}
