import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "../context/AuthProvider";

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
    <html lang="en">
      <body className={`${inter.className} bg-dark-1`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
