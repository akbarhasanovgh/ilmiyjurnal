import { supabase } from "@/integrations/supabase/client";

export type ArticleStats = {
  manuscript_id: string;
  view_count: number;
  download_count: number;
  updated_at?: string;
};

const client = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: unknown }>;
  from: (t: string) => any;
};

function alreadyMarked(key: string): boolean {
  if (typeof window === "undefined") return true;
  if (window.sessionStorage.getItem(key)) return true;
  window.sessionStorage.setItem(key, "1");
  return false;
}

/** Atomically +1 view. Deduped per browser session so a refresh doesn't inflate. */
export async function incrementArticleView(manuscriptId: string): Promise<void> {
  if (!manuscriptId) return;
  if (alreadyMarked(`viewed:${manuscriptId}`)) return;
  await client.rpc("increment_article_view", { _manuscript_id: manuscriptId });
}

/** Atomically +1 download. Deduped per browser session per article. */
export async function incrementArticleDownload(manuscriptId: string): Promise<void> {
  if (!manuscriptId) return;
  if (alreadyMarked(`downloaded:${manuscriptId}`)) return;
  await client.rpc("increment_article_download", { _manuscript_id: manuscriptId });
}

/** Top N by views (single cheap query used by the homepage rail). */
export async function getTopViewedArticles(limit = 5): Promise<ArticleStats[]> {
  const { data, error } = await client
    .from("article_views")
    .select("manuscript_id, view_count, download_count, updated_at")
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as ArticleStats[];
}

/** Single article stats (used on the article detail page). */
export async function getArticleStats(manuscriptId: string): Promise<ArticleStats> {
  const empty: ArticleStats = { manuscript_id: manuscriptId, view_count: 0, download_count: 0 };
  if (!manuscriptId) return empty;
  const { data, error } = await client
    .from("article_views")
    .select("manuscript_id, view_count, download_count, updated_at")
    .eq("manuscript_id", manuscriptId)
    .maybeSingle();
  if (error || !data) return empty;
  return data as ArticleStats;
}

/**
 * Batch stats for a list of manuscript IDs. One request, low cost.
 * Returns a Map keyed by manuscript_id; missing rows default to 0/0.
 */
export async function getArticleStatsMap(
  manuscriptIds: string[],
): Promise<Map<string, ArticleStats>> {
  const map = new Map<string, ArticleStats>();
  const ids = Array.from(new Set(manuscriptIds.filter(Boolean)));
  if (ids.length === 0) return map;
  const { data, error } = await client
    .from("article_views")
    .select("manuscript_id, view_count, download_count, updated_at")
    .in("manuscript_id", ids);
  if (error || !data) return map;
  for (const row of data as ArticleStats[]) {
    map.set(row.manuscript_id, row);
  }
  return map;
}
