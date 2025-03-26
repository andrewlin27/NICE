"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession(); // Get authentication status

  return (
    <div>
      <ul className="flex justify-center">
        <li className="font-bold text-lg py-2 px-4">
          <Link href="/">Home</Link>
        </li>
        
        {session ? (
          <>
            <li className="font-bold text-lg py-2 px-4">
              <Link href="/entry">Entries</Link>
            </li>
            <li className="font-bold text-lg py-2 px-4">
              <button onClick={() => signOut()} className="text-red-500">
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <li className="font-bold text-lg py-2 px-4">
            <button onClick={() => signIn("google")} className="text-blue-500">
              Sign In
            </button>
          </li>
        )}
      </ul>
      <hr />
    </div>
  );
};

export default Navbar;
