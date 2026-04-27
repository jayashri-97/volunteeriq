import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VolunteerIQ — Intelligent Volunteer Coordination",
  description:
    "AI-powered disaster relief coordination platform. Smart resource allocation for NGOs and volunteer networks across India.",
  keywords: ["volunteer", "coordination", "disaster relief", "NGO", "AI", "India", "earthquake", "cyclone", "flood"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg1 text-text1 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

