"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession(); // Get authentication status

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Neurological Imaging Classification & Evaluation (NICE)
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          A tool to assist doctors in identifying certain areas in the brain if our machine learning model detects any abnormalities.
        </p>

        {session ? (
          <div className="mt-6">
            <p className="text-lg text-gray-900">Welcome, {session.user?.name}!</p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={() => signIn("google")}
          >
            Log in with Google
          </button>
        )}
      </div>
    </div>
  );
}
