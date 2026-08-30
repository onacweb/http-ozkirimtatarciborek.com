export const WHATSAPP_NUMBER = '905000000000';
export const WHATSAPP_MESSAGE = 'Merhaba, ONAÇ WEB Studio hakkında bilgi almak istiyorum.';

export function getWhatsAppLink(message?: string): string {
  const text = encodeURIComponent(message || WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
