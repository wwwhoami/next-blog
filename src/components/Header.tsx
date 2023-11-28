"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "src/context/userContext";
import Search from "./Search";
import UserMenu from "./menu/UserMenu";

type Props = {};

const Header = (props: Props) => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white bg-opacity-60 py-2 shadow backdrop-blur-xl backdrop-filter">
      <div className="container mx-auto flex flex-col flex-wrap items-center md:flex-row">
        <Link href="/" passHref className="focus-ring ml-3 rounded-xl text-2xl">
          <span className="font-semibold text-indigo-600 hover:text-indigo-700">
            Next
          </span>
          Blog
        </Link>
        <Search />
        <nav className="flex flex-wrap items-center justify-end space-x-4 text-base md:ml-auto">
          <Link
            href="/blog"
            className="focus-ring rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="focus-ring rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            About
          </Link>
          {!user?.id && (
            <>
              <Link
                href="/signUp"
                scroll={false}
                replace={pathname === "/signIn" || pathname === "/signUp"}
                className="focus-ring rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign up
              </Link>
              <Link
                href="/signIn"
                scroll={false}
                replace={pathname === "/signIn" || pathname === "/signUp"}
                className="focus-ring rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>
            </>
          )}
          {user && <UserMenu />}
        </nav>
      </div>
    </header>
  );
};

export default Header;
