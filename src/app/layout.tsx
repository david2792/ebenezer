import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartButton from '@/components/FloatingCartButton';

export const metadata: Metadata = {
  title: 'EBENEZER | Máquinas Profesionales para Gimnasio',
  description: 'Fabricación y venta de equipamiento de gimnasio de alta resistencia y biomecánica avanzada. Catálogo por grupo muscular y cotización directa.',
  keywords: 'gimnasio, maquinas de gimnasio, ebenezer, pesas, poleas, prensa 45, hack squat, equipamiento fitness',
  icons: {
    icon: '/images/pitbull-green-transparent.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#0A0C10] text-gray-100 antialiased selection:bg-[#00FF66] selection:text-black">
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
