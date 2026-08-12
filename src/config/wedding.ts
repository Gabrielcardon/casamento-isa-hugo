/**
 * Personalize os dados do casamento, Pix e Mercado Pago aqui.
 */
export const wedding = {
  partnerOne: 'Isabella',
  partnerTwo: 'Hugo',
  dateLabel: '28.11.2026',
  dateISO: '2026-11-28',
  city: 'Villa do Rocio',
  venue: 'Villa do Rocio',
  message:
    'A maior alegria para nós é celebrar este dia com as pessoas que amamos. Se desejar nos presentear, preparamos esta lista com carinho para nos ajudar a dar início ao nosso novo lar. Agradecemos por fazer parte deste momento tão especial!',

  /**
   * Dados do Pix — QR gerado a partir do Copia e Cola.
   */
  pixKey: '+5541996287018',
  pixName: 'Hugo Deiverson Ayres Ribeiro',
  pixCopiaECola:
    '00020126360014BR.GOV.BCB.PIX0114+55419962870185204000053039865802BR5925Hugo Deiverson Ayres Ribe6009SAO PAULO62140510285dTQOsoU6304C962',
  pixQrImage: '',

  /**
   * PoC Mercado Pago — link fixo de pagamento (cobrança manual).
   *
   * Como gerar:
   * 1. Conta Mercado Pago → Ferramentas → Link de pagamento / Cobrar
   * 2. Crie um link (valor aberto, se a conta permitir, ou valor base)
   * 3. Cole a URL abaixo
   *
   * Limitação desta PoC:
   * - O valor NÃO é preenchido automaticamente com o preço de cada presente
   * - O convidado precisa digitar o valor (ou pagar o valor do link)
   * - O site NÃO confirma pagamento sozinho — o admin marca "pago" manualmente
   *
   * Ex.: 'https://mpago.la/xxxxx' ou 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...'
   */
  mercadoPagoPaymentLink: 'https://link.mercadopago.com.br/casamentohugoeisa',
} as const

export const coupleDisplayName = `${wedding.partnerOne} & ${wedding.partnerTwo}`

/** Texto codificado no QR (Copia e Cola do banco tem prioridade). */
export function getPixQrPayload(): string {
  const copia = wedding.pixCopiaECola.trim()
  if (copia) return copia
  return wedding.pixKey.trim()
}

export function hasPixConfigured(): boolean {
  return Boolean(wedding.pixKey.trim() || wedding.pixCopiaECola.trim() || wedding.pixQrImage.trim())
}

export function hasMercadoPagoLink(): boolean {
  return wedding.mercadoPagoPaymentLink.trim().startsWith('http')
}

export function getMercadoPagoPaymentLink(): string {
  return wedding.mercadoPagoPaymentLink.trim()
}
