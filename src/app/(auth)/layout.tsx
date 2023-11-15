import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Thread",
  description: "Thread App With Next14",
};

const inter = Inter({ subsets: ["latin"] });
type RootLayoutType = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutType) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
