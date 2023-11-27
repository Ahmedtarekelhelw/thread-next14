"use client";

import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {children}
    </SessionProvider>
  );
};

export default AuthProvider;
