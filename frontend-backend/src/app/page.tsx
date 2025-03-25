"use client";

import Link from 'next/link';
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">Neurological Imaging Classification & Evaluation (NICE)</h1>
        <p className="mt-4 text-lg text-gray-700">
          A tool to assist doctors to identify certain areas in the brain if our machine learning model detects any abnormalities. 
        </p>
        <button className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition" onClick={() => signIn("google")}>
          Log in
        </button>
      </div>
    </div>
  );
}
