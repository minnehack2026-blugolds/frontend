"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { useState } from "react";

export function MessageSellerButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (loading) return;

    setLoading(true);

    try {
      const convo = await apiFetch<{ id: number }>("/chat/conversations", {
        method: "POST",
        body: JSON.stringify({ post_id: postId }),
      });

      router.push(`/inbox/${convo.id}`);
    } catch (e: any) {
      const msg = e?.message ?? "";

      if (msg.includes("Unauthorized")) {
        router.push("/auth");
        return;
      }

      console.error("Failed to start conversation:", msg);
      alert(msg || "Unable to start conversation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
    >
      {loading ? "Opening…" : "Message seller"}
    </button>
  );
}
