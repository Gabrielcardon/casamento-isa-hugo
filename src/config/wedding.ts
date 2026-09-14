/**
 * Personalize os dados do casamento, Pix e InfinitePay aqui.
 */
export const wedding = {
  partnerOne: 'Hugo',
  partnerTwo: 'Isabella',
  dateLabel: '28.11.2026',
  dateLongLabel: '28 de novembro de 2026',
  dateISO: '2026-11-28',
  /** Horário da cerimônia (hora local) */
  timeLabel: '15:30',
  timeHour: 15,
  timeMinute: 30,
  city: 'Villa do Rocio',
  venue: 'Villa do Rocio',
  venueAddress: 'R. José Kuckla, 100 - Almirante Tamandaré, PR',
  venueAtmosphere:
    'Atmosfera sofisticada e romântica, inspirada no verão europeu, com estética leve, organizada e elegante. Queremos fugir um pouco do óbvio!',
  message:
    'Nosso casamento marca o início de uma nova etapa, cheia de sonhos e planos para construirmos juntos. Para quem quiser fazer parte desse começo de uma maneira especial, preparamos esta lista com carinho para o nosso novo lar.',

  /**
   * Dados do Pix — QR gerado a partir do Copia e Cola.
   */
  pixKey: '+5541996287018',
  pixName: 'Hugo Deiverson Ayres Ribeiro',
  pixCopiaECola:
    '00020126360014BR.GOV.BCB.PIX0114+55419962870185204000053039865802BR5925Hugo Deiverson Ayres Ribe6009SAO PAULO62140510285dTQOsoU6304C962',
  pixQrImage: '',

  /**
   * PoC InfinitePay — link fixo de pagamento (cobrança manual).
   *
   * Como gerar:
   * 1. Conta InfinitePay → Ferramentas → Link de pagamento / Cobrar
   * 2. Crie um link (valor aberto, se a conta permitir, ou valor base)
   * 3. Cole a URL abaixo
   *
   * Limitação desta PoC:
   * - O valor NÃO é preenchido automaticamente com o preço de cada presente
   * - O convidado precisa digitar o valor (ou pagar o valor do link)
   * - O site NÃO confirma pagamento sozinho — o admin marca "pago" manualmente
   *
   * Ex.: 'https://infinitepay.com/xxxxx' ou 'https://www.infinitepay.com.br/checkout/v1/redirect?pref_id=...'
   */
  infinitePayPaymentLink: 'https://link.infinitepay.com.br/casamentohugoeisa',
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

export function hasInfinitePayLink(giftLink?: string | null): boolean {
  return resolveInfinitePayLink(giftLink).startsWith('http')
}

export function getInfinitePayPaymentLink(): string {
  return wedding.infinitePayPaymentLink.trim()
}

/**
 * Prioridade: link do presente (com valor) → link geral (sem valor fixo).
 */
export function resolveInfinitePayLink(giftLink?: string | null): string {
  const specific = (giftLink ?? '').trim()
  if (specific.startsWith('http')) return specific
  return getInfinitePayPaymentLink()
}

export function isGiftSpecificInfinitePayLink(giftLink?: string | null): boolean {
  return (giftLink ?? '').trim().startsWith('http')
}