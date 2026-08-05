export type GiftStatus = 'available' | 'reserved'

/** Como o convidado pretende cumprir o presente */
export type FulfillmentMethod = 'store' | 'pix'

export interface Gift {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  link: string
  status: GiftStatus
  reservedBy: string | null
  reservedAt: string | null
  /** null enquanto disponível */
  fulfillmentMethod: FulfillmentMethod | null
  /** Só faz sentido quando fulfillmentMethod === 'pix' */
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
