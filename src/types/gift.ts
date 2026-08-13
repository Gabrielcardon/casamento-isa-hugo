export type GiftStatus = 'available' | 'reserved'

/** Como o convidado pretende cumprir o presente */
export type FulfillmentMethod = 'store' | 'pix' | 'card'

export interface Gift {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  link: string
  /**
   * Link Mercado Pago deste presente (valor já definido no MP).
   * Vazio = usa o link geral sem valor fixo em wedding.ts
   */
  mercadoPagoLink: string
  status: GiftStatus
  reservedBy: string | null
  reservedAt: string | null
  /** null enquanto disponível */
  fulfillmentMethod: FulfillmentMethod | null
  /** Pix ou cartão (MP) — admin confirma o recebimento */
  pixPaid: boolean
  order: number
}

export type GiftInput = Omit<
  Gift,
  'id' | 'status' | 'reservedBy' | 'reservedAt' | 'fulfillmentMethod' | 'pixPaid'
> & {
  status?: GiftStatus
}

export interface ReservePayload {
  reservedBy: string
  fulfillmentMethod: FulfillmentMethod
}

export function isFulfillmentMethod(v: unknown): v is FulfillmentMethod {
  return v === 'store' || v === 'pix' || v === 'card'
}

export function isPaymentFulfillment(
  method: FulfillmentMethod | null,
): method is 'pix' | 'card' {
  return method === 'pix' || method === 'card'
}
