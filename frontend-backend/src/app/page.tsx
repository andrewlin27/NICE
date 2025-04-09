"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  const { data: session } = useSession(); // Get authentication status

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (session?.user?.email) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/users/userLogIn`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: session.user.email,
            }),
          });
        } catch (error) {
          console.error("Error adding user:", error);
        }
      }
    };

    addUserToDatabase();
  }, [session]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Neurological Imaging Classification & Evaluation (NICE)
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          A machine learning based tool to assist physicians in identifying any abnormalities in the brain.
        </p>

        {session ? (
          <div className="mt-6">
            <p className="text-lg text-gray-900">Welcome, {session.user?.name}!</p>
            <Button
              variant="primary"
              onClick={() => signOut()}
              className="mt-6 px-6 py-3 text-lg font-semibold"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => signIn("google")}
            className="mt-6 px-6 py-3 text-lg font-semibold"
          >
            Log in with Google
          </Button>
        )}
      </div>
    </div>
  );
}
