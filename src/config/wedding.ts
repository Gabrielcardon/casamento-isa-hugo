/**
 * Personalize os dados do casamento e do Pix aqui.
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
   * Dados do Pix — preencha com os dados reais dos noivos.
   * - pixKey: chave exibida e copiada (CPF, e-mail, telefone ou aleatória)
   * - pixName: nome que aparece no app do banco
   * - pixCopiaECola: (recomendado) código completo gerado no app do banco —
   *   o QR Code usa isso quando preenchido
   * - pixQrImage: se preferir sua própria imagem de QR, coloque em /public
   *   (ex.: '/pix-qr.png') e preencha o caminho; tem prioridade sobre o QR gerado
   */
  pixKey: 'chave-pix-dos-noivos',
  pixName: 'Isabella e Hugo',
  pixCopiaECola: '',
  pixQrImage: '',
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
