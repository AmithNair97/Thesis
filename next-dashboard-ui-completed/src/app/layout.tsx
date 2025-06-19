import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import axios from "axios";

axios.defaults.withCredentials = true;

// 1. Import the DatasetProvider
import { DatasetProvider } from "@/context/DatasetContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Red Pitaya Database",
  description: "Data Management System",
  icons: {
    icon: "/RP.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/RP.png" />
      </head>
      <body className={inter.className}>
        {/* 2. Wrap all content with the DatasetProvider */}
        <DatasetProvider>
          {children}
        </DatasetProvider>
      </body>
    </html>
  );
}
