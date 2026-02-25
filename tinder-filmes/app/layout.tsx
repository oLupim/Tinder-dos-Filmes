import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tinder dos Filmes",
  description: "Match de filmes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#0D0D1A'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '390px',
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at 50% 0%, #2D1B69 0%, #1A0F3C 35%, #0D0D1A 70%)'
          }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}