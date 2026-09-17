import { CartItem } from './types';

export const CONTACT_INFO = {
  brandName: 'EBENEZER - Máquinas para Gimnasio',
  phoneDisplay: '+595 961 700 630',
  whatsappNumber: '595961700630',
  city: 'Ñemby',
  country: 'Paraguay',
  address: 'Ñemby, Paraguay. Envíos e instalaciones a todo el país.',
  email: 'ventas@ebenezermquinas.com',
  schedule: 'Lunes a Sábados: 07:30 a 18:30 hs'
};

export function getWhatsAppUrl(message?: string): string {
  const defaultText = `Hola Ebenezer Máquinas, me comunico desde la web para solicitar información y cotización de equipamiento de gimnasio en ${CONTACT_INFO.city}.`;
  const text = message || defaultText;
  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getMachineQuoteWhatsAppUrl(machineName: string, muscleGroup?: string): string {
  const groupText = muscleGroup ? ` (${muscleGroup})` : '';
  const message = `Hola Ebenezer Máquinas! Me interesa cotizar la máquina: *${machineName}*${groupText}. ¿Podrían brindarme precio, disponibilidad y opciones de entrega en ${CONTACT_INFO.city} / Paraguay?`;
  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getMultipleMachinesQuoteWhatsAppUrl(
  items: CartItem[],
  clientDetails?: { name?: string; city?: string; notes?: string }
): string {
  if (!items || items.length === 0) {
    return getWhatsAppUrl();
  }

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  let message = `🏋️‍♂️ *SOLICITUD DE COTIZACIÓN - EBENEZER MÁQUINAS*\n`;
  message += `¡Hola! Me comunico desde la web oficial para solicitar presupuesto de los siguientes equipos:\n\n`;

  items.forEach((item, index) => {
    const group = item.machine.muscleGroup ? ` (${item.machine.muscleGroup})` : '';
    message += `${index + 1}. *${item.machine.name}*${group}\n`;
    message += `   • Cantidad: *${item.quantity}* ${item.quantity === 1 ? 'unidad' : 'unidades'}\n`;
  });

  message += `\n📦 *Total de máquinas seleccionadas:* ${totalQuantity} ${totalQuantity === 1 ? 'equipo' : 'equipos'}`;

  if (clientDetails?.name?.trim()) {
    message += `\n👤 *Cliente / Gimnasio:* ${clientDetails.name.trim()}`;
  }

  if (clientDetails?.city?.trim()) {
    message += `\n📍 *Ciudad / Ubicación:* ${clientDetails.city.trim()}`;
  } else {
    message += `\n📍 *Destino:* ${CONTACT_INFO.country}`;
  }

  if (clientDetails?.notes?.trim()) {
    message += `\n📝 *Detalles adicionales:* ${clientDetails.notes.trim()}`;
  }

  message += `\n\n¿Podrían facilitarme los precios, plazos de fabricación y opciones de entrega/instalación? ¡Muchas gracias!`;

  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
