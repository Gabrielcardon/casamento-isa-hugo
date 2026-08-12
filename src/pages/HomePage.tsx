import { useState } from 'react'
import { GiftList } from '../components/GiftList'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { MessageSection } from '../components/MessageSection'
import { useGifts } from '../hooks/useGifts'
import { reserveGift } from '../services/gifts'
import type { FulfillmentMethod } from '../types/gift'

export function HomePage() {
  const { gifts, loading } = useGifts()
  const [toast, setToast] = useState<string | null>(null)

  async function handleReserve(
    giftId: string,
    reservedBy: string,
    method: FulfillmentMethod,
  ) {
    await reserveGift(giftId, { reservedBy, fulfillmentMethod: method })
    const messages: Record<FulfillmentMethod, string> = {
      pix: 'Presente reservado. Finalize o Pix pelo QR Code. Obrigado!',
      card: 'Presente reservado. Finalize no Mercado Pago (PoC). Obrigado!',
      store: 'Presente reservado com sucesso. Muito obrigado!',
    }
    setToast(messages[method])
    window.setTimeout(() => setToast(null), 4000)
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <MessageSection />
        <GiftList gifts={gifts} loading={loading} onReserve={handleReserve} />
      </main>
      <Footer />

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-champagne/30 bg-forest px-5 py-3 text-sm text-linen shadow-lg animate-fade-up"
          role="status"
        >
          {toast}
        </div>
      )}
    </>
  )
}
