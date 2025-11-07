import "styles/globals.css";
import { Inter } from "next/font/google";
import DarkModeToggle from "@/components/DarkModeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Nexup", description: "Know what’s next." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-background text-foreground transition-colors duration-300 min-h-screen"}>
        <DarkModeToggle />
        {children}
      </body>
    </html>
  );
}
