"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession(); // Get authentication status

  return (
    <div className="bg-[#DFD9CF]">
      <ul className="flex justify-center">
        <li className="flex items-center justify-center space-x-1 text-lg py-2 px-4 font-bold text-black transition duration-200 ease-in-out hover:scale-105">
          <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
          </svg>
          <Link href="/">Home</Link>
        </li>

        {session ? (
          <>
            <li className="flex items-center justify-center space-x-1 text-lg py-2 px-4 font-bold text-black transition duration-200 ease-in-out hover:scale-105">
              <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="black" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
              </svg>
              <Link href="/entry">Entries</Link>

            </li>
            <li className="font-bold text-lg">
              <button onClick={() => signOut()} className="flex items-center justify-center space-x-1 text-lg py-2 px-4 font-bold text-[#D25875] transition duration-200 ease-in-out hover:scale-105">
                <span>Sign Out</span>
                <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                </svg>



              </button>
            </li>
          </>
        ) : (
          <li className="font-bold text-lg">
            <button onClick={() => signIn("google")} className="flex items-center justify-center space-x-1 text-lg py-2 px-4 font-bold text-[#83B592] transition duration-200 ease-in-out hover:scale-105">
              <span>Sign In</span>
              <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
              </svg>
            </button>
          </li>
        )}
      </ul>
      <hr />
    </div>
  );
};

export default Navbar;
