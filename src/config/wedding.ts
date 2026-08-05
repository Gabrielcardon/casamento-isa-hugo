/**
 * Personalize os dados do casamento e do Pix aqui.
 */
export const wedding = {
  partnerOne: 'Isa',
  partnerTwo: 'Hugo',
  dateLabel: '28 de novembro de 2026',
  dateISO: '2026-11-28',
  city: 'Curitiba',
  venue: '',
  message:
    'Sua presença já é o nosso maior presente. Se quiser nos presentear de outra forma, escolhemos com carinho esta lista para o nosso novo lar.',

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
  pixName: 'Isa e Hugo',
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
