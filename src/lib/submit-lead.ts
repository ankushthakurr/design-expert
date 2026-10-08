export async function submitLead(source: string, data: Record<string, unknown>) {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, data, page: typeof window !== "undefined" ? window.location.pathname : undefined }),
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again or WhatsApp us.");
  return json;
}
