import type { Lead } from "./types";

/**
 * POSTs a lead-form submission to the n8n webhook, straight from the browser.
 *
 * Resolves to `true` on success and `false` on any failure — network, or an
 * unhappy webhook. It never throws: the caller decides what to do with a
 * failure, and for a meditation the answer is "carry on anyway".
 */
const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL ??
  "https://n8n-automation-n8n.zmsjji.easypanel.host/webhook/4b3828b5-6101-4391-b418-1f0ae9ba4df5";

export async function submitLead(
  lead: Lead,
  source: "debalina" | "connected" | "meditation" | "web" = "web",
): Promise<boolean> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, source }),
    });

    if (!res.ok) {
      console.error("lead submit failed", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("lead submit failed", err);
    return false;
  }
}
