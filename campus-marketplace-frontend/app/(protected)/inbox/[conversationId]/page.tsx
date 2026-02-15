"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  created_at: string;
};

function formatTime(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();

  const conversationId = useMemo(() => {
    const raw = (params as any)?.conversationId;
    return Number(raw);
  }, [params]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const myIdRef = useRef<number | null>(null);

  function inferMyIdFromLocalStorage(): number | null {
    try {
      const v = localStorage.getItem("me_id");
      if (!v) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }

  function rememberMyId(id: number) {
    myIdRef.current = id;
    try {
      localStorage.setItem("me_id", String(id));
    } catch {}
  }

  async function markRead() {
    try {
      await apiFetch(`/chat/conversations/${conversationId}/read`, {
        method: "POST",
      });
    } catch {}
  }

  async function load() {
    try {
      setError(null);

      const data = await apiFetch<Message[]>(
        `/chat/conversations/${conversationId}/messages?limit=50`,
      );

      setMessages(data);
      setLoading(false);

      await markRead();
    } catch (e: any) {
      const msg = e?.message ?? "Unable to load messages.";
      if (msg.includes("Unauthorized")) {
        router.push("/auth");
        return;
      }
      setError(msg);
      setLoading(false);
    }
  }

  async function send() {
    const body = draft.trim();
    if (!body) return;

    try {
      setError(null);

      const msg = await apiFetch<Message>(
        `/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ body }),
        },
      );

      rememberMyId(msg.sender_id);

      setMessages((prev) => [...prev, msg]);
      setDraft("");

      await markRead();
    } catch (e: any) {
      const msg = e?.message ?? "Unable to send message.";
      if (msg.includes("Unauthorized")) {
        router.push("/auth");
        return;
      }
      setError(msg);
    }
  }

  useEffect(() => {
    if (myIdRef.current == null) myIdRef.current = inferMyIdFromLocalStorage();
  }, []);

  useEffect(() => {
    if (!Number.isFinite(conversationId)) return;

    load();

    const t = setInterval(load, 4000);

    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const meId = myIdRef.current;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-2xl flex-col px-6 py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <button
          onClick={() => router.push("/inbox")}
          className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="mt-6 flex-1 overflow-auto rounded border border-white/10 bg-white/5 p-4">
        {loading && <p className="text-sm opacity-70">Loading conversation…</p>}

        {!loading && messages.length === 0 && (
          <p className="text-sm opacity-70">No messages yet.</p>
        )}

        <div className="space-y-3">
          {messages.map((m) => {
            const isMine = meId != null ? m.sender_id === meId : false;

            return (
              <div
                key={m.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={[
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    isMine
                      ? "bg-white/15"
                      : "bg-white/10 border border-white/10",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className="mt-1 text-[11px] opacity-60">
                    {formatTime(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 rounded border border-white/10 bg-transparent px-3 py-2 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          onClick={send}
          className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          Send
        </button>
      </div>

      <p className="mt-3 text-xs opacity-50">
        Tip: open the conversation to clear unread counts.
      </p>
    </div>
  );
}
