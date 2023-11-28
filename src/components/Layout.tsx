import Head from "next/head";
import { ReactNode } from "react";
import Header from "./Header";

type Props = {
  title: string;
  children: ReactNode;
  keywords: string;
  description: string;
};

const Layout = ({ title, children, keywords, description }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link type="image/x-icon" rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Header />

      <main className="container mx-auto my-7 max-w-screen-2xl px-5">
        {children}
      </main>
    </div>
  );
};

export default Layout;
