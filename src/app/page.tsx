"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { session, loginAs } = useAuth();
  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="bg-white border rounded-2xl p-6 max-w-sm w-full text-center space-y-3">
          <h1 className="text-lg font-semibold">
            Welcome to MembershipManager
          </h1>
          <p className="text-sm text-gray-600">
            Choose a demo role to continue:
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => loginAs("ADMIN")}>
              Admin
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => loginAs("MEMBER")}
            >
              Member
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Or{" "}
            <Link className="text-blue-600" href="/login">
              go to login
            </Link>
          </p>
        </div>
      </div>
    );
  }
  const isAdmin = session.user?.role === "ADMIN";
  return (
    <div className="p-6">
      <Link
        className="text-blue-600 underline"
        href={isAdmin ? "/dashboard" : "/(member)/dashboard"}
      >
        Open Dashboard
      </Link>
    </div>
  );
}
