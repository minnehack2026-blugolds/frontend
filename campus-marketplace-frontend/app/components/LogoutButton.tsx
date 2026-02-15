"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    router.push("/auth");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
    >
      Logout
    </button>
  );
}
