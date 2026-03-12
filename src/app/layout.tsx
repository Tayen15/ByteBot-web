import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import ConditionalShell from "@/components/ConditionalShell";
import Providers from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ByteBot - Dashboard",
  description: "Manage your ByteBot settings easily through the dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col bg-dark-primary text-text-primary`}
      >
        <Providers>
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
