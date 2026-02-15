import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";
import { MessageSellerButton } from "@/app/components/MessageSellerButton";
import CreatePostModal from "@/app/components/CreatePostModal";

type Post = {
  id: number;
  seller_id: number;
  title: string;
  description: string | null;
  price_cents: number;
  status: string;
};

async function getPosts(): Promise<Post[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is missing");

  const res = await fetch(`${base}/posts`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to load posts: ${res.status}`);
  }

  return (await res.json()) as Post[];
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function prettyStatus(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "Active";
  if (s === "sold") return "Sold";
  if (s === "pending") return "Pending";
  return status;
}

export default async function DashboardPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm opacity-70">
            Browse listings and message sellers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreatePostModal />

          <Link
            href="/inbox"
            className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            Inbox
          </Link>

          <LogoutButton />
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {posts.map((p) => {
          const status = (p.status || "active").toLowerCase();
          const showStatus = status !== "active";

          return (
            <div
              key={p.id}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-base font-semibold">
                      {p.title}
                    </p>

                    {showStatus && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs opacity-80">
                        {prettyStatus(p.status)}
                      </span>
                    )}
                  </div>

                  {p.description && (
                    <p className="mt-2 line-clamp-2 text-sm opacity-80">
                      {p.description}
                    </p>
                  )}

                  {!p.description && (
                    <p className="mt-2 text-sm opacity-60">
                      No description provided.
                    </p>
                  )}

                  <div className="mt-3">
                    <span className="rounded bg-white/10 px-2 py-1 text-sm">
                      {formatPrice(p.price_cents)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <MessageSellerButton postId={p.id} />
                </div>
              </div>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm opacity-80">No posts yet.</p>
            <p className="mt-1 text-xs opacity-60">
              Create the first listing to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
