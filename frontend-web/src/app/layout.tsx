import type { Metadata } from "next";
import "./globals.css";
import "@/styles/theme.css";
import { AuthProvider } from "@/context/AuthContext";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Secure bookstore management with Online Shopping Capabailities"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}