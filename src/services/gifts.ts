import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { demoGifts } from '../data/demoGifts'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type {
  FulfillmentMethod,
  Gift,
  GiftInput,
  ReservePayload,
} from '../types/gift'
import { isFulfillmentMethod } from '../types/gift'

const COLLECTION = 'gifts'
const STORAGE_KEY = 'casamento-demo-gifts-v2'

function normalizeGift(partial: Partial<Gift> & { id: string }): Gift {
  return {
    id: partial.id,
    name: String(partial.name ?? ''),
    description: String(partial.description ?? ''),
    price: Number(partial.price ?? 0),
    imageUrl: String(partial.imageUrl ?? ''),
    category: String(partial.category ?? ''),
    link: String(partial.link ?? ''),
    status: partial.status === 'reserved' ? 'reserved' : 'available',
    reservedBy: partial.reservedBy ?? null,
    reservedAt: partial.reservedAt ?? null,
    fulfillmentMethod: isFulfillmentMethod(partial.fulfillmentMethod)
      ? partial.fulfillmentMethod
      : null,
    pixPaid: Boolean(partial.pixPaid),
    order: Number(partial.order ?? 0),
  }
}

function loadDemo(): Gift[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Gift[]
      return parsed.map((g) => normalizeGift(g))
    }
  } catch {
    /* ignore */
  }
  return structuredClone(demoGifts).map((g) => normalizeGift(g))
}

function saveDemo(gifts: Gift[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gifts))
}

function mapDoc(id: string, data: Record<string, unknown>): Gift {
  return normalizeGift({
    id,
    name: data.name as string,
    description: data.description as string,
    price: data.price as number,
    imageUrl: data.imageUrl as string,
    category: data.category as string,
    link: data.link as string,
    status: data.status as Gift['status'],
    reservedBy: data.reservedBy as string | null,
    reservedAt: data.reservedAt as string | null,
    fulfillmentMethod: data.fulfillmentMethod as FulfillmentMethod | null,
    pixPaid: data.pixPaid as boolean,
    order: data.order as number,
  })
}

/** Escuta a lista em tempo real (Firestore) ou localStorage (modo demo). */
export function subscribeGifts(onChange: (gifts: Gift[]) => void): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    onChange(loadDemo())
    const handler = () => onChange(loadDemo())
    window.addEventListener('storage', handler)
    window.addEventListener('demo-gifts-changed', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('demo-gifts-changed', handler)
    }
  }

  const q = query(collection(db, COLLECTION), orderBy('order', 'asc'))
  return onSnapshot(q, (snap) => {
    const gifts = snap.docs.map((d) => mapDoc(d.id, d.data()))
    onChange(gifts)
  })
}

function notifyDemo() {
  window.dispatchEvent(new Event('demo-gifts-changed'))
}

export async function reserveGift(
  giftId: string,
  payload: ReservePayload,
): Promise<void> {
  const name = payload.reservedBy.trim()
  if (name.length < 2) throw new Error('Informe seu nome para reservar o presente.')
  if (!isFulfillmentMethod(payload.fulfillmentMethod)) {
    throw new Error('Escolha como deseja presentear.')
  }

  const reservation = {
    status: 'reserved' as const,
    reservedBy: name,
    reservedAt: new Date().toISOString(),
    fulfillmentMethod: payload.fulfillmentMethod,
    pixPaid: false,
  }

  if (!isFirebaseConfigured || !db) {
    const gifts = loadDemo()
    const gift = gifts.find((g) => g.id === giftId)
    if (!gift) throw new Error('Presente não encontrado.')
    if (gift.status === 'reserved') throw new Error('Este presente já foi reservado.')
    Object.assign(gift, reservation)
    saveDemo(gifts)
    notifyDemo()
    return
  }

  const ref = doc(db, COLLECTION, giftId)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('Presente não encontrado.')
    const data = snap.data()
    if (data.status === 'reserved') throw new Error('Este presente já foi reservado.')
    tx.update(ref, reservation)
  })
}

export async function createGift(input: GiftInput): Promise<void> {
  const payload = {
    name: input.name,
    description: input.description,
    price: input.price,
    imageUrl: input.imageUrl,
    category: input.category,
    link: input.link ?? '',
    status: input.status ?? 'available',
    reservedBy: null,
    reservedAt: null,
    fulfillmentMethod: null,
    pixPaid: false,
    order: input.order,
  }

  if (!isFirebaseConfigured || !db) {
    const gifts = loadDemo()
    gifts.push({
      id: `demo-${Date.now()}`,
      ...payload,
      status: 'available',
      reservedBy: null,
      reservedAt: null,
      fulfillmentMethod: null,
      pixPaid: false,
    })
    saveDemo(gifts)
    notifyDemo()
    return
  }

  await addDoc(collection(db, COLLECTION), payload)
}

export async function updateGift(
  giftId: string,
  patch: Partial<Omit<Gift, 'id'>>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const gifts = loadDemo()
    const idx = gifts.findIndex((g) => g.id === giftId)
    if (idx < 0) throw new Error('Presente não encontrado.')
    gifts[idx] = { ...gifts[idx], ...patch }
    saveDemo(gifts)
    notifyDemo()
    return
  }

  await updateDoc(doc(db, COLLECTION, giftId), patch)
}

export async function setPixPaid(giftId: string, pixPaid: boolean): Promise<void> {
  await updateGift(giftId, { pixPaid })
}

export async function deleteGift(giftId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    saveDemo(loadDemo().filter((g) => g.id !== giftId))
    notifyDemo()
    return
  }

  await deleteDoc(doc(db, COLLECTION, giftId))
}

export async function releaseGift(giftId: string): Promise<void> {
  await updateGift(giftId, {
    status: 'available',
    reservedBy: null,
    reservedAt: null,
    fulfillmentMethod: null,
    pixPaid: false,
  })
}

export async function importDemoGifts(): Promise<void> {
  for (const gift of demoGifts) {
    const { id: _id, ...rest } = gift
    await createGift({
      ...rest,
      status: 'available',
    })
  }
}
