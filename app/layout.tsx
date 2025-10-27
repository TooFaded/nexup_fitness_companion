import "styles/globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Nexup", description: "Know what’s next." };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-white text-brand-charcoal"}>
        {children}
      </body>
    </html>
  );
}
