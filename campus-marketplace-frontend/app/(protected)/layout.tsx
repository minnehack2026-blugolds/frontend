import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/auth");
  }

  const API = process.env.NEXT_PUBLIC_API_URL;
  if (!API) throw new Error("Missing NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      // pass cookie through to backend
      Cookie: `access_token=${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/auth");
  }

  return <>{children}</>;
}
