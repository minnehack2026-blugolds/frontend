"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

type ConversationRow = {
  id: number;
  post_id: number;
  buyer_id: number;
  seller_id: number;
  updated_at: string;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_count?: number;
};

function formatTime(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function InboxPage() {
  const router = useRouter();

  const [convos, setConvos] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const data = await apiFetch<ConversationRow[]>("/chat/conversations");
      setConvos(data);
    } catch (e: any) {
      const msg = e?.message ?? "Unable to load inbox.";
      if (msg.includes("Unauthorized")) {
        router.push("/auth");
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <p className="text-xs opacity-70">{convos.length} conversations</p>
      </div>

      {error && (
        <div className="mt-6 rounded border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading && (
          <div className="rounded border border-white/10 bg-white/5 p-4">
            <p className="text-sm opacity-70">Loading…</p>
          </div>
        )}

        {!loading && !error && convos.length === 0 && (
          <div className="rounded border border-white/10 bg-white/5 p-6">
            <p className="text-sm opacity-80">No messages yet.</p>
            <p className="mt-1 text-xs opacity-60">
              Start a conversation from a post.
            </p>
          </div>
        )}

        {convos.map((c) => {
          const unread = c.unread_count ?? 0;

          return (
            <Link
              key={c.id}
              href={`/inbox/${c.id}`}
              className="block rounded border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Conversation #{c.id}
                  </p>
                  <p className="mt-1 truncate text-sm opacity-80">
                    {c.last_message?.trim()
                      ? c.last_message
                      : "No messages yet"}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-xs opacity-70">
                    {formatTime(c.updated_at)}
                  </p>

                  {unread > 0 && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
