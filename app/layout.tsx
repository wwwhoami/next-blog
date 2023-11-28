import Header from "@/components/Header";
import "@/styles/globals.css";
import { Metadata } from "next";
import { FC, ReactNode } from "react";
import "react-toastify/dist/ReactToastify.min.css";
import ToastProvider from "src/context/ToastProvider";
import UserProvider from "src/context/userContext";

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export const metadata: Metadata = {
  title: "NextBlog",
  keywords: "development, programming, IT",
  description: "The next info and news in dev",
};

const RootLayout: FC<RootLayoutProps> = ({ children, modal }) => {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <Header />
          <ToastProvider>
            <main className="container mx-auto my-7 max-w-screen-2xl px-5">
              {children}
            </main>
            {modal}
          </ToastProvider>
        </body>
      </html>
    </UserProvider>
  );
};

export default RootLayout;
