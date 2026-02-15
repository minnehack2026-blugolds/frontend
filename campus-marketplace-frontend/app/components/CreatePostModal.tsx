"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

type PostCreate = {
  title: string;
  description?: string | null;
  price_cents: number;
};

function parsePriceToCents(input: string): number | null {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;

  const parts = cleaned.split(".");
  if (parts.length > 2) return null;

  const dollars = parts[0] ? Number(parts[0]) : 0;
  const centsPart = parts[1] ?? "";
  if (!Number.isFinite(dollars) || dollars < 0) return null;

  const cents =
    centsPart.length === 0 ? 0 : Number((centsPart + "00").slice(0, 2));

  if (!Number.isFinite(cents) || cents < 0) return null;

  return dollars * 100 + cents;
}

export default function CreatePostModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("15.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceCents = useMemo(() => parsePriceToCents(price), [price]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    setError(null);
  }

  function reset() {
    setTitle("");
    setDescription("");
    setPrice("15.00");
    setError(null);
  }

  async function submit() {
    const t = title.trim();
    const d = description.trim();

    if (!t) {
      setError("Add a title.");
      return;
    }
    if (priceCents == null) {
      setError("Add a valid price.");
      return;
    }

    const payload: PostCreate = {
      title: t,
      description: d ? d : null,
      price_cents: priceCents,
    };

    setLoading(true);
    setError(null);

    try {
      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      close();
      reset();
      router.refresh();
    } catch (e: any) {
      const msg = e?.message ?? "Unable to create post.";
      if (msg.includes("Unauthorized")) {
        router.push("/auth");
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
      >
        Create post
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Close"
            onClick={close}
          />

          <div className="relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">New post</h2>
                <p className="mt-1 text-xs opacity-70">
                  Share what you’re selling.
                </p>
              </div>

              <button
                onClick={close}
                className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs opacity-70">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nintendo Switch"
                  className="mt-1 w-full rounded border border-white/10 bg-transparent px-3 py-2 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                />
              </div>

              <div>
                <label className="text-xs opacity-70">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Condition, pickup details, what’s included…"
                  className="mt-1 w-full resize-none rounded border border-white/10 bg-transparent px-3 py-2 text-sm"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-xs opacity-70">Price</label>
                <div className="mt-1 flex items-center gap-2 rounded border border-white/10 bg-transparent px-3 py-2">
                  <span className="text-sm opacity-70">$</span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="15.00"
                    className="w-full bg-transparent text-sm outline-none"
                    inputMode="decimal"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                  />
                </div>
                <p className="mt-1 text-xs opacity-60">
                  Enter a number like 15 or 15.99
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  close();
                  reset();
                }}
                className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={submit}
                className="rounded bg-white/15 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
